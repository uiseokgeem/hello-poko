// src/components/Admin/ClassManagement/AdminStudentPlacementStep3.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Table, Button, Space, message, Select, Input } from "antd";
import {
  fetchStudentsForPlacementStep,
  fetchHeadTeacherCandidates,
  assignStudentsToHead,
} from "../../../api/adminApi";

const { Option } = Select;

const AdminStudentPlacementStep3 = ({ refreshKey, onSaved }) => {
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [headCandidates, setHeadCandidates] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [targetHeadId, setTargetHeadId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [studentData, headData] = await Promise.all([
        fetchStudentsForPlacementStep({ q: keyword, grade: gradeFilter }),
        fetchHeadTeacherCandidates(),
      ]);
      setStudents(studentData || []);
      setHeadCandidates(headData || []);
    } catch (e) {
      message.error("데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [keyword, gradeFilter]);

  // 새 구조 핵심: refreshKey 변경 시(다른 탭 저장 포함) Step3도 자동 최신화
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
      { title: "학년", dataIndex: "grade", key: "grade", render: (t) => t || "-" },
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
    if (selectedRowKeys.length === 0) {
      message.error("학생을 선택하세요.");
      return;
    }
    if (!targetHeadId) {
      message.error("배치할 담당 선생님(HEAD)을 선택하세요.");
      return;
    }

    setLoading(true);
    try {
      await assignStudentsToHead({
        head_id: targetHeadId,
        student_ids: selectedRowKeys,
      });

      message.success("배치가 완료되었습니다.");

      setSelectedRowKeys([]);
      setTargetHeadId(null);

      // 본인 탭 최신화
      await load();

      // 새 구조 핵심: 부모 refreshKey 증가 -> 1/2 탭도 자동 재조회
      onSaved && onSaved();
    } catch (e) {
      message.error("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [selectedRowKeys, targetHeadId, load, onSaved]);

  const handleCancel = useCallback(async () => {
    setSelectedRowKeys([]);
    setTargetHeadId(null);
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

            <Input
              placeholder="학년 필터(예: 고2)"
              allowClear
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              style={{ width: 160 }}
            />

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
          <div style={{ marginBottom: 12 }}>선택 학생 배치</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>선택된 학생 수: {selectedRowKeys.length}</div>

            <Select
              placeholder="배치할 담당 선생님(HEAD) 선택"
              value={targetHeadId || undefined}
              onChange={(v) => setTargetHeadId(v)}
            >
              {headCandidates.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.full_name} {t.class_name ? `(${t.class_name})` : ""}
                </Option>
              ))}
            </Select>

            <div>적용 결과: 선택된 학생들의 teacher = 선택한 HEAD</div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
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

export default AdminStudentPlacementStep3;