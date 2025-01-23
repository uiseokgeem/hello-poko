import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SendEmailPage from './pages/SendEmailPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ValidatePwdPage from './pages/ValidatePwdPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ReportPage from './pages/ReportPage';
import AttendancePage from './pages/AttendancePage';
import HomePage from './pages/HomePage';
import Adminpage from './pages/AdminPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/home" element={<HomePage />} />
        <Route path='admin-page' element={<Adminpage/>} />
        <Route path="/send-email" element={<SendEmailPage />} />
        <Route path="/verify-email/:url_code/:email_code" element={<VerifyEmailPage />} />
        <Route path="/validate-pwd/:url_code/:email_code" element={<ValidatePwdPage />} />
        <Route path="/register/:url_code/:email_code" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage></LoginPage>}/>
        <Route path="/report" element={<ReportPage />} /> 
        <Route path="/attendance" element={<AttendancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
