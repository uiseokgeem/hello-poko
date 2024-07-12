import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import './ValidatePwd.css';

const { Title } = Typography;

const ValidatePwd = ({ handleValidatePwdSumit }) => {
  // 상태값, 인증 성공 및 오류에 따라 재렌더링 하기위해
  const [message, setMessage] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const { url_code, email_code } = useParams();
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  const handleSubmit = () => (
    handleValidatePwdSumit(url_code, email_code, password1, password2)
    .then(responseMessage => {
      setMessage(responseMessage);
      setIsValidated(true);
    })
    .catch(errorMessage => {
      setMessage(errorMessage.message);
    })
  )

  const handleNext = () => {
    navigate(`/register/${url_code}/${email_code}`);
  };

    return (
      <div className="validatepwd-container">
      <Title level={4}>회원가입</Title>
      <p style={{ fontSize: '10px' }}>로그인 시 사용할 비밀번호를 입력해주세요.</p>
      <Form layout='vertical' className="validatepwd-form">
        <Form.Item 
        rules={[{ required: true, message: '비밀번호를 입력하세요!' }]}
        >
         <Input.Password
          placeholder='신규 비밀번호 확인'
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          />
        </Form.Item>

        <Form.Item
         rules={[{ required: true, message: '비밀번호를 확인하세요!' }]}
         >
         <Input.Password 
         placeholder='신규 비밀번호 확인'
         value={password2}
         onChange={(e) => setPassword2(e.target.value)}
         />
        </Form.Item>
        <p style={{ fontSize: '10px' }}>{message}</p>
        <Form.Item>
          {isValidated ? (
            <Button type="primary" htmlType="button" block onClick={handleNext}> 
              다음 단계로 이동
            </Button>
          ) : (
            <Button type="primary" htmlType="button" block onClick={handleSubmit}> 
              비밀번호 입력
            </Button>
          )}
        </Form.Item>
      </Form>
      </div>
    );
    
}



export default ValidatePwd;