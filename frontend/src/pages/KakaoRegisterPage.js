import React from 'react';
import Logo from '../components/Logo/Logo';
import KakaoRegister from '../components/Registration/Register/KakaoRegister';
import { kakaoRegister } from '../api/registrationApi';

const KakaoRegisterPage = () => {
    const handleKakaoRegisterSubmit = async (fullName, birthDate) => {
        try {
            const responseMessage = await kakaoRegister(fullName, birthDate); // Kakao API 요청
            return responseMessage; // 성공 메시지 반환
        } catch (error) {
            throw new Error(error.message); // 오류 처리
        }
    };

    return (
        <div>
            <Logo />
            <KakaoRegister handleRegisterSubmit={handleKakaoRegisterSubmit} />
        </div>
    );
};

export default KakaoRegisterPage;