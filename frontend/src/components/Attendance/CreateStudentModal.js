import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Checkbox, message } from "antd";
import { fetchTeachers } from "../../api/attendanceApi";
import "./CreateStudentModal.css";

const { Option } = Select;

const CreateStudentModal = ({ isOpen, onClose, addStudent }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);

    // 담당 선생님 데이터를 불러옴
    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const data = await fetchTeachers();
                setTeachers(data);
            } catch (error) {
                console.error("Error fetching teachers:", error);
                setTeachers([]);
            }
        };

        fetchTeacherData();
    }, []);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            await addStudent(values);
            form.resetFields();
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
            width={400} // 폭 설정
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
                    <Checkbox.Group style={{ display: "flex", gap: "20px" }}>
                        <Checkbox value="남">남</Checkbox>
                        <Checkbox value="여">여</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item
                    label="담당 선생님"
                    name="teacher"
                    rules={[{ required: true, message: "담당 선생님을 선택해주세요!" }]}
                >
                    <Select placeholder="선생님 선택">
                        {teachers.length > 0
                            ? teachers.map((teacher) => (
                                  <Option key={teacher.id} value={teacher.id}>
                                      {teacher.name}
                                  </Option>
                              ))
                            : <Option disabled>선생님 없음</Option>}
                    </Select>
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
                        등록
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateStudentModal;