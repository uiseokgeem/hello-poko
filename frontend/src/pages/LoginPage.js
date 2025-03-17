import React from 'react';
import Login from '../components/Auth/Login/Login';
import { login } from '../api/loginApi';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSubmit = async (id, password) => {
        try {
            const response = await login(id, password);

            // is_admin 값에 따라 리다이렉트
            if (response.is_superuser) {
                navigate('/admin'); // 관리자 페이지로 리다이렉트
            } else {
                navigate('/attendance'); // 일반 사용자 페이지로 리다이렉트
            }

            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    return (
        <div>
            <Login handleLoginSubmit={handleLoginSubmit} />
        </div>
    );
};

export default LoginPage;