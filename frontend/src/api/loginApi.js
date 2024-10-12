import axios from 'axios';
import { Cookies } from 'react-cookie';

// 배포 환경 감지
const isProd = process.env.NODE_ENV === "production"; 
const API_URL = isProd ? 'https://www.poko-dev.com/api/accounts/' : 'http://localhost:8000/api/accounts/';

// CSRF 토큰을 쿠키에서 가져오는 함수
const getCSRFToken = () => {
    const cookies = new Cookies();
    return cookies.get('csrftoken');
};

// CSRF 토큰 가져오기
const csrftoken = getCSRFToken();

export const login = async (id, password) => {
    try {
        const response = await axios.post(
            `${API_URL}login/`, // API URL 수정
            { email: id, password: password },
            {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
            }
        );

        const { access, refresh } = response.data;

        localStorage.setItem('poko-auth', access);
        localStorage.setItem('refresh-token', refresh);

        console.log("Access Token:", access);
        console.log("Refresh Token:", refresh);

        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const handleError = (error) => {
    if (error.response) {
        const errorData = error.response.data;
        let errorMessage = '요청 실패';
        
        if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors.join(' ');
        } else if (errorData.email) {
            errorMessage = errorData.email.join(' ');
        } else if (errorData.password) {
            errorMessage = errorData.password.join(' ');
        } else if (errorData.detail) {
            errorMessage = errorData.detail;
        } else {
            errorMessage = Object.values(errorData).flat().join(' ');
        }
        
        throw new Error(errorMessage);
    } else if (error.request) {
        throw new Error('서버로부터 응답이 없습니다.');
    } else {
        throw new Error(`요청 설정 오류: ${error.message}`);
    }
};