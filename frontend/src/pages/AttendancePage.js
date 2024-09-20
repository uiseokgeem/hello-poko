import React, { useState, useEffect }  from "react";
import {Layout, Select, Button, Modal, Checkbox } from 'antd';
import AppHeader from '../components/Header/Header';
import AttendanceChart from '../components/Attendance/AttendanceChart';
import TeacherInfo from "../components/Attendance/TeacherInfo";
import AttendanceModal  from "../components/Attendance/AttendanceModal";
// import StudentList from '../components/Attendance/StudentList';
import { fetchAttendanceData, fetchStudents } from '../api/attendanceApi';
import './AttendancePage.css'

const  { Content } = Layout;
const { Option } = Select; 

// 임의의 출석 데이터 생성
// const mockAttendanceData = [
//   { date: '2023-06-30', attendance: { '1': true, '2': false, '3': true, '4': true, '5': false, '6': true, '7': true, '8': false, '9': true, '10': false } },
//   { date: '2023-07-07', attendance: { '1': true, '2': true, '3': true, '4': false, '5': true, '6': false, '7': true, '8': true, '9': false, '10': true } },
//   { date: '2023-07-14', attendance: { '1': true, '2': false, '3': true, '4': true, '5': true, '6': true, '7': false, '8': true, '9': true, '10': false } },
//   { date: '2023-07-21', attendance: { '1': true, '2': true, '3': true, '4': true, '5': false, '6': false, '7': true, '8': true, '9': false, '10': true } },
//   { date: '2023-07-28', attendance: { '1': false, '2': true, '3': false, '4': true, '5': true, '6': true, '7': true, '8': false, '9': true, '10': true } },
//   { date: '2023-08-04', attendance: { '1': true, '2': false, '3': true, '4': true, '5': false, '6': false, '7': true, '8': true, '9': false, '10': true } },
//   { date: '2023-08-11', attendance: { '1': true, '2': true, '3': true, '4': false, '5': true, '6': true, '7': true, '8': true, '9': false, '10': true } },
//   { date: '2023-08-18', attendance: { '1': true, '2': false, '3': true, '4': true, '5': false, '6': true, '7': false, '8': true, '9': true, '10': true } }
// ];

  

const AttendancePage = () => {
     const [attendanceData, setAttendanceData] = useState([]);
    // const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
    // const [students, setStudents] = useState(mockStudents); 
    const [students, setStudents ] = useState([]);
    const [selectedYear, setSelectedYear ] = useState(new Date().getFullYear());
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [checkedStudents, setCheckedStudents] = useState([]);
    

    useEffect(() => {
        fetchStudents().then(setStudents);
        fetchAttendanceData(selectedYear).then(setAttendanceData);
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
          <TeacherInfo teacherName="노다은 선생님" className="중 2,3 여" attendanceRate={80} />
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