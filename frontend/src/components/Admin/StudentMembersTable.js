// src/components/Admin/StudentMembersTable.js
import React, { useCallback, useState, useEffect } from "react";
import { Table } from "antd";
import EditStudentModal from "./EditStudentModal";
import DeleteStudentModal from "./DeleteStudentModal";
import { fetchStudentFilter, deleteStudent } from "../../api/adminApi";

const StudentMembersTable = ({ keyword = "", refreshKey = 0 }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const refreshStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStudentFilter(keyword);
      setStudents(data);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    refreshStudents();
  }, [refreshStudents, refreshKey]);

  const openEditModal = (record) => {
    setSelectedStudent(record);
    setIsEditModalOpen(true);
  };

  const handleStudentUpdate = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const openDeleteModal = (record) => {
    setStudentToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteStudent(studentToDelete.id);
    setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  // 비율(100 기준): 학생 20 / 학년 20 / 담당 20 / 생년월일 10 / 보기 30
  // 실제 픽셀 폭은 "테이블이 차지하는 전체 폭"에 따라 달라지므로,
  // 비율을 유지하려면 각 컬럼에 percentage width + tableLayout="fixed" 조합이 가장 안정적입니다.
  const columns = [
    {
      title: "학생명",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "학년",
      dataIndex: "grade",
      key: "grade",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "담당 선생님",
      dataIndex: "teacher",
      key: "teacher",
      width: "20%",
      ellipsis: true,
      render: (t) => t || "미등록",
    },
    {
      title: "생년월일",
      dataIndex: "birth_date",
      key: "birth_date",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "보기",
      key: "actions",
      width: "30%",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <span
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => openEditModal(record)}
          >
            수정
          </span>
          <span
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => openDeleteModal(record)}
          >
            삭제
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={[...students].sort((a, b) => a.name.localeCompare(b.name, "ko"))}
        loading={loading}
        pagination={false}
        tableLayout="fixed"
      />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onStudentUpdate={handleStudentUpdate}
        mode="admin"
        student={selectedStudent}
      />

      <DeleteStudentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
      />
    </>
  );
};

export default StudentMembersTable;