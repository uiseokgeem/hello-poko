import React, { useState, useEffect }  from "react";
import {Layout, Select, Button, Modal, Checkbox } from 'antd';
import AppHeader from '../components/Header/Header';
import AttendanceChart from '../components/Attendance/AttendanceChart';
import TeacherInfo from "../components/Attendance/TeacherInfo";
import AttendanceModal  from "../components/Attendance/AttendanceModal";
// import StudentList from '../components/Attendance/StudentList';
import { fetchAttendanceData, fetchStudents, fetchTeachers, fetchAttendanceStats } from '../api/attendanceApi';
import './AttendancePage.css'

const  { Content } = Layout;
const { Option } = Select; 
  

const AttendancePage = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents ] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [attendanceStats, setAttendanceStats] = useState([]);
    const [selectedYear, setSelectedYear ] = useState(new Date().getFullYear());
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [checkedStudents, setCheckedStudents] = useState([]);

    useEffect(() => {
      fetchTeachers().then((data) => {
        console.log("Fetched teachers data: ", data); // teachers 데이터 확인
        setTeachers(data);
      });
      fetchStudents().then(setStudents);
      fetchAttendanceData(selectedYear).then((data) => {
        console.log("Fetched attendance data: ", data); // 데이터 로그 출력
        setAttendanceData(data);
      });
      fetchAttendanceStats().then(setAttendanceStats);
   }, [selectedYear]);

    const handleCheck = (studentId) => {
      setCheckedStudents(prevChecked => 
        prevChecked.includes(studentId)
        ? prevChecked.filter(id => id !== studentId)
        : [...prevChecked, studentId]
      );
    };

    const handleSubmit = () => {
      console.log('출석부 등록 완료:', checkedStudents);
      setIsModalOpen(false);  // 모달 닫기
    };
  
    const openModal = () => {
      setIsModalOpen(true);  // 모달 열기
    };
  
    const closeModal = () => {
      setIsModalOpen(false);  // 모달 닫기
    };
  

    return (
        <Layout>
          <AppHeader />
          <Content className="page-container">
          <h1>출석부</h1>
          <TeacherInfo 
              teacherName={teachers?.teacher_name ? teachers.teacher_name : "Unknown"} 
              className="보류" 
              attendanceRate={attendanceStats?.result_stats || []}
            />
            <div className="header-section">
              <Select
                defaultValue={selectedYear}
                onChange={(value) => setSelectedYear(value)}  // 상태 업데이트
                className="year-select"
              >
                {[2022, 2023, 2024].map(year => (
                  <Option key={year} value={year}>{year}</Option>  // Option 컴포넌트 추가
                ))}
              </Select>
              <Button type="primary" onClick={openModal} className="new-attendance-button">+ 새 출석부</Button>
            </div>
            <AttendanceChart data={attendanceData} students={students} />  {/* 출석 차트 컴포넌트 */}
            <AttendanceModal
              isOpen={isModalOpen}
              onClose={closeModal}
              students={students}
              checkedStudents={checkedStudents}
              handleCheck={handleCheck}
              handleSubmit={handleSubmit}
            >
            </AttendanceModal>
          </Content>
        </Layout>
      );
    };
    
    export default AttendancePage;