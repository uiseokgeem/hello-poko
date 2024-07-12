import React from 'react';
import Logo from '../components/Logo/Logo';
import SendEmail from '../components/Registration/SendEmail/SendEmail';
import { sendEmail } from '../api/registrationApi';

const SendEmailPage=() => {
  const handleEmailSubmit = async (email) => {
    try {
      const responseMessage = await sendEmail(email);
      return responseMessage;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return (
    <div>
      <Logo />
      <SendEmail handleEmailSubmit={handleEmailSubmit}/>
    </div>
  );
}

export default SendEmailPage;

