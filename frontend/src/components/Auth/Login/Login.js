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
      navigate('/home'); // 로그인 성공 후 대시보드로 이동
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSendEmail = () => {
    navigate('/send-email');
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <Logo />
      </div>
      <Form layout="vertical" className="login-form">
        <Form.Item className="login-form-item">
          <Input
            className="login-input"
            placeholder="아이디(이메일)"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </Form.Item>
        <Form.Item className="login-form-item">
          <Input.Password
            className="login-password-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <p className="login-message">{message}</p>
        <Form.Item className="login-form-item">
          <Button
            type="primary"
            block
            className="login-submit-button"
            onClick={handleSubmit}
          >
            이메일로 로그인
          </Button>
        </Form.Item>
        <Form.Item className="login-form-item">
          <Button
            type="default"
            block
            className="login-signup-button"
            onClick={handleSendEmail}
          >
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;