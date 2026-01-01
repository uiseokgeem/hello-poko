// src/components/Admin/ClassManagement/AdminClassAssignmentStep1.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Table, Select, message } from "antd";
import { fetchClassAssignments, saveClassAssignments } from "../../../api/adminApi";
import { ClassManagementButtonGroup } from "./ClassManagementButtons";

const { Option } = Select;

// 새 구조: 부모(AdminClassAssignmentPage)가 refreshKey/onSaved를 내려줌
// - refreshKey 변경 시: 자동 재조회(load)
// - 저장 성공 시: onSaved() 호출 -> 다른 탭들도 같이 최신화
const AdminClassAssignmentStep1 = ({ refreshKey, onSaved }) => {
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([]);
  const [headCandidates, setHeadCandidates] = useState([]);
  const [assistantCandidates, setAssistantCandidates] = useState([]);

  const [changes, setChanges] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchClassAssignments();

      const newRows = data.rows || [];
      setRows(newRows);
      setHeadCandidates(data.head_candidates || []);
      setAssistantCandidates(data.assistant_candidates || []);

      const initial = {};
      newRows.forEach((r) => {
        initial[r.class_name] = {
          head_id: r.current_head_id ?? null,
          assistant_id: r.current_assistant_id ?? null,
        };
      });
      setChanges(initial);
    } catch (e) {
      message.error("반 편성 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const updateChange = useCallback((className, patch) => {
    setChanges((prev) => ({
      ...prev,
      [className]: {
        ...(prev[className] || { head_id: null, assistant_id: null }),
        ...patch,
      },
    }));
  }, []);

  const validateBeforeSave = useCallback(() => {
    const used = new Map();

    for (const r of rows) {
      const cn = r.class_name;
      const headId = changes?.[cn]?.head_id;
      const assistantId = changes?.[cn]?.assistant_id;

      if (!headId) return `${cn} 반: 담당 선생님은 필수입니다.`;
      if (assistantId && assistantId === headId) return `${cn} 반: 담당/보조가 같은 사람입니다.`;

      for (const tid of [headId, assistantId]) {
        if (!tid) continue;
        if (used.has(tid)) return `중복 배정: ${used.get(tid)} / ${cn} 에 같은 선생님이 선택되었습니다.`;
        used.set(tid, cn);
      }
    }

    return null;
  }, [rows, changes]);

  const handleSave = useCallback(async () => {
    const err = validateBeforeSave();
    if (err) {
      message.error(err);
      return;
    }

    const payload = rows.map((r) => {
      const cn = r.class_name;
      return {
        class_name: cn,
        head_id: changes[cn]?.head_id,
        assistant_id: changes[cn]?.assistant_id ?? null,
      };
    });

    setLoading(true);
    try {
      await saveClassAssignments(payload);
      message.success("저장되었습니다.");

      await load();
      onSaved && onSaved();
    } catch (e) {
      message.error("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [rows, changes, validateBeforeSave, load, onSaved]);

  const handleCancel = useCallback(() => {
    load();
  }, [load]);

  const currentTableColumns = useMemo(
    () => [
      { title: "담당 반", dataIndex: "class_name", key: "class_name",  width: 120, },
      {
        title: "현재 담당 선생님",
        dataIndex: "current_head_name",
        key: "current_head_name",
        width: 180,
        render: (t) => t || "미등록",
      },
      {
        title: "현재 보조 선생님",
        dataIndex: "current_assistant_name",
        key: "current_assistant_name",
        width: 180,
        render: (t) => t || "없음",
      },
    ],
    []
  );

  const changeTableColumns = useMemo(() => {
    return [
      { title: "담당 반", dataIndex: "class_name", key: "class_name",  width: 120, },
      {
        title: "변경할 담당 선생님",
        key: "new_head",
        width: 140,
        render: (_, record) => {
          const cn = record.class_name;
          const value = changes?.[cn]?.head_id ?? null;

          return (
            <Select
              placeholder={record.current_head_name || "선생님 선택"}
              value={value}
              style={{ width: "100%" }}
              onChange={(headId) => updateChange(cn, { head_id: headId })}
            >
              {headCandidates.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.full_name}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: "변경할 보조 선생님",
        key: "new_assistant",
        width: 120,
        render: (_, record) => {
          const cn = record.class_name;
          const value = changes?.[cn]?.assistant_id ?? null;

          return (
            <Select
              allowClear
              placeholder={record.current_assistant_name || "선생님 선택"}
              value={value}
              style={{ width: "100%" }}
              onChange={(assistantId) => updateChange(cn, { assistant_id: assistantId ?? null })}
            >
              {assistantCandidates.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.full_name}
                </Option>
              ))}
            </Select>
          );
        },
      },
    ];
  }, [changes, headCandidates, assistantCandidates, updateChange]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 12 }}>현재 반 선생님 정보</div>
          <Table
            rowKey="class_name"
            columns={currentTableColumns}
            dataSource={rows}
            pagination={false}
            loading={loading}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 12 }}>변경할 선생님 정보</div>
          <Table
            rowKey="class_name"
            columns={changeTableColumns}
            dataSource={rows}
            pagination={false}
            loading={loading}
            tableLayout="fixed" 
          />
        </div>
      </div>

      <ClassManagementButtonGroup
        onCancel={handleCancel}
        onSave={handleSave}
        loading={loading}
        align="right"
      />
    </div>
  );
};

export default AdminClassAssignmentStep1;