import React from 'react';
import Logo from '../components/Logo/Logo';
import Register from '../components/Registration/Register/Register';
import { register } from '../api/registrationApi';


const RegisterPage=() => {
 const handleRegisterSubmit = async (urlCode, emailCode, fullName, birthDate) => {
    try {
        const responseMessage = await register(urlCode, emailCode, fullName, birthDate);
        return responseMessage;
    } catch (error) {
        throw new Error(error.message);
    }
 };
 return (
    <div>
        <Logo />
        <Register handleRegisterSubmit={handleRegisterSubmit}/>
    </div>
 )
}

export default RegisterPage;