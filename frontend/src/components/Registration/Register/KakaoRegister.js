import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Typography, message as antdMessage } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const { Title } = Typography;

const KakaoRegister = ({ handleRegisterSubmit }) => {
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [formValid, setFormValid] = useState(false);
    const navigate = useNavigate();

    const onNameChange = (e) => {
        setFullName(e.target.value);
        validateForm(e.target.value, birthDate);
    };

    const onDateChange = (date, dateString) => {
        setBirthDate(dateString);
        validateForm(fullName, dateString);
    };

    const validateForm = (name, date) => {
        setFormValid(name.trim() !== '' && date !== null);
    };

    const handleSubmit = async () => {
        try {
            const responseMessage = await handleRegisterSubmit(fullName, birthDate); // 상위에서 전달된 함수 호출
            antdMessage.success(responseMessage);
            navigate('/attendance'); // 로그인 성공 후 대시보드로 이동
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message || '회원가입 중 오류가 발생했습니다.';
            antdMessage.error(errorMessage);
        }
    };

    return (
        <div className="register-container">
            <Title level={4}>회원가입</Title>
            <p style={{ fontSize: '10px' }}>이름과 생년월일을 입력해주세요.</p>
            <Form layout="vertical" className="register-form">
                <Form.Item
                    label="이름"
                    validateStatus={!fullName.trim() && 'error'}
                    help={!fullName.trim() && '이름을 입력해주세요.'}
                >
                    <Input placeholder="이름" value={fullName} onChange={onNameChange} />
                </Form.Item>
                <Form.Item
                    label="생년월일"
                    validateStatus={!birthDate && 'error'}
                    help={!birthDate && '생년월일을 선택해주세요.'}
                >
                    <DatePicker
                        onChange={onDateChange}
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        block
                        onClick={handleSubmit}
                        disabled={!formValid}
                    >
                        가입 완료
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default KakaoRegister;