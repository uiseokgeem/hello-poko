import React from "react";
import { Modal, Button, Checkbox, Form, Select } from "antd";
import "./AttendanceModal.css";
import { getLastTwoWeeks } from "../../utils/dateUtils";

const { Option } = Select;

const AttendanceModal = ({
  isOpen,
  onClose,
  students,
  checkedStudents,
  handleCheck,
  handleSubmit,
  selectedDate,
  setSelectedDate,
  nearestSunday,
  mode,
}) => {
  // 최근 2주 날짜 리스트 생성
  const lastTwoWeeks = getLastTwoWeeks(nearestSunday); // 함수 호출 후 결과 저장

  // 날짜 선택 핸들러
  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={400}
      bodyStyle={{ padding: "20px" }}
      centered
    >
      <div className="modal-header">
        <h2>{mode === "edit" ? "출석 수정" : "출석부 등록"}</h2>
        <p className="modal-subtitle">
          {mode === "edit" ? `수정 날짜: ${selectedDate}` : `등록일: ${selectedDate || nearestSunday}`}
        </p>
      </div>

      <Form layout="vertical" className="modal-form">
        {/* 날짜 선택 */}
        <Form.Item label="등록 날짜 선택">
          <Select
            value={selectedDate || nearestSunday}
            onChange={handleDateChange}
            style={{ width: "100%" }}
          >
            {lastTwoWeeks.map((date) => (
              <Option key={date} value={date}>
                {date}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 학생 체크박스 */}
        {students.map((student) => (
          <Form.Item
            key={student.id}
            className={`form-item ${checkedStudents.includes(student.id) ? "checked" : ""}`}
          >
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
            {mode === "edit" ? "수정 저장" : "등록"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AttendanceModal;

// 등록날짜 고정 코드
// import React from "react";
// import { Modal, Button, Checkbox, Form } from "antd";
// import './AttendanceModal.css'

// const AttendanceModal = ({
//    isOpen,
//    onClose,
//    students,
//    checkedStudents,
//    handleCheck,
//    handleSubmit,
//    nearestSunday,
//    selectedDate,
//    mode,
//   }) => {
  

//   return (
//     <Modal
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}  // 커스텀 버튼을 사용하므로 footer는 null 처리
//       destroyOnClose={true}  // 모달이 닫힐 때 상태 초기화
//       width={400} // 좌우 폭 조정 (디자인에 맞게 설정)
//       bodyStyle={{ padding: '20px' }} // 패딩 조정
//       centered // 모달을 화면 중앙에 위치시킴
//     >
//       <div className="modal-header">
//         {/* <h2>출석부 등록</h2> */}
//         <h2>{mode === "edit" ? "출석 수정" : "출석부 등록"}</h2>
//         {/* <p className="modal-subtitle">등록일: <b>{getFormattedDate}</b></p> */}
//         <p className="modal-subtitle">
//           {mode === "edit" ? `수정 날짜: ${selectedDate}` : `등록일: ${nearestSunday}`}
//         </p>
//       </div>

//       <Form layout="vertical" className="modal-form">
//         {students.map((student) => (
//           <Form.Item key={student.id} 
//           className={`form-item ${checkedStudents.includes(student.id) ? 'checked' : ''}`}  // 체크된 항목에 대해 클래스 추가
//           >
//             <Checkbox
//               checked={checkedStudents.includes(student.id)}
//               onChange={() => handleCheck(student.id)}
//             >
//               {student.name}
//             </Checkbox>
//           </Form.Item>
//         ))}

//         <div className="modal-footer">
//           <Button onClick={onClose} className="cancel-btn">
//             취소
//           </Button>
//           <Button type="primary" onClick={handleSubmit} className="submit-btn">
//             {mode === "edit" ? "수정 저장" : "등록"}
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default AttendanceModal;
