import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import './SendEmail.css';

const { Title } = Typography;

const SendEmail = ({ handleEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendCount, setSendCount] = useState(0); // 이메일 전송 횟수를 추적하는 상태 추가
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅 추가

  useEffect(() => {
    const storedCount = localStorage.getItem('sendCount'); // 로컬 스토리지에 전송 횟수 읽어오기
    if (storedCount) {
      setSendCount(parseInt(storedCount, 10));
    }
  }, []);

  const handleSubmit = () => {
    if (sendCount < 100) {
      handleEmailSubmit(email)
      .then(({ message, url_code, email_code }) => {
        setMessage(message);
        const newCount = sendCount + 1;
        setSendCount(newCount);
        localStorage.setItem('sendCount', newCount);
        // 이메일 발송이 완료되면 VerifyEmail 컴포넌트로 이동
        navigate(`/verify-email/${url_code}/${email_code}`);
        })
        .catch(errorMessage => {
          setMessage(errorMessage.message);
        });
    } else {
      setMessage('이메일 전송 횟수가 최대치를 초과했습니다. 관리자에게 문의해주세요.'); // 최대 전송 횟수를 초과한 경우 메시지 설정
    }
  };

  return (
    <div className="sendemail-container">
      <Title level={4}>회원가입</Title>
      <p style={{ fontSize: '10px' }}>이메일 주소를 입력하여 이메일을 인증하세요.</p>
      <Form layout="vertical" className="sendemail-form">
        <Form.Item label="이메일">
          <Input
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <p style={{ fontSize: '10px' }}>{message}</p>
        <Form.Item>
        <Button
            type="primary"
            htmlType="button"
            block
            onClick={handleSubmit}
          >
            이메일 인증
          </Button>
        </Form.Item>
      </Form>
    </div>
    );
  }

export default SendEmail;