import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, message } from "antd";
import { fetchAllTeachers } from "../../api/attendanceApi";
import { updateStudentPartial } from "../../api/adminApi"
import "./EditStudentModal.css";

const { Option } = Select;
const pad2 = (n) => String(n).padStart(2, "0");

const EditStudentModal = ({ isOpen, onClose, onStudentUpdate, mode, teachers, student }) => {
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

  useEffect(() => {
    if (!student) return;

    const birth = student.birth_date || "";
    const [year, month, day] = birth ? birth.split("-") : ["", "", ""];

    form.setFieldsValue({
      name: student.name || "",
      birth_year: year || "",
      birth_month: month || "",
      birth_day: day || "",
      teacher: student.teacher_id || student.teacher || "",
      class_name: student.class_name || "",
    });
  }, [student, form]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 60 }, (_, i) => String(currentYear - i));
  const monthOptions = Array.from({ length: 12 }, (_, i) => pad2(i + 1));
  const dayOptions = Array.from({ length: 31 }, (_, i) => pad2(i + 1));

  const handleTeacherChange = (teacherId) => {
    const selectedTeacher = allTeachers.find((t) => t.id === teacherId);

    const className =
      selectedTeacher?.class_name ||
      selectedTeacher?.className ||
      "미등록";

    form.setFieldsValue({ class_name: className });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
  
      const payload = {
        name: values.name,
        birth_date:
          values.birth_year && values.birth_month && values.birth_day
            ? `${values.birth_year}-${values.birth_month}-${values.birth_day}`
            : null,
        teacher: values.teacher,
      };
  
      setLoading(true);
  
      const updatedStudent = await updateStudentPartial(student.id, payload);
  
      message.success("학생 정보가 수정되었습니다.");
  
      onStudentUpdate(updatedStudent);
  
      onClose();
    } catch (error) {
      message.error("학생 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="학생 수정"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={520}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="이름"
          name="name"
          rules={[{ required: true, message: "이름을 입력해주세요." }]}
        >
          <Input placeholder="이름 입력" />
        </Form.Item>

        <div className="birth-select-row">
          <Form.Item
            label="생년월일"
            name="birth_year"
            rules={[{ required: true, message: "년도를 선택해주세요." }]}
          >
            <Select placeholder="YYYY">
              {yearOptions.map((y) => (
                <Option key={y} value={y}>
                  {y}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label=" "
            name="birth_month"
            rules={[{ required: true, message: "월을 선택해주세요." }]}
          >
            <Select placeholder="MM">
              {monthOptions.map((m) => (
                <Option key={m} value={m}>
                  {m}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label=" "
            name="birth_day"
            rules={[{ required: true, message: "일을 선택해주세요." }]}
          >
            <Select placeholder="DD">
              {dayOptions.map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {mode === "attendance" ? (
          <div className="teacher-readonly">
            담당선생님은 출석부 화면에서 고정입니다.
          </div>
        ) : (
          <Form.Item
            label="담당 선생님 선택"
            name="teacher"
            rules={[{ required: true, message: "담당 선생님을 선택해주세요!" }]}
          >
            <Select placeholder="선생님 선택" onChange={handleTeacherChange}>
              {allTeachers.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.full_name || t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item label="선택된 반 이름" name="class_name">
          <Input placeholder="반 이름" disabled />
        </Form.Item>

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
            수정
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditStudentModal;