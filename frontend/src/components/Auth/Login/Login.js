import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Logo from '../../Logo/Logo';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = ({ handleLoginSubmit }) => {
    const [message, setMessage] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
    
    const handleSubmit = async () => {
        try {
            await handleLoginSubmit(id, password);
            navigate('/dashboard'); // 로그인 성공 후 대시보드로 이동
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleSendEmail = () => {
        navigate("/");
    }; 

    return (
        <div className="login-container">
            <div className="login-logo">
                <Logo />
            </div>
            <Form layout='vertical' className="login-form">
                <Form.Item>
                    <Input
            placeholder="아이디(이메일)"
            value={id}
            onChange={(e) => setId(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                <Input.Password
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>
            <p style={{ fontSize: '10px' }}>{message}</p>
            <Form.Item>
                <Button type="primary" htmlType="button" block onClick={handleSubmit}> 
                이메일로 로그인
                </Button>
            </Form.Item>
            <Form.Item>
                <Button type="default" block onClick={handleSendEmail}>
                회원가입
                </Button>
            </Form.Item>
            </Form>
        </div>
    )
}

export default Login;