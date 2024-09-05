import React, { useState, useEffect }  from "react";
import {Layout, Select, Button } from 'antd';
import AppHeader from '../components/Header/Header';
import AttendanceChart from '../components/Attendance/AttendanceChart';
import TeacherInfo from "../components/Attendance/TeacherInfo";
// import StudentList from '../components/Attendance/StudentList';
// import { fetchAttendanceData, fetchStudents } from '../api/attendanceApi';
import './AttendancePage.css'

const  { Content } = Layout;
const { Option } = Select; 

// 임의의 학생 데이터 생성
const mockStudents = [
    { id: '1', name: '김사랑' },
    { id: '2', name: '김선우' },
    { id: '3', name: '김예나' },
    { id: '4', name: '오예린' },
    { id: '5', name: '이예담' },
  ];

  // 임의의 출석 데이터 생성
const mockAttendanceData = [
    { date: '2023-06-30', attendance: { '1': true, '2': false, '3': true, '4': true, '5': false } },
    { date: '2023-07-07', attendance: { '1': true, '2': true, '3': true, '4': false, '5': true } },
    { date: '2023-07-14', attendance: { '1': true, '2': false, '3': true, '4': true, '5': true } },
    { date: '2023-07-21', attendance: { '1': true, '2': true, '3': true, '4': true, '5': false } },
  ];

const AttendancePage = () => {
     //const [attendanceData, setAttendanceData] = useState([]);
    const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
    //const [students, setStudents ] = useState([]);
    const [students, setStudents] = useState(mockStudents);
    const [selectedYear, setSelectedYear ] = useState(new Date().getFullYear());
    

    // useEffect(() => {
    //     fetchStudents().then(setStudents);
    //     fetchAttendanceData(selectedYear).then(setAttendanceData);
    //   }, [selectedYear]);

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
              <Button type="primary" className="new-attendance-button">+ 새 출석부</Button>
            </div>
            
            <AttendanceChart data={attendanceData} students={students} />  {/* 출석 차트 컴포넌트 */}
          </Content>
        </Layout>
      );
    };
    
    export default AttendancePage;