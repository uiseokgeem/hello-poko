// src/components/Admin/ClassManagement/AdminStudentGradeStep2.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Table, Button, message, Select, Input } from "antd";
import {
  fetchStudentsForGradeStep,
  saveStudentsGradeBulk,
} from "../../../api/adminApi";
import { ClassManagementButtonGroup } from "./ClassManagementButtons";

const { Option } = Select;

const AdminStudentGradeStep2 = ({ refreshKey, onSaved, gradeOptions = [] }) => {
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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

  const columns = useMemo(
    () => [
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
    ],
    []
  );

  const handleSave = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      message.error("학생을 선택하세요.");
      return;
    }
    if (!targetGrade) {
      message.error("변경할 학년을 선택하세요.");
      return;
    }

    setLoading(true);
    try {
      await saveStudentsGradeBulk({
        student_ids: selectedRowKeys,
        target_grade: targetGrade,
      });

      message.success("저장되었습니다.");

      setSelectedRowKeys([]);
      setTargetGrade("");

      await load();
      onSaved && onSaved();
    } catch (e) {
      message.error("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [selectedRowKeys, targetGrade, load, onSaved]);

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
              {gradeOptions.map((g) => (
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
          <div style={{ marginBottom: 12 }}>학년 수정</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>선택된 학생 수: {selectedRowKeys.length}</div>

            <Select
              placeholder="수정할 학년 선택"
              value={targetGrade || undefined}
              onChange={(v) => setTargetGrade(v)}
            >
              {gradeOptions.map((g) => (
                <Option key={g} value={g}>
                  {g}
                </Option>
              ))}
            </Select>
          </div>

          <ClassManagementButtonGroup
            onCancel={handleCancel}
            onSave={handleSave}
            loading={loading}
            align="right"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminStudentGradeStep2;