import React, { useState, useEffect } from "react";
import { Layout, Typography, Tabs } from "antd";
import AdminAppHeader from "../../components/Admin/AdminHeader";
import WeeklyAttendanceTab from "../../components/Admin/WeeklyAttendanceTab";
import GroupAttendanceTab from "../../components/Admin/GroupAttendanceTab";
import StudentAttendanceTab from "../../components/Admin/StudentAttendanceTab";
import CreateStudentModal from "../../components/Attendance/CreateStudentModal";
import useWeeklyAttendance from "../../hooks/admin/useWeeklyAttendance"; 
import useGroupAttendance from "../../hooks/admin/useGroupAttendance"; 
import "./AdminPage.css";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const AdminPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [mode] = useState("admin");

  const { weeklyAttendanceData, memberAttendanceData, weekOptions, loading: weeklyLoading, fetchData } =
  useWeeklyAttendance(selectedYear);
  const { groupAttendanceData, selectedWeek, setSelectedWeek, loading: groupLoading, fetchGroupData } =
  useGroupAttendance(weekOptions);
  
  useEffect(() => {
    if (weekOptions.length > 0 && !selectedWeek) {
      setSelectedWeek(weekOptions[0]);
    }
  }, [weekOptions, selectedWeek, setSelectedWeek]); 

  const openStudentModal = () => setIsStudentModalOpen(true);
  const closeStudentModal = () => setIsStudentModalOpen(false);

  return (
    <Layout style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
    <AdminAppHeader />
    <Content className="admin-content">
      <div className="header-section">
        <Title level={2}>출석부</Title>
        <Tabs defaultActiveKey="1" className="tabs-section">
          <TabPane tab="전체 출결" key="1">
            <WeeklyAttendanceTab
              weeklyAttendanceData={weeklyAttendanceData}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              loading={weeklyLoading}
              openStudentModal={openStudentModal}
            />
          </TabPane>
          <TabPane tab="반별 출결" key="2">
            <GroupAttendanceTab
              groupAttendanceData={groupAttendanceData}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
              weekOptions={weekOptions}
              loading={groupLoading}
              openStudentModal={openStudentModal}
            />
          </TabPane>
          <TabPane tab="학생별 출결" key="3">
            <StudentAttendanceTab
              memberAttendanceData={memberAttendanceData}
              loading={weeklyLoading}
              openStudentModal={openStudentModal}
            />
          </TabPane>
        </Tabs>
      </div>
      <CreateStudentModal
        isOpen={isStudentModalOpen}
        onClose={closeStudentModal}
        onStudentAdded={() => {
          fetchData();
          fetchGroupData();
        }}
        mode={mode}
      />
    </Content>
  </Layout>
  );
};

export default AdminPage;