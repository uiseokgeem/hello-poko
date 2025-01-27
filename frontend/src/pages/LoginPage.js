import React from 'react';
import Login from '../components/Auth/Login/Login';
import { login } from '../api/loginApi';

const LoginPage = () => {
    const handleLoginSubmit = async (id, password) => {
        try {
            const responseMessage = await login(id, password);
            return responseMessage;
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