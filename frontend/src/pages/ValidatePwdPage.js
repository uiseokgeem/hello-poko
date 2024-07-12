import React from 'react';
import Logo from '../components/Logo/Logo';
import ValidatePwd from '../components/Registration/ValidatePwd/ValidatePwd';
import { validatePwd } from '../api/registrationApi';


const ValidatePwdPage = () => {
  const handleValidatePwdSumit = async (urlCode, emailCode, password1, password2) => {
    try {
      const responseMessage = await validatePwd(urlCode, emailCode ,password1, password2);
      return responseMessage;
    } catch (error) {
      throw new Error(error.message);
    }
};
  return (
    <div>
      <Logo></Logo>
      <ValidatePwd handleValidatePwdSumit={handleValidatePwdSumit} />
    </div>
  );
}

export default ValidatePwdPage;