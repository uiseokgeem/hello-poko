// src/components/Admin/ClassManagement/AdminStudentGradeStep2.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Table, Button, Space, message, Select, Input, Radio } from "antd";
import {
  fetchStudentsForGradeStep,
  saveStudentsGradeBulk,
} from "../../../api/adminApi";

const { Option } = Select;

const GRADE_OPTIONS = ["중1", "중2", "중3", "고1", "고2", "고3"];

const AdminStudentGradeStep2 = ({ refreshKey, onSaved }) => {
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [mode, setMode] = useState("selected"); // selected | promote
  const [targetGrade, setTargetGrade] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStudentsForGradeStep({
        q: keyword,
        grade: gradeFilter,
      });
      setStudents(data || []);
    } catch (e) {
      message.error("학생 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [keyword, gradeFilter]);

  // 새 구조 핵심: refreshKey 변경 시(다른 탭 저장 포함) Step2도 자동 최신화
  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (keys) => setSelectedRowKeys(keys),
    }),
    [selectedRowKeys]
  );

  const columns = useMemo(() => {
    return [
      { title: "학생명", dataIndex: "name", key: "name" },
      {
        title: "현재 학년",
        dataIndex: "grade",
        key: "grade",
        render: (t) => t || "-",
      },
      {
        title: "성별",
        dataIndex: "gender",
        key: "gender",
        render: (t) => t || "-",
      },
      {
        title: "현재 담당",
        dataIndex: "teacher_name",
        key: "teacher_name",
        render: (t) => t || "미배정",
      },
      {
        title: "현재 반",
        dataIndex: "class_name",
        key: "class_name",
        render: (t) => t || "-",
      },
    ];
  }, []);

  const handleSave = useCallback(async () => {
    if (mode === "selected") {
      if (selectedRowKeys.length === 0) {
        message.error("학생을 선택하세요.");
        return;
      }
      if (!targetGrade) {
        message.error("변경할 학년을 선택하세요.");
        return;
      }
    }

    setLoading(true);
    try {
      await saveStudentsGradeBulk({
        mode,
        student_ids: mode === "selected" ? selectedRowKeys : [],
        target_grade: mode === "selected" ? targetGrade : null,
      });

      message.success("저장되었습니다.");

      setSelectedRowKeys([]);
      setTargetGrade("");

      // 본인 탭 최신화
      await load();

      // 새 구조 핵심: 부모 refreshKey 증가 -> 1/3 탭도 자동 재조회
      onSaved && onSaved();
    } catch (e) {
      message.error("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [mode, selectedRowKeys, targetGrade, load, onSaved]);

  const handleCancel = useCallback(async () => {
    setSelectedRowKeys([]);
    setTargetGrade("");
    await load();
  }, [load]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
            <Input
              placeholder="학생 이름 검색"
              allowClear
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 260 }}
            />

            <Select
              placeholder="학년 필터"
              allowClear
              value={gradeFilter || undefined}
              onChange={(v) => setGradeFilter(v || "")}
              style={{ width: 160 }}
            >
              {GRADE_OPTIONS.map((g) => (
                <Option key={g} value={g}>
                  {g}
                </Option>
              ))}
            </Select>

            <Button onClick={load} disabled={loading}>
              조회
            </Button>
          </div>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={students}
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowSelection={rowSelection}
          />
        </div>

        <div style={{ width: 360 }}>
          <div style={{ marginBottom: 12 }}>학년 업데이트</div>

          <Radio.Group
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ marginBottom: 12 }}
          >
            <Radio value="selected">선택 학생 변경</Radio>
            <Radio value="promote">일괄 변경</Radio>
          </Radio.Group>

          {mode === "selected" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>선택된 학생 수: {selectedRowKeys.length}</div>
              <Select
                placeholder="변경할 학년 선택"
                value={targetGrade || undefined}
                onChange={(v) => setTargetGrade(v)}
              >
                {GRADE_OPTIONS.map((g) => (
                  <Option key={g} value={g}>
                    {g}
                  </Option>
                ))}
              </Select>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>전체 변경을 적용합니다.</div>
              <div>중1→중2, 중2→중3, 중3→고1, 고1→고2, 고2→고3</div>
            </div>
          )}

          <div
            style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
          >
            <Space>
              <Button onClick={handleCancel} disabled={loading}>
                취소
              </Button>
              <Button type="primary" onClick={handleSave} loading={loading}>
                저장하기
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentGradeStep2;