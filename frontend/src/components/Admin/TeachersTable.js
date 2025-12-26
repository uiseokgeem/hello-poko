import React, { useCallback, useState, useEffect } from "react";
import { Table, Button } from "antd";
import { useHandleEdit, useHandleDelete, useHandleUpdate, useHandleRegister } from "../../hooks/admin/handle";
import TeacherModal from "./TeacherModal";
import TeacherDeleteModal from "./TeacherDeleteModal";
import { fetchTeacherFilter } from "../../api/adminApi";
import "./TeachersTable.css";

const TeachersTable = ({ keyword = "" }) => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const loadTeacherList = useCallback(async () => {
        setLoading(true);
        try {
          const data = await fetchTeacherFilter(keyword);
          setTeachers(data);
        } finally {
          setLoading(false);
        }
      }, [keyword]);
      
      useEffect(() => {
        loadTeacherList();
      }, [loadTeacherList]);
    

    const { selectedTeacher, modalVisible, handleEdit, handleCloseModal } = useHandleEdit();
    const {
        deleteModalVisible,
        teacherToDelete,
        showDeleteModal, 
        closeDeleteModal, 
        confirmDelete
    } = useHandleDelete(loadTeacherList);
    const handleUpdate = useHandleUpdate(loadTeacherList, handleCloseModal);

    // 새롭게 추가된 등록 핸들링
    const { registerModalVisible, handleRegister, handleCloseRegisterModal, submitRegister } = useHandleRegister(loadTeacherList);


    const columns = [
        {
            title: "선생님 이름",
            dataIndex: "full_name",  // CustomUser.full_name
            key: "full_name",
        },

        {
            title: "유형",
            dataIndex: "role",   // CustomUser.role
            key: "role",
            render: (text) => {
                const roleMap = {
                    "HEAD": "담당 선생님",
                    "ASSISTANT": "보조 선생님",
                };
                return roleMap[text] || "미등록";
            }
        },
        {
            title: "담당 반",
            dataIndex: "class_name",    // CustomUser.class_name
            key: "class_name",
            render: (text) => text || "미등록",
        },
        {
            title: "참조 선생님",
            dataIndex: "head_teacher",  // CustomUser.head_teacher(FK)
            key: "head_teacher",
            render: (text) => text || "미등록",
        },
        {
            title: "이메일",
            dataIndex: "email", // CustomUser.email
            key: "email",
        },
        {
            title: "더보기",
            key: "actions",
            render: (_, record) => (
                <div>
                    { record.role === "HEAD" ? (
                    <Button type="link" onClick={() => handleEdit(record)}>수정</Button> ) : (
                        <Button type="link" onClick={() => handleRegister(record)}>등록</Button> 
                    )}
                    <Button type="link" danger onClick={() => showDeleteModal(record)}>삭제</Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        loadTeacherList();
      }, [loadTeacherList]);

    return (
        <div className="teachers-table-container">
            <Table
                className="teachers-table-table"
                rowKey="id"
                columns={columns}
                dataSource={teachers}
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
            />
             <TeacherModal 
                visible={modalVisible || registerModalVisible} 
                onClose={modalVisible ? handleCloseModal : handleCloseRegisterModal} 
                teacher={selectedTeacher}
                onUpdate={handleUpdate} 
                onRegister={submitRegister}
                onDelete={showDeleteModal}
                isRegisterMode={registerModalVisible}
            />
            <TeacherDeleteModal
                visible={deleteModalVisible}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                teacher={teacherToDelete}
            />
        </div>
    );
};

export default TeachersTable;