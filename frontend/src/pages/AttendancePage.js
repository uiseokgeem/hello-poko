import React, { useState, useEffect } from "react";
import { Layout, Select, Button, Modal, message } from "antd";
import AppHeader from "../components/Header/Header";
import AttendanceChart from "../components/Attendance/AttendanceChart";
import TeacherInfo from "../components/Attendance/TeacherInfo";
import AttendanceModal from "../components/Attendance/AttendanceModal";
import CreateStudentModal from "../components/Attendance/CreateStudentModal";
import {
  fetchAttendanceData,
  fetchStudents,
  createStudent,
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
  // State Management
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [nearestSunday] = useState(getNearestSunday());

  // Fetch Data
  useEffect(() => {
    fetchTeachers().then(setTeachers);
    fetchStudents().then(setStudents);
    fetchAttendanceData(selectedYear).then(setAttendanceData);

    fetchAttendanceStats()
      .then((data) => {
        if (data) setAttendanceStats(data);
        else console.error("Failed to fetch attendance stats");
      })
      .catch((error) => console.error("Error fetching attendance stats:", error));
  }, [selectedYear]);

  // Handle Attendance Modal
  const handleCheck = (studentId) => {
    setCheckedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
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
        await postAttendanceData(nearestSunday, attendanceData);
      }

      const updatedAttendanceData = await fetchAttendanceData(selectedYear);
      setAttendanceData(updatedAttendanceData);
      message.success("출석 데이터가 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("Error posting attendance data:", error);

      if (error.response?.data?.detail) {
        Modal.error({
          title: "출석 데이터 중복",
          content: error.response.data.detail,
        });
      }
    }
    setIsModalOpen(false);
  };

  const openModal = (date = nearestSunday, mode = "create") => {
    setSelectedDate(date);
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

  const closeModal = () => setIsModalOpen(false);

  // Handle Student Modal
  const openStudentModal = () => setIsStudentModalOpen(true);
  const closeStudentModal = () => setIsStudentModalOpen(false);

  const addStudent = async (studentData) => {
    try {
      const newStudent = await createStudent(studentData);
      setStudents((prev) => [...prev, newStudent]);
      message.success("학생이 성공적으로 추가되었습니다!");
      closeStudentModal();
    } catch (error) {
      console.error("Error adding student:", error);
      message.error("학생 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <Layout style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AppHeader />
      <Content className="page-container">
        <h1>출석부</h1>
        <TeacherInfo
          teacherName={teachers?.teacher_name || "Unknown"}
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
          <div className="attendance-buttons">
            <Button
              type="primary"
              onClick={() => openModal()}
              className="new-attendance-button"
            >
              + 새 출석부
            </Button>
            <Button
              type="default"
              onClick={openStudentModal}
              className="add-student-button"
            >
             + 새친구 등록
            </Button>
          </div>
        </div>
        <div className="attendance-chart-container">
          <AttendanceChart
            data={attendanceData}
            students={students}
            openModal={openModal}
          />
        </div>
        <AttendanceModal
          isOpen={isModalOpen}
          onClose={closeModal}
          students={students}
          checkedStudents={checkedStudents}
          handleCheck={handleCheck}
          handleSubmit={handleSubmit}
          selectedDate={selectedDate}
          nearestSunday={nearestSunday}
          mode={modalMode}
        />
        <CreateStudentModal
          isOpen={isStudentModalOpen}
          onClose={closeStudentModal}
          addStudent={addStudent}
          teachers={teachers} // teachers 데이터를 전달
        />
      </Content>
    </Layout>
  );
};

export default AttendancePage;