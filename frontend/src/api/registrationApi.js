import axios from 'axios';
import { Cookies } from 'react-cookie';

// 배포 환경 감지
const isProd = process.env.NODE_ENV === "production"; 
const API_URL = isProd ? 'https://www.poko-dev.com/api/accounts/' : 'http://localhost:8000/api/accounts/';


export const sendEmail = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}send-email`,
      { email },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
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
      `${API_URL}confirm-email/${urlCode}/${emailCode}`,
      { user_input_code: verificationCode },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.message;
  } catch (error) {
    handleError(error);
  }
};

export const validatePwd = async (urlCode, emailCode, password1, password2) => {
  try {
    const response = await axios.post(
      `${API_URL}validate-pwd/${urlCode}/${emailCode}`,
      { password1, password2 },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.message;
  } catch (error) {
    handleError(error);
  }
};

export const register = async (urlCode, emailCode, fullName, birthDate) => {
  try {
    const response = await axios.post(
      `${API_URL}register/${urlCode}/${emailCode}`,
      { full_name: fullName, birth_date: birthDate },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
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