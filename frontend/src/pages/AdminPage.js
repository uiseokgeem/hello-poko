import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Layout, Typography, Select, Button, Spin, Tabs, message } from "antd";
import AppHeader from "../components/Header/Header";
import CreateStudentModal from "../components/Attendance/CreateStudentModal";
import AdminAttendanceChart from "../components/Admin/AdminAttendanceChart";
import {
  fetchWeeklyAttendanceData,
  fetchWeekList,
  fetchGroupAttendance,
  fetchMemberAttendanceData,
} from "../api/adminApi";
import { createStudent } from "../api/attendanceApi";
import { getGraphSeries, getLineGraphOptions, getBarGraphOptionsForGroups } from "../utils/graphUtils";
import "./AdminPage.css";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const AdminPage = () => {
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState([]); // 주간 출석 데이터
  const [memberAttendanceData, setMemberAttendanceData] = useState([]); // 학생별 출석 데이터
  const [groupAttendanceData, setGroupAttendanceData] = useState([]); // 반별 출석 데이터
  const [weekOptions, setWeekOptions] = useState([]); // 주차별 옵션
  const [selectedWeek, setSelectedWeek] = useState(""); // 선택된 주차
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [students, setStudents] = useState([]);

  // 주간 출석 데이터 가져오기
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchWeeklyAttendanceData(selectedYear);
      setWeeklyAttendanceData(data);
    } catch (error) {
      console.error("Error fetching weekly attendance data:", error);
      message.error("출석 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 학생별 출석 데이터 가져오기
  // const loadAttendanceData = async () => {
  //   try {
  //     const { students, attendance } = await fetchMemberAttendanceData(selectedYear);
  //     setStudents(students);
  //     setMemberAttendanceData(attendance);
  //   } catch (error) {
  //     console.error("Error fetching member attendance data:", error);
  //     message.error("출석 데이터를 가져오는 데 실패했습니다.");
  //   }
  // };
  const loadAttendanceData = async () => {
    try {
      // API에서 데이터를 가져옴
      const response = await fetchMemberAttendanceData(selectedYear);
  
      // 응답 데이터에서 data와 students를 분리
      const { data, students } = response;
  
      // 응답 데이터 검증
      if (!Array.isArray(data) || !Array.isArray(students)) {
        throw new Error("Invalid data format");
      }
  
      // 상태 업데이트
      setMemberAttendanceData(data); // 날짜별 출석 데이터
      setStudents(students); // 학생 목록
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      message.error("출석 데이터를 가져오는 데 실패했습니다.");
    }
  };

  // 반별 출석 데이터 가져오기
  const fetchGroupData = async () => {
    if (!selectedWeek) return;

    setLoading(true);
    try {
      const data = await fetchGroupAttendance(selectedWeek);
      setGroupAttendanceData(data);
    } catch (error) {
      console.error("Error fetching group attendance for selected week:", error);
      message.error("주차별 반별 출석 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 주차 데이터 가져오기
  const fetchWeekOptions = async () => {
    try {
      const weeks = await fetchWeekList(selectedYear);
      setWeekOptions(weeks);
      if (weeks.length > 0) setSelectedWeek(weeks[0]);
    } catch (error) {
      console.error("Error fetching week list:", error);
      message.error("주차 데이터를 가져오는 데 실패했습니다.");
    }
  };

  // 연도 변경 시 데이터 갱신
  useEffect(() => {
    fetchData();
    fetchWeekOptions();
    loadAttendanceData();
  }, [selectedYear]);

  // 주차 변경 시 반별 데이터 갱신
  useEffect(() => {
    fetchGroupData();
  }, [selectedWeek]);

  // 새 학생 추가
  const addStudent = async (studentData) => {
    try {
      await createStudent(studentData);
      message.success("학생이 성공적으로 추가되었습니다!");
      closeStudentModal();

      // 데이터 갱신
      fetchData();
      loadAttendanceData();
      fetchGroupData();
    } catch (error) {
      console.error("Error adding student:", error);
      message.error("학생 추가 중 오류가 발생했습니다.");
    }
  };

  // 그래프 데이터 생성
  const series = getGraphSeries(weeklyAttendanceData); // 주간 출석 데이터로 그래프 생성
  const lineGraphOptions = getLineGraphOptions();
  const groupGrades = groupAttendanceData.map((item) => item.name__grade);
  const barChartOptions = getBarGraphOptionsForGroups(groupGrades);

  const groupSeries = [
    {
      name: "출석",
      data: groupAttendanceData.map((item) => item.attendance_count),
    },
    {
      name: "결석",
      data: groupAttendanceData.map((item) => item.absent_count),
    },
  ];

  // 모달 핸들러
  const openStudentModal = () => setIsStudentModalOpen(true);
  const closeStudentModal = () => setIsStudentModalOpen(false);

  return (
    <Layout style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AppHeader />
      <Content className="admin-content">
        <div className="header-section">
          <Title level={2}>출석부</Title>
          <Tabs defaultActiveKey="1" className="tabs-section">
            {/* 전체 출결 탭 */}
            <TabPane tab="전체 출결" key="1">
              <div className="filters">
                <Select
                  defaultValue={selectedYear}
                  onChange={(value) => setSelectedYear(value)}
                  style={{ width: 120, marginRight: "16px" }}
                >
                  {[2023, 2024, 2025].map((year) => (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  ))}
                </Select>
                <Button type="default" onClick={openStudentModal}>
                  + 새친구 등록
                </Button>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Chart options={lineGraphOptions} series={series} type="line" height={350} />
              )}
            </TabPane>

            {/* 반별 출결 탭 */}
            <TabPane tab="반별 출결" key="2">
              <div className="filters">
                <Select
                  value={selectedWeek}
                  onChange={(value) => setSelectedWeek(value)}
                  style={{ width: 160, marginRight: "16px" }}
                >
                  {weekOptions.map((week) => (
                    <Option key={week} value={week}>
                      {week}
                    </Option>
                  ))}
                </Select>
                <Button type="default" onClick={openStudentModal}>
                  + 새친구 등록
                </Button>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Chart options={barChartOptions} series={groupSeries} type="bar" height={350} />
              )}
            </TabPane>

            <TabPane tab="학생별 출결" key="3">
              <div className="filters" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div></div> 
                <Button type="default" onClick={openStudentModal}>
                  + 새친구 등록
                </Button>
              </div>

              {/* 데이터 로딩 처리 */}
              {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <AdminAttendanceChart
                  data={memberAttendanceData}
                  students={students}
                  openModal={(date, mode) => console.log("Open modal for", date, mode)}
                />
              )}
          </TabPane>
          </Tabs>
        </div>
        <CreateStudentModal
          isOpen={isStudentModalOpen}
          onClose={closeStudentModal}
          addStudent={addStudent}
        />
      </Content>
    </Layout>
  );
};

export default AdminPage;


// 코드 백업 
// import React, { useState, useEffect } from "react";
// import Chart from "react-apexcharts";
// import { Layout, Typography, Select, Button, Spin, Tabs, message } from "antd";
// import AppHeader from "../components/Header/Header";
// import CreateStudentModal from "../components/Attendance/CreateStudentModal";
// import {
//   fetchWeeklyAttendanceData,
//   fetchWeekList,
//   fetchGroupAttendance,
// } from "../api/adminApi";
// import { createStudent } from "../api/attendanceApi";
// import { getGraphSeries, getLineGraphOptions, getBarGraphOptionsForGroups } from "../utils/graphUtils";
// import "./AdminPage.css";

// const { Content } = Layout;
// const { Title } = Typography;
// const { Option } = Select;
// const { TabPane } = Tabs;

// const AdminPage = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [groupAttendanceData, setGroupAttendanceData] = useState([]); // 반별 출석 데이터
//   const [weekOptions, setWeekOptions] = useState([]); // 주차별 옵션
//   const [selectedWeek, setSelectedWeek] = useState(""); // 선택된 주차
//   const [loading, setLoading] = useState(false);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

//   // 전체 출석 데이터 가져오기
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchWeeklyAttendanceData(selectedYear);
//       setAttendanceData(data);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       message.error("출석 데이터를 가져오는 데 실패했습니다.");
//     } finally {
//       setLoading(false);
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

//   // 출석이 있는 날짜 리스트 가져오기
//   const fetchWeekOptions = async () => {
//     try {
//       const weeks = await fetchWeekList(selectedYear); // API 호출
//       setWeekOptions(weeks);
//       if (weeks.length > 0) setSelectedWeek(weeks[0]); // 첫 번째 주차 자동 선택
//     } catch (error) {
//       console.error("Error fetching week list:", error);
//       message.error("주차 데이터를 가져오는 데 실패했습니다.");
//     }
//   };

//   // 연도 변경 시 전체 출석 데이터와 주차 데이터 갱신
//   useEffect(() => {
//     fetchData();
//     fetchWeekOptions();
//   }, [selectedYear]);

//   // 주차 변경 시 반별 출석 데이터 갱신
//   useEffect(() => {
//     fetchGroupData();
//   }, [selectedWeek]);

//   // 새 학생 추가
//   const addStudent = async (studentData) => {
//     try {
//       await createStudent(studentData);
//       message.success("학생이 성공적으로 추가되었습니다!");
//       closeStudentModal();

//       // 데이터 갱신
//       fetchData(); // 전체 출석 데이터 갱신
//       if (selectedWeek) {
//         fetchGroupData(); // 반별 출석 데이터 갱신
//       }
//     } catch (error) {
//       console.error("Error adding student:", error);
//       message.error("학생 추가 중 오류가 발생했습니다.");
//     }
//   };

//   // 그래프 데이터 생성
//   const series = getGraphSeries(attendanceData); // 전체 출석 데이터 시리즈
//   const lineGraphOptions = getLineGraphOptions(); // 라인 그래프 옵션
//   const groupGrades = groupAttendanceData.map((item) => item.name__grade); // 반 데이터
//   const barChartOptions = getBarGraphOptionsForGroups(groupGrades); // 막대 그래프 옵션

//   const groupSeries = [
//     {
//       name: "출석",
//       data: groupAttendanceData.map((item) => item.attendance_count), // 출석 수 데이터
//     },
//     {
//       name: "결석",
//       data: groupAttendanceData.map((item) => item.absent_count), // 결석 수 데이터
//     },
//   ];

//   // 모달 핸들러
//   const openStudentModal = () => setIsStudentModalOpen(true);
//   const closeStudentModal = () => setIsStudentModalOpen(false);

//   return (
//     <Layout style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
//       <AppHeader />
//       <Content className="admin-content">
//         <div className="header-section">
//           <Title level={2}>출석부</Title>
//           <Tabs defaultActiveKey="1" className="tabs-section">
//             {/* 전체 출결 탭 */}
//             <TabPane tab="전체 출결" key="1">
//               <div className="filters">
//                 <Select
//                   defaultValue={selectedYear}
//                   onChange={(value) => setSelectedYear(value)}
//                   style={{ width: 120, marginRight: "16px" }}
//                 >
//                   {[2023, 2024, 2025].map((year) => (
//                     <Option key={year} value={year}>
//                       {year}
//                     </Option>
//                   ))}
//                 </Select>
//                 <Button type="default" onClick={openStudentModal}>
//                   + 새친구 등록
//                 </Button>
//               </div>
//               {loading ? (
//                 <div style={{ textAlign: "center", padding: "50px" }}>
//                   <Spin size="large" />
//                 </div>
//               ) : (
//                 <Chart options={lineGraphOptions} series={series} type="line" height={350} />
//               )}
//             </TabPane>

//             {/* 반별 출결 탭 */}
//             <TabPane tab="반별 출결" key="2">
//               <div className="filters">
//                 <Select
//                   value={selectedWeek}
//                   onChange={(value) => setSelectedWeek(value)}
//                   style={{ width: 160, marginRight: "16px" }}
//                 >
//                   {weekOptions.map((week) => (
//                     <Option key={week} value={week}>
//                       {week}
//                     </Option>
//                   ))}
//                 </Select>
//                 <Button type="default" onClick={openStudentModal}>
//                   + 새친구 등록
//                 </Button>
//               </div>
//               {loading ? (
//                 <div style={{ textAlign: "center", padding: "50px" }}>
//                   <Spin size="large" />
//                 </div>
//               ) : (
//                 <Chart options={barChartOptions} series={groupSeries} type="bar" height={350} />
//               )}
//             </TabPane>

//             {/* 학생별 출결 탭 */}
//             <TabPane tab="학생별 출결" key="3">
//               <div style={{ textAlign: "center", padding: "50px" }}>
//                 학생별 출결 데이터가 여기에 표시됩니다.
//               </div>
//             </TabPane>
//           </Tabs>
//         </div>
//         <CreateStudentModal
//           isOpen={isStudentModalOpen}
//           onClose={closeStudentModal}
//           addStudent={addStudent}
//         />
//       </Content>
//     </Layout>
//   );
// };

// export default AdminPage;