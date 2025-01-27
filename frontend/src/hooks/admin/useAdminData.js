// // src/hooks/useAdminData.js
// import { useState, useEffect } from "react";
// import {
//   fetchWeeklyAttendanceData,
//   fetchWeekList,
//   fetchGroupAttendance,
//   fetchMemberAttendanceData,
// } from "../api/adminApi";
// import { message } from "antd";

// const useAdminData = (selectedYear, selectedWeek) => {
//   const [weeklyAttendanceData, setWeeklyAttendanceData] = useState([]);
//   const [memberAttendanceData, setMemberAttendanceData] = useState([]);
//   const [groupAttendanceData, setGroupAttendanceData] = useState([]);
//   const [weekOptions, setWeekOptions] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 주간 출석 데이터 가져오기
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchWeeklyAttendanceData(selectedYear);
//       setWeeklyAttendanceData(data);
//     } catch (error) {
//       console.error("Error fetching weekly attendance data:", error);
//       message.error("출석 데이터를 가져오는 데 실패했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 학생별 출석 데이터 가져오기
//   const loadAttendanceData = async () => {
//     try {
//       const response = await fetchMemberAttendanceData(selectedYear);
//       const { data, students } = response;

//       if (!Array.isArray(data) || !Array.isArray(students)) {
//         throw new Error("Invalid data format");
//       }

//       setMemberAttendanceData(data);
//       setStudents(students);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       message.error("출석 데이터를 가져오는 데 실패했습니다.");
//     }
//   };

//   // 반별 출석 데이터 가져오기
//   const fetchGroupData = async () => {
//     if (!selectedWeek) return;

//     setLoading(true);
//     try {
//       const data = await fetchGroupAttendance(selectedWeek);
//       setGroupAttendanceData(data);
//     } catch (error) {
//       console.error("Error fetching group attendance for selected week:", error);
//       message.error("주차별 반별 출석 데이터를 가져오는 데 실패했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 주차 데이터 가져오기
//   const fetchWeekOptions = async () => {
//     try {
//       const weeks = await fetchWeekList(selectedYear);
//       setWeekOptions(weeks);
//       if (weeks.length > 0) setSelectedWeek(weeks[0]);
//     } catch (error) {
//       console.error("Error fetching week list:", error);
//       message.error("주차 데이터를 가져오는 데 실패했습니다.");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchWeekOptions();
//     loadAttendanceData();
//   }, [selectedYear]);

//   useEffect(() => {
//     fetchGroupData();
//   }, [selectedWeek]);

//   return {
//     weeklyAttendanceData,
//     memberAttendanceData,
//     groupAttendanceData,
//     weekOptions,
//     students,
//     loading,
//     fetchData,
//     loadAttendanceData,
//     fetchGroupData,
//     fetchWeekOptions,
//   };
// };

// export default useAdminData;