import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import './VerifyEmail.css';
import { sendEmail } from '../../../api/registrationApi'; // 이메일 발송 API 임포트

const { Title } = Typography;

const VerifyEmail = ({ handleVerificationSubmit }) => {
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false); // 인증 성공 여부를 추적하는 상태 추가
  const { url_code, email_code } = useParams();
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const decodedEmail = atob(email_code); // Base64 디코딩

  const handleSubmit = () => {
    handleVerificationSubmit(url_code, email_code, verificationCode)
      .then(responseMessage => {
        setMessage(responseMessage);
        setIsVerified(true); // 인증 성공 시 상태 업데이트
      })
      .catch(errorMessage => {
        setMessage(errorMessage);
      });
  };

  const handleResendEmail = async () => {
    try {
      const response = await sendEmail(decodedEmail);
      setMessage(response.message);
      // 새로운 URL로 이동하여 컴포넌트를 재렌더링
      navigate(`/verify-email/${response.url_code}/${response.email_code}`);
    } catch (error) {
      setMessage('이메일 재전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  

  const handleNext = () => {
    navigate(`/validate-pwd/${url_code}/${email_code}`);
  }; // 다음 단계로 이동하는 함수, useParams를 사용하여 다음 단계 링크 구현

  return (
    <div className="verifyemail-container">
      <Title level={4}>이메일 인증</Title>
      <p style={{ fontSize: '10px' }}> {atob(email_code)} 인증코드를 전송했어요. 코드를 입력해주세요.</p>
      <Form layout="vertical" className="verifyemail-form">
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
            </Button>
          ) : (
            <>
              <Button type="primary" htmlType="button" block onClick={handleSubmit}>
                인증 코드 확인
              </Button>
              <Button type="default" htmlType="button" block onClick={handleResendEmail} style={{ marginTop: '10px' }}>
                이메일 재전송
              </Button>
            </>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}

export default VerifyEmail;