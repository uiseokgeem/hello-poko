import React from "react";
import { Modal, Button } from "antd";

const DeleteStudentModal = ({ isOpen, onClose, onConfirm, student }) => {
  return (
    <Modal
      title="학생 삭제"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        아래 학생을 삭제할까요?
      </div>

      <div style={{ marginBottom: 24 }}>
        학생명: {student?.name || "-"}
        <br />
        담당반: {student?.grade || "-"}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={onClose} style={{ width: 140 }}>
          취소
        </Button>
        <Button danger type="primary" onClick={onConfirm} style={{ width: 220 }}>
          삭제
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteStudentModal;