import React from "react";
import { Modal, Button, Checkbox, Form } from "antd";
import './AttendanceModal.css'

const AttendanceModal = ({ isOpen, onClose, students, checkedStudents, handleCheck, handleSubmit }) => {

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}  // 커스텀 버튼을 사용하므로 footer는 null 처리
      destroyOnClose={true}  // 모달이 닫힐 때 상태 초기화
      width={400} // 좌우 폭 조정 (디자인에 맞게 설정)
      bodyStyle={{ padding: '20px' }} // 패딩 조정
      centered // 모달을 화면 중앙에 위치시킴
    >
      <div className="modal-header">
        <h2>출석부 등록</h2>
        <p className="modal-subtitle">등록일: <b>{new Date().toLocaleDateString()}</b></p>
      </div>

      <Form layout="vertical" className="modal-form">
        {students.map((student) => (
          <Form.Item key={student.id} className="form-item">
            <Checkbox
              checked={checkedStudents.includes(student.id)}
              onChange={() => handleCheck(student.id)}
            >
              {student.name}
            </Checkbox>
          </Form.Item>
        ))}

        <div className="modal-footer">
          <Button onClick={onClose} className="cancel-btn">
            취소
          </Button>
          <Button type="primary" onClick={handleSubmit} className="submit-btn">
            등록
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AttendanceModal;
