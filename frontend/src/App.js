import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SendEmailPage from './pages/SendEmailPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ValidatePwdPage from './pages/ValidatePwdPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ReportPage from './pages/ReportPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SendEmailPage />} />
        <Route path="/verify-email/:url_code/:email_code" element={<VerifyEmailPage />} />
        <Route path="/validate-pwd/:url_code/:email_code" element={<ValidatePwdPage />} />
        <Route path="/register/:url_code/:email_code" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage></LoginPage>}/>
        <Route path="/report" element={<ReportPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
