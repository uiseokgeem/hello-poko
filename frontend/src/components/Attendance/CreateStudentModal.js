import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, message, Radio } from "antd";
import { fetchAllTeachers,
 } from "../../api/attendanceApi";
import "./CreateStudentModal.css";
import { getNearestSunday } from "../../utils/dateUtils";
import { createStudent } from "../../api/attendanceApi";

const { Option } = Select;

const CreateStudentModal = ({ isOpen, onClose, onStudentAdded, mode, teachers }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allTeachers, setAllTeachers] = useState([]);

  // 모든 선생님 리스트 가져오기
  useEffect(() => {
    const fetchTeachersData = async () => {
      if (mode === "admin") {
        // Admin 모드: 모든 선생님 데이터 가져오기
        try {
          const data = await fetchAllTeachers();
          console.log("Admin mode: all teachers", data);
          setAllTeachers(data); // 모든 선생님 저장
        } catch (error) {
          console.error("Error fetching all teachers:", error);
          setAllTeachers([]);
        }
      } else if (mode === "attendance") {
        console.log("Attendance mode: teacher", teachers);
        setAllTeachers(teachers); // 전달된 teachers를 바로 사용
      }
    };
  
    fetchTeachersData();
  }, [mode, teachers]);

  // UI 표시를 위한
  const teacherName =
    mode === "attendance" && allTeachers.length > 0
      ? allTeachers[0]?.name || "Unknown"
      : "";

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const studentData = {
        ...values,
        attendance_count: 0,
        absent_count: 0,
        initial_attendance_date: getNearestSunday(),
        teacher: mode === "attendance" ? allTeachers[0]?.id : values.teacher,
      };

      setLoading(true);
      await createStudent(studentData);
      message.success("학생이 성공적으로 추가되었습니다!");
      form.resetFields();
      onClose();
      onStudentAdded && onStudentAdded();
    } catch (error) {
      message.error("학생 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="새 친구 등록"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={400}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="이름"
          name="name"
          rules={[{ required: true, message: "이름을 입력해주세요!" }]}
        >
          <Input placeholder="이름 입력" />
        </Form.Item>
        <Form.Item
          label="학년"
          name="grade"
          rules={[{ required: true, message: "학년을 선택해주세요!" }]}
        >
          <Select placeholder="학년 선택">
            {["중1", "중2", "중3", "고1", "고2", "고3"].map((grade) => (
              <Option key={grade} value={grade}>
                {grade}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="성별"
          name="gender"
          rules={[{ required: true, message: "성별을 선택해주세요!" }]}
        >
          <Radio.Group>
            <Radio value="남">남</Radio>
            <Radio value="여">여</Radio>
          </Radio.Group>
        </Form.Item>
        {mode === "attendance" ? (
          // Attendance 모드에서는 단순히 이름만 출력
          <div>
            <strong>담당 :</strong> {teacherName} 선생님
          </div>
        ) : (
          // admin 모드에서는 Select로 선택 가능
          <Form.Item
            label="담당 선생님"
            name="teacher"
            rules={[{ required: true, message: "담당 선생님을 선택해주세요!" }]}
          >
            <Select placeholder="선생님 선택">
              {allTeachers.map((teacher) => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <div className="modal-footer">
          <Button onClick={onClose} className="cancel-btn">
            취소
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            className="submit-btn"
          >
            등록
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateStudentModal;