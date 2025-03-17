import React from "react";
import { Modal, Button, Select, Input } from "antd";
import "./TeacherModal.css"; // 스타일 관리

const { Option } = Select;

const TeacherModal = ({ visible, onClose, teacher, onUpdate, onDelete }) => {
  



  return (
    <Modal
      title="선생님 정보 수정"
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="teacher-modal"
    >
      {/* 담당 반 선택 */}
      <div className="modal-section">
        <label>담당 반</label>
        <Input placeholder="반 이름을 작성하세요." defaultValue={teacher?.class_name || ""} />
      </div>

      {/* 선생님 형태 선택 */}
      <div className="modal-section">
        <label>선생님 형태</label>
        <Select defaultValue={teacher?.role || "미등록"} style={{ width: "100%" }}>
          <Option value="HEAD">정교사</Option>
          <Option value="ASSISTANT">부교사</Option>
        </Select>
      </div>

      {/* 버튼 */}
      <div className="modal-footer">
        <Button onClick={onClose} className="cancel-btn">
          취소
        </Button>
        <Button type="primary" onClick={onUpdate} className="update-btn">
          업데이트
        </Button>
      </div>
    </Modal>
  );
};

export default TeacherModal;