import axios from 'axios';
import { Cookies } from 'react-cookie';

// CSRF 토큰을 쿠키에서 가져오는 함수
const getCSRFToken = () => {
  const cookies = new Cookies();
  return cookies.get('csrftoken');
};

// CSRF 토큰 가져오기
const csrftoken = getCSRFToken();

export const sendEmail = async (email) => {
  try {
    const response = await axios.post(
      'http://localhost/api/send-email',
      { email },
      {
         withCredentials: true,
         headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'application/json'
          }
      },
      
    );
    return {
      message: response.data.message,
      url_code: response.data.url_code,
      email_code: response.data.email_code,
    };
  } catch (error) {
    handleError(error);
  }
};

export const verifyEmail = async (urlCode, emailCode, verificationCode) => {
  try {
    const response = await axios.post(
      `http://localhost/api/confirm-email/${urlCode}/${emailCode}`,
      { user_input_code: verificationCode },
      {
         withCredentials: true,
         headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'application/json'
          }
        }
    );
    return response.data.message;
  } catch (error) {
    handleError(error);
  }
};

export const validatePwd = async (urlCode, emailCode, password1, password2) => {
  try {
    const response = await axios.post(`http://localhost/api/validate-pwd/${urlCode}/${emailCode}`,
      {password1, password2},
      {
         withCredentials: true,
         headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'application/json'
          }
        },
    );
    return response.data.message;
  } catch (error){
    handleError(error);
  }
};

export const register = async (urlCode, emailCode, fullName, birthDate) => {
  try {
    const response = await axios.post(`http://localhost/api/register/${urlCode}/${emailCode}`,
      {full_name: fullName, birth_date : birthDate},
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'application/json'
          }
      }
    );
    return response.data.message;
  } catch (error) {
    handleError(error);
  }
};



const handleError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message || '요청 실패');
  } else if (error.request) {
    throw new Error('서버로부터 응답이 없습니다.');
  } else {
    throw new Error(`요청 설정 오류: ${error.message}`);
  }
};