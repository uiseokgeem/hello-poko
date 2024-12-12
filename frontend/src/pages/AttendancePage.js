import React, { useState, useEffect }  from "react";
import {Layout, Select, Button, Modal, Checkbox } from 'antd';
import axios from "axios";
import AppHeader from '../components/Header/Header';
import AttendanceChart from '../components/Attendance/AttendanceChart';
import TeacherInfo from "../components/Attendance/TeacherInfo";
import AttendanceModal  from "../components/Attendance/AttendanceModal";
import { fetchAttendanceData, fetchStudents, fetchTeachers, fetchAttendanceStats, postAttendanceData, patchAttendanceData } from '../api/attendanceApi';
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
    const [selectedDate, setselectedDate] = useState(null);
    const [modalMode, setModalMode] = useState("create");

    useEffect(() => {
      fetchTeachers().then((data) => {
        console.log("Fetched teachers data: ", data); // teachers 데이터 확인
        setTeachers(data);
      });
      fetchStudents().then((data) => {
        console.log("Fetched students data: ", data); // students 데이터 확인
        setStudents(data);
      });
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

    const getFormattedDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작하므로 +1 필요
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const handleSubmit = async () => {
      const attendanceData = students.map(student => ({
        id : student.id,
        attendance: checkedStudents.includes(student.id)
      }));

      const currentDate = getFormattedDate(new Date());

      try {
        if (modalMode === "edit") {
          // PATCH 요청
          console.log("Sending PATCH request...");
          await patchAttendanceData(selectedDate, attendanceData); // 수정된 데이터를 서버로 전송
      } else {
          // POST 요청
          console.log("Sending POST request...");
          await postAttendanceData(getFormattedDate(new Date()), attendanceData); // 새로운 데이터를 서버로 전송
      }
    
        // 새로운 데이터를 반영하기 위해 출석 데이터를 다시 가져옴
        const updatedAttendanceData = await fetchAttendanceData(selectedYear);
        console.log("Fetched updated attendance data: ", updatedAttendanceData);
        
        // 차트를 업데이트하기 위해 상태를 업데이트
        setAttendanceData(updatedAttendanceData);
      } catch (error) {
        console.error('Error posting attendance data:', error);
        
        if (error.response && error.response.data && error.response.data.detail) {
          Modal.error({
              title: '출석 데이터 중복',
              content: error.response.data.detail,  // Django Response error mesaage
          });
      } 
      }
    
      setIsModalOpen(false);  // 모달 닫기
    };
  
    const openModal = (date, mode = "create") => {
      setselectedDate(date);
      setModalMode(mode);
      if (mode === "edit") {
        const existingAttendance = attendanceData.find(
          (entry) => entry.date === date
        );
        if (existingAttendance) {
          setCheckedStudents(
            existingAttendance.attendance
            .filter((entry) => entry.attendance)
            .map((entry) => entry.id)
          );
        }
      } else {
        setCheckedStudents([]);
      }
      setIsModalOpen(mode);  // 모달 열기
    };
  
    const closeModal = () => {
      setIsModalOpen(false);  // 모달 닫기
    };
  

    return (
      <Layout style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
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
            <AttendanceChart data={attendanceData} students={students} openModal={openModal} />  {/* 출석 차트 컴포넌트 */}
            <AttendanceModal
              isOpen={isModalOpen}
              onClose={closeModal}
              students={students}
              checkedStudents={checkedStudents}
              handleCheck={handleCheck}
              handleSubmit={handleSubmit}
              getFormattedDate={getFormattedDate(new Date())}
              selectedDate={selectedDate} // 선택된 날짜 전달
              mode={modalMode} // 모달 모드 전달
            >
            </AttendanceModal>
          </Content>
        </Layout>
      );
    };
    
    export default AttendancePage;