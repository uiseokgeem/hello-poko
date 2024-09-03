import React, { useState, useEffect }  from "react";
import {Layout, Select, Button } from 'antd';
import AppHeader from '../components/Header/Header';
import AttendanceChart from '../components/Attendance/AttendanceChart';
import StudentList from '../components/Attendance/StudentList';
import { fetchAttendanceData, fetchStudents } from '../api/attendanceApi';
import './AttendancePage.css'

const  {Content } = Layout;

const AttendancePage = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedYear, setselectedYear ] = useState(new Data().getFullYear());
    const [students, setStudents ] = useState([]);

    useEffect(() => {
        fetchStudents().then(setStudents);
        fetchAttendanceData(selectedYear).then(setAttendanceData);
      }, [selectedYear]);

    return
    <Layout>
        <AppHeader />
        <Content classNname="page-container">
            <div className="header-section">
                <h1>출석부</h1>
                <Select
                    defaultValue={selectedYear}
                    onChange={(value) => setselectedYear(value)}
                    className="year-select"
                >
                    {[ 2022, 2023, 2024 ].map(year => (
                        <Option key={year} value={year}>{year}</Option>
                    ))}
                </Select>
                <Button type="primary" className="new-attendance-button">+ 새출석부</Button>
            </div>
            <AttendanceChart data={attendanceData} students={students} />
        </Content>

    </Layout>
}

export default AttendancePage
