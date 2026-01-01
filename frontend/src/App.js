import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SendEmailPage from './pages/SendEmailPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ValidatePwdPage from './pages/ValidatePwdPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ReportPage from './pages/Report/ReportPage';
import ReportCreatePage from './pages/Report/ReportCreatePage';
import ReportDetailPage from './pages/Report/ReportDetailPage';
import ReportEditPage from './pages/Report/ReportEditPage';
import AttendancePage from './pages/AttendancePage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/Admin/AdminPage';
import AdminReportPage from './pages/Admin/AdminReportPage';
import AdminReportDetailPage from './pages/Admin/AdminReportDetailPage';
import AdminMembersPage from './pages/Admin/AdminMembersPage';
import AdminClassAssignmentPage from './pages/Admin/AdminClassAssignmentPage'
// import AdminTeacher from './pages/Admin/AdminTeacher';
import KakaoRegisterPage from './pages/KakaoRegisterPage';
import KakaoAuthHandler from './pages/KakaoAuthHandler';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 기본 진입 시 로그인으로 */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 일반 유저 영역 */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/send-email" element={<SendEmailPage />} />
        <Route path="/verify-email/:url_code/:email_code" element={<VerifyEmailPage />} />
        <Route path="/validate-pwd/:url_code/:email_code" element={<ValidatePwdPage />} />
        <Route path="/register/:url_code/:email_code" element={<RegisterPage />} />
        <Route path="/register" element={<KakaoRegisterPage />} />

        {/* 리포트(교사) 영역 */}
        <Route path="/report" element={<ReportPage />} />
        <Route path="/report/create" element={<ReportCreatePage />} />
        <Route path="/report/detail/:id" element={<ReportDetailPage />} />
        <Route path="/report/edit/:id" element={<ReportEditPage />} />

        {/* 출석(교사) 영역 */}
        <Route path="/attendance" element={<AttendancePage />} />

        {/* 카카오 인증 */}
        <Route path="/auth/kakao" element={<KakaoAuthHandler />} />

        {/* 관리자(admin) 영역 */}
        <Route path="/admin" element={<AdminPage />} />                 {/* 출석 통계/관리 메인 */}
        <Route path="/admin/members" element={<AdminMembersPage />} />     {/* 멤버(교사/학생) 관리 */}
        <Route path="/admin/report" element={<AdminReportPage />} />   {/* 목양일지 관리 */}
        <Route path="/admin/report/detail/:id" element={<AdminReportDetailPage />} />
        <Route path="/admin/class-assignment" element={<AdminClassAssignmentPage />} />
      </Routes>
    </Router>
  );
};

export default App;