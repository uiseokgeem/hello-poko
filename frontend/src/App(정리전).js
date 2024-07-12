import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';



const { Title } = Typography;

const Logo = () => (
  <img 
    src="/images/poko_logo.png" 
    alt="Logo" 
    style={{ display: 'block', margin: '30px auto 0', width: '108px', height: '40px' }} 
  />
);

function VerifyEmail({ handleVerificationSubmit }) {
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false); // 인증 성공 여부를 추적하는 상태 추가
  const { urlCode, emailCode } = useParams();
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  const handleSubmit = () => {
    handleVerificationSubmit(urlCode, emailCode, verificationCode)
      .then(responseMessage => {
        setMessage(responseMessage);
        setIsVerified(true); // 인증 성공 시 상태 업데이트
      })
      .catch(errorMessage => {
        setMessage(errorMessage);
      });
  };

  const handleNext = () => {
    navigate(`/validate-pwd/${urlCode}/${emailCode}`);
  }; // 다음 단계로 이동하는 함수, useParams를 사용하여 다음 단계 링크 구현

  return (
    <div className="sendemail-container">
      <Title level={4}>이메일 인증</Title>
      <p style={{ fontSize: '10px' }}>인증 코드를 입력하여 이메일을 인증하세요.</p>
      <Form layout="vertical" className="sendemail-form">
        <Form.Item label="인증 코드">
          <Input
            placeholder="인증 코드"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </Form.Item>
        <p style={{ fontSize: '10px' }}>{message}</p>
        <Form.Item>
          {isVerified ? (
            <Button type="primary" htmlType="button" block onClick={handleNext}>
              다음 단계로 이동 
            </Button>// 인증시 다음 단계 이동 버튼추가
          ) : (
            <Button type="primary" htmlType="button" block onClick={handleSubmit}>
              인증 코드 제출
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}


function SendEmail({ email, setEmail, handleEmailSubmit, message}) {
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
          <Button type="primary" htmlType="button" block onClick={handleEmailSubmit}>
            이메일 인증
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = () => {
    axios.post('http://localhost:8000/api/send-email', { email })
      .then(response => {
        if (response.status === 200) {
          setMessage(`이메일 전송 성공: ${response.data.message}`);
        }
      })
      .catch(error => {
        if (error.response) {
          // 요청이 이루어졌고, 서버는 2xx 외의 상태 코드로 응답했습니다.
          if (error.response.status === 409) {
            setMessage(`이메일 전송 실패: ${error.response.data.message}`);
          } else {
            setMessage(`요청 실패: ${error.response.data.message}`);
          }
        } else if (error.request) {
          // 요청이 이루어졌으나 응답을 받지 못했습니다.
          setMessage('서버로부터 응답이 없습니다.');
        } else {
          // 요청을 설정하는 중에 오류가 발생했습니다.
          setMessage(`요청 설정 오류: ${error.message}`);
        }
      });
  };

  const handleVerificationSubmit = (urlCode, emailCode, verificationCode) => {
    return new Promise((resolve, reject) => {
      axios.post(`http://localhost:8000/api/confirm-email/${urlCode}/${emailCode}`, { user_input_code: verificationCode })
        .then(response => {
          if (response.status === 200) {
            resolve('이메일 인증이 성공적으로 완료되었습니다.');
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            reject(`코드 검증 실패 : ${error.response.data.message}`);
          } else {
            reject('코드 검증에 실패했습니다.');
          }
        });
    });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Logo />
              <SendEmail
                email={email}
                setEmail={setEmail}
                handleEmailSubmit={handleEmailSubmit}
                message={message}
              />
            </div>
          }
        />
        <Route 
          path="/verify-email/:urlCode/:emailCode" 
          element={
            <div>
              <Logo />
              <VerifyEmail handleVerificationSubmit={handleVerificationSubmit} />
            </div>
          }
        />
        <Route
          path="/validate-pwd/:urlCode/:emailCode"
          element={<div>다음 단계 UI 입니다.</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
