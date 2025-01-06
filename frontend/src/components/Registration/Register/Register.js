import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import './Register.css';

const { Title } = Typography;

const Register = ({handleRegisterSubmit}) => {
    const [message, setMessage] = useState(''); // fullname과 birth message 구분
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] =useState(null);
    const { url_code, email_code } = useParams();
    const navigate = useNavigate();

    const onChange = (date, dateString) => {
        setBirthDate(dateString);
      };

    const handleSubmit = () => {
        handleRegisterSubmit(url_code, email_code, fullName, birthDate)
         .then(responseMessage => {
            setMessage(responseMessage);
            navigate('/login');
         })
         .catch(errorMessage => {
            setMessage(errorMessage);
         });
    };

    return (
        <div className="register-container">
            <Title level={4}>회원가입</Title>
        <p style={{ fontSize: '10px' }}>마지막으로 이름과 생년월일을 입력하고 회원가입을 완료하세요.</p>
        <Form layout="vertical" className='register-form'>
            <Form.Item label="이름">
                <Input
                    placeholder='이름'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </Form.Item>
            <p style={{ fontSize: '10px' }}>{message}</p>
            <Form.Item label="생년월일">
                <DatePicker onChange={onChange} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="button" block onClick={handleSubmit}>
                    가입 완료
                </Button>
            </Form.Item>



        </Form>
        </div>
    );
}

export default Register;