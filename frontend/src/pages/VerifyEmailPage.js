import React from 'react';
import Logo from '../components/Logo/Logo';
import VerifyEmail from '../components/Registration/VerifyEmail/VerifyEmail';
import { verifyEmail } from '../api/registrationApi';

const VerifyEmailPage = () => {
  const handleVerificationSubmit = async (urlCode, emailCode, verificationCode) => {
    try {
      const responseMessage = await verifyEmail(urlCode, emailCode, verificationCode);
      return responseMessage;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <div>
      <Logo />
      <VerifyEmail handleVerificationSubmit={handleVerificationSubmit} />
    </div>
  );
}

export default VerifyEmailPage;