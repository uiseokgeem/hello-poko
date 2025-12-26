import React, { useState } from "react";
import { Table } from "antd";
import EditStudentModal from "./EditStudentModal";
import DeleteStudentModal from "./DeleteStudentModal";
import { deleteStudent } from "../../api/adminApi";

const StudentMembersTable = ({ students, setStudents, refreshStudents }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const openEditModal = (record) => {
    setSelectedStudent(record);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const handleStudentUpdate = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    closeEditModal();
  };

  const openDeleteModal = (record) => {
    setStudentToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    await deleteStudent(studentToDelete.id);
    setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
    closeDeleteModal();
  };

  const columns = [
    { title: "학생명", dataIndex: "name", key: "name" },
    { title: "생년월일", dataIndex: "birth_date", key: "birth_date" },
    { title: "담당반", dataIndex: "grade", key: "grade" },
    { title: "담당 선생님", dataIndex: "teacher", key: "teacher", render: (t) => t || "미등록" },
    {
      title: "보기",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <span style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => openEditModal(record)}>
            수정
          </span>
          <span style={{ color: "red", cursor: "pointer" }} onClick={() => openDeleteModal(record)}>
            삭제
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table rowKey="id" columns={columns}  dataSource={[...students].sort((a, b) => a.name.localeCompare(b.name, "ko"))} pagination={false} />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onStudentUpdate={handleStudentUpdate}
        mode="admin"
        student={selectedStudent}
      />

      <DeleteStudentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
      />
    </>
  );
};

export default StudentMembersTable;