import axios from 'axios';
import { Cookies } from 'react-cookie';

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}accounts/`;

export const login = async (id, password) => {
    try {
        const response = await axios.post(
            `${API_URL}login/`,
            { email: id, password: password },
            {
                withCredentials: true,
                headers: {
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