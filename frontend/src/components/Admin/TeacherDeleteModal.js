import React from "react";
import { Modal, Button, Typography } from "antd";
import "./TeacherDeleteModal.css";

const { Text } = Typography;

const TeacherDeleteModal = ({ visible, onClose, onConfirm, teacher }) => {
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            className="teacher-delete-modal"
        >
            <div className="delete-modal-content">
                <Text className="delete-title">선생님을 삭제할까요?</Text>
                <Text className="delete-description">
                    {teacher ? `${teacher.full_name} 선생님을 삭제하면 다시 가입해야 해요.` : "삭제할 선생님을 선택해주세요."}
                </Text>
                <div className="delete-modal-buttons">
                    <Button onClick={onClose} className="cancel-button">취소</Button>
                    <Button onClick={onConfirm} type="primary" danger className="delete-button">삭제</Button>
                </div>
            </div>
        </Modal>
    );
};

export default TeacherDeleteModal;