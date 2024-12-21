import React, { useState, useEffect } from "react";
import { Layout, Select, Button, Modal } from "antd";
import AppHeader from "../components/Header/Header";
import AttendanceChart from "../components/Attendance/AttendanceChart";
import TeacherInfo from "../components/Attendance/TeacherInfo";
import AttendanceModal from "../components/Attendance/AttendanceModal";
import {
  fetchAttendanceData,
  fetchStudents,
  fetchTeachers,
  fetchAttendanceStats,
  postAttendanceData,
  patchAttendanceData,
} from "../api/attendanceApi";
import { getNearestSunday } from "../utils/dateUtils";
import "./AttendancePage.css";

const { Content } = Layout;
const { Option } = Select;

const AttendancePage = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [nearestSunday, setNearestSunday] = useState(getNearestSunday()); // 상태로 관리

  useEffect(() => {
    fetchTeachers().then(setTeachers);
    fetchStudents().then(setStudents);
    fetchAttendanceData(selectedYear).then(setAttendanceData);

    fetchAttendanceStats()
      .then((data) => {
        if (data) {
          setAttendanceStats(data);
        } else {
          console.error("Failed to fetch attendance stats");
        }
      })
      .catch((error) => {
        console.error("Error fetching attendance stats:", error);
      });
  }, [selectedYear]);

  const handleCheck = (studentId) => {
    setCheckedStudents((prevChecked) =>
      prevChecked.includes(studentId)
        ? prevChecked.filter((id) => id !== studentId)
        : [...prevChecked, studentId]
    );
  };

  const handleSubmit = async () => {
    const attendanceData = students.map((student) => ({
      id: student.id,
      attendance: checkedStudents.includes(student.id),
    }));

    try {
      if (modalMode === "edit") {
        await patchAttendanceData(selectedDate, attendanceData);
      } else {
        await postAttendanceData(nearestSunday, attendanceData); // 상태에서 가져온 값 사용
      }

      const updatedAttendanceData = await fetchAttendanceData(selectedYear);
      setAttendanceData(updatedAttendanceData);
    } catch (error) {
      console.error("Error posting attendance data:", error);

      if (error.response && error.response.data && error.response.data.detail) {
        Modal.error({
          title: "출석 데이터 중복",
          content: error.response.data.detail,
        });
      }
    }

    setIsModalOpen(false);
  };

  const openModal = (date, mode = "create") => {
    setSelectedDate(date || nearestSunday); // 선택된 날짜가 없으면 최근 일요일로 설정
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            onChange={(value) => setSelectedYear(value)}
            className="year-select"
          >
            {[2022, 2023, 2024].map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            onClick={() => openModal()} // 기본적으로 가장 가까운 일요일 날짜를 사용
            className="new-attendance-button"
          >
            + 새 출석부
          </Button>
        </div>
        <AttendanceChart
          data={attendanceData}
          students={students}
          openModal={openModal}
        />
        <AttendanceModal
          isOpen={isModalOpen}
          onClose={closeModal}
          students={students}
          checkedStudents={checkedStudents}
          handleCheck={handleCheck}
          handleSubmit={handleSubmit}
          selectedDate={selectedDate}
          nearestSunday={nearestSunday} // 상태로 관리된 값을 전달
          mode={modalMode}
        />
      </Content>
    </Layout>
  );
};

export default AttendancePage;