import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, message, Radio } from "antd";
import { fetchAllTeachers, createStudent } from "../../api/attendanceApi";
import "./CreateStudentModal.css";
import { getNearestSunday } from "../../utils/dateUtils";

const { Option } = Select;

const pad2 = (n) => String(n).padStart(2, "0");

const CreateStudentModal = ({ isOpen, onClose, onStudentAdded, mode, teachers }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allTeachers, setAllTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachersData = async () => {
      if (mode === "admin") {
        try {
          const data = await fetchAllTeachers();
          setAllTeachers(data);
        } catch (error) {
          console.error("Error fetching all teachers:", error);
          setAllTeachers([]);
        }
      } else if (mode === "attendance") {
        setAllTeachers(teachers || []);
      }
    };

    fetchTeachersData();
  }, [mode, teachers]);

  const teacherName =
    mode === "attendance" && allTeachers.length > 0
      ? allTeachers[0]?.name || allTeachers[0]?.full_name || "Unknown"
      : "";

  // 생년월일 옵션
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => String(currentYear - i)); // 필요하면 60으로 늘리기
  const monthOptions = Array.from({ length: 12 }, (_, i) => pad2(i + 1));
  const dayOptions = Array.from({ length: 31 }, (_, i) => pad2(i + 1));

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const birth_date =
        values.birth_year && values.birth_month && values.birth_day
          ? `${values.birth_year}-${values.birth_month}-${values.birth_day}`
          : null;

      const studentData = {
        name: values.name,
        grade: values.grade,
        gender: values.gender,
        birth_date,
        attendance_count: 0,
        absent_count: 0,
        initial_attendance_date: getNearestSunday(),
        teacher: mode === "attendance" ? allTeachers[0]?.id : values.teacher,
      };

      setLoading(true);

      const createdStudent = await createStudent(studentData);

      message.success("학생이 성공적으로 추가되었습니다!");
      form.resetFields();

      onStudentAdded && onStudentAdded(createdStudent);
      onClose();
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

        <div className="birth-select-row">
          <Form.Item label="생년월일(선택)" name="birth_year">
            <Select placeholder="YYYY" allowClear>
              {yearOptions.map((y) => (
                <Option key={y} value={y}>
                  {y}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label=" " name="birth_month">
            <Select placeholder="MM" allowClear>
              {monthOptions.map((m) => (
                <Option key={m} value={m}>
                  {m}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label=" " name="birth_day">
            <Select placeholder="DD" allowClear>
              {dayOptions.map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

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
          <div>
            담당 : {teacherName} 선생님
          </div>
        ) : (
          <Form.Item
            label="담당 선생님"
            name="teacher"
            rules={[{ required: true, message: "담당 선생님을 선택해주세요!" }]}
          >
            <Select placeholder="선생님 선택">
              {allTeachers.map((teacher) => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.full_name || teacher.name}
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