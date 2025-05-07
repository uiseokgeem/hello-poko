import React from "react";
import { Modal, Table, Button } from "antd";
import { FileTextOutlined } from "@ant-design/icons"; // 아이콘 import
import { saveAsText } from "../../utils/saveUtils";
import "./AbsentListModal.css";

const AbsentListModal = ({ isVisible, onClose, date, absentStudents }) => {
  const columns = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "학년",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "성별",
      dataIndex: "gender",
      key: "gender",
    },
  ];

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      bodyStyle={{ padding: 0 }}
      width={400}
    >
      <div className="modal-container">
        <h2 className="modal-title">결석 인원 목록</h2>
        <div className="modal-date">
          <div>
            <strong>결석일</strong>
            <span className="modal-date-value">: {date}</span>
          </div>
          <div className="icon-group exclude-from-capture">
            <FileTextOutlined
                className="icon-button"
                onClick={() => saveAsText(absentStudents, date)}
                title="텍스트 저장"
            />
            {/* <CameraOutlined
                className="icon-button"
                onClick={() =>
                saveAsImage(".modal-container", [".modal-footer button", ".icon-group"])
                }
                title="이미지 저장"
            /> */}
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={absentStudents}
          pagination={false}
          className="absent-table"
          rowKey="id"
          scroll={{ y: 300 }} // 세로 스크롤을 300px로 설정
        />
        <div className="modal-footer">
          <Button
            type="primary"
            className="close-button"
            onClick={onClose}
            block
          >
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AbsentListModal;