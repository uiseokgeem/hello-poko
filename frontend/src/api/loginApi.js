import axios from 'axios';
import { Cookies } from 'react-cookie';

// 배포 환경 감지
const isProd = process.env.NODE_ENV === "production"; 
const API_URL = isProd ? 'https://www.poko-dev.com/api/accounts/' : 'http://localhost:8000/api/accounts/';

// CSRF 토큰을 쿠키에서 가져오는 함수
const getCSRFToken = async () => {
    try {
        // Django 서버로 GET 요청을 보내서 CSRF 토큰을 쿠키에 받아옴
        const response = await axios.get(`${API_URL}get-csrf-token/`, {
            withCredentials: true, // 쿠키를 포함해서 요청
        });
        console.log('CSRF 토큰을 성공적으로 받았습니다.');
        return response; // 쿠키에 저장된 CSRF 토큰 반환
    } catch (error) {
        console.error('CSRF 토큰을 가져오는 중 오류가 발생했습니다:', error);
        throw new Error('CSRF 토큰을 가져오는 중 오류가 발생했습니다.');
    }
};

// CSRF 토큰을 쿠키에서 가져오는 함수
const getCSRFTokenFromCookies = () => {
    const cookies = new Cookies();
    return cookies.get('csrftoken');
};

export const login = async (id, password) => {
    try {
        // 먼저 CSRF 토큰을 받아오는 요청을 수행
        await getCSRFToken();

        // 쿠키에서 CSRF 토큰을 가져옴
        const csrftoken = getCSRFTokenFromCookies();

        // 로그인 요청
        const response = await axios.post(
            `${API_URL}login/`,
            { email: id, password: password },
            {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrftoken,  // 가져온 CSRF 토큰을 헤더에 포함
                    'Content-Type': 'application/json',
                },
            }
        );

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