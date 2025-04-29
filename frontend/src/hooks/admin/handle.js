import { useState } from "react";
import { deleteTeacher, updateTeacherPartial, registerTeacher } from "../../api/adminApi";

// 수정 버튼 클릭 시 모달 열기 및 닫기
export const useHandleEdit = () => {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleEdit = (teacher) => {
        setSelectedTeacher(teacher);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedTeacher(null);
    };

    return { selectedTeacher, modalVisible, handleEdit, handleCloseModal };
};

// 수정(업데이트) 버튼 클릭 시 API 연동
export const useHandleUpdate = (loadTeacherList, handleCloseModal) => {
    const handleUpdate = async (updatedTeacher) => {
        try {
            console.log("업데이트 버튼 클릭 - ID:", updatedTeacher.id);
            const response = await updateTeacherPartial(updatedTeacher.id, updatedTeacher);

            console.log("업데이트 성공!", response);
            loadTeacherList(); 
            handleCloseModal();
        } catch (error) {
            console.error("업데이트 오류:", error);
        }
    };

    return handleUpdate;
};

// ✅ 등록 모달 핸들링 추가
export const useHandleRegister = (loadTeacherList) => {
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [registeringTeacher, setRegisteringTeacher] = useState(null);

    const handleRegister = (teacher) => {
        setRegisteringTeacher(teacher);
        setRegisterModalVisible(true);
    };

    const handleCloseRegisterModal = () => {
        setRegisterModalVisible(false);
        setRegisteringTeacher(null);
    };

    const submitRegister = async (formData) => {
        try {
            await registerTeacher(registeringTeacher.id, {
                ...formData,
                reference_teacher: registeringTeacher.id, // 핵심
            });
            await loadTeacherList(); // 테이블 갱신
            handleCloseRegisterModal(); // 모달 닫기
        } catch (error) {
            console.error("등록 실패:", error);
        }
    };

    return {
        registerModalVisible,
        registeringTeacher,
        handleRegister,
        handleCloseRegisterModal,
        submitRegister,
    };
};

// 삭제 핸들링 커스텀 훅
export const useHandleDelete = (loadTeacherList) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);

    const showDeleteModal = (teacher) => {
        setTeacherToDelete(teacher);
        setDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
        setTeacherToDelete(null);
    };

    const confirmDelete = async () => {
        if (teacherToDelete) {
            try {
                console.log(`삭제 요청: ${teacherToDelete.full_name}`);
                
                await deleteTeacher(teacherToDelete.id); 
    
                console.log("삭제 성공!");
                loadTeacherList(); // 삭제 후 리스트 갱신
            } catch (error) {
                console.error("삭제 오류:", error);
            }
            closeDeleteModal();
        }
    };

    return { deleteModalVisible, teacherToDelete, showDeleteModal, closeDeleteModal, confirmDelete };
};
