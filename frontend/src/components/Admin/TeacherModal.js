import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { fetchHeadTeachers }from "../../api/adminApi"
import "./TeacherModal.css";

const { Option } = Select;

const TeacherModal = ({
    visible,
    onClose,
    teacher,
    onUpdate,
    onRegister,
    onDelete,
    isRegisterMode,
}) => {
    const [form] = Form.useForm();
    const role = Form.useWatch("role", form); // role 값 실시간 감지
    const [headOptions, setHeadOptions] = useState([]);

    useEffect(() => {
        if (visible && role === "ASSISTANT") {
            fetchHeadTeachers().then(data => setHeadOptions(data));
        }
    }, [visible, role]);

    // ✅ 모달 열릴 때 필드 초기화
    useEffect(() => {
        if (teacher) {
            form.setFieldsValue({
                role: teacher.role || "ASSISTANT",
                class_name: teacher.class_name || "",
                head_teacher: "",
            });
        } else {
            form.setFieldsValue({
                role: "ASSISTANT",
                class_name: "",
                head_teacher: "",
            });
        }
    }, [teacher, form, visible]);

    //  제출
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
    
            if (values.role === "ASSISTANT") {
                const reference = headOptions.find(t => t.id === values.head_teacher);
                values.class_name = reference ? reference.class_name : null;
            }
    
            isRegisterMode ? onRegister(values) : onUpdate({ ...teacher, ...values });
    
            onClose();
        } catch (error) {
            console.error("폼 제출 오류:", error);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            className="teacher-modal"
        >
            <h2 className="modal-title">
                {isRegisterMode ? "선생님 정보 등록" : "선생님 정보 수정"}
            </h2>

            <Form form={form} layout="vertical">
                {/* 선생님 형태 */}
                <Form.Item
                    name="role"
                    label="선생님 형태"
                    rules={[{ required: true, message: "선생님 형태를 선택하세요." }]}
                >
                    <Select>
                        <Option value="HEAD">담당 선생님</Option>
                        <Option value="ASSISTANT">보조 선생님</Option>
                    </Select>
                </Form.Item>

                {/* 담당 반 */}
                <Form.Item
                    name="class_name"
                    label="담당 반"
                    rules={[
                        {
                            required: role !== "ASSISTANT",
                            message: "반 이름을 입력해주세요.",
                        },
                    ]}
                >
                    <Input placeholder="반 이름을 작성하세요." disabled={role === "ASSISTANT"} />
                </Form.Item>

                {/* 참조 선생님 */}
                {role === "ASSISTANT" && (
                    <Form.Item
                        name="head_teacher"
                        label="참조 선생님"
                        rules={[{ required: false, message: "참조 선생님을 선택하세요." }]}
                    >
                        <Select placeholder="선생님 이름 선택">
                            {headOptions.map((teacher) => (
                                <Option key={teacher.id} value={teacher.id}>
                                    {teacher.full_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                {/* 하단 버튼 */}
                <div className="modal-footer">
                    <Button onClick={onClose} className="cancel-button">
                        취소
                    </Button>
                    <Button type="primary" onClick={handleSubmit} className="submit-button">
                        {isRegisterMode ? "등록하기" : "수정하기"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default TeacherModal;