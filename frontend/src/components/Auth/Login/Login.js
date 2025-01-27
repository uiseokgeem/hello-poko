import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Logo from '../../Logo/Logo';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ handleLoginSubmit }) => {
  const [message, setMessage] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Kakao 인증 URL
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`;
  
  const handleSubmit = async () => {
    try {
      await handleLoginSubmit(id, password);
      navigate('/attendance'); // 로그인 성공 후 대시보드로 이동
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSendEmail = () => {
    navigate('/send-email');
  };

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL; // Kakao 로그인 페이지로 이동
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
        <Form.Item className="login-form-item">
          {/* 카카오 로그인 버튼을 이미지로 대체 */}
          <img
            src={`${process.env.PUBLIC_URL}/images/kakao_login_large_wide.png`} // PNG 파일 경로
            alt="카카오 로그인"
            onClick={handleKakaoLogin} // 클릭 시 카카오 로그인 실행
            className="kakao-login-image"
            style={{ cursor: 'pointer', width: '100%' }} // 이미지 스타일
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;