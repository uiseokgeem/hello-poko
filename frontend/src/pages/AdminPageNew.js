import React, { useState } from "react";
import { Layout, Typography, Tabs } from "antd";
import AppHeader from "../components/Header/Header";
import CreateStudentModal from "../components/Attendance/CreateStudentModal";
import { useAttendanceData } from "../hooks/admin/useAttendanceData"; 
import { WeeklyAttendanceTab } from "../components/Admin/WeeklyAttendanceTab"; 
import { GroupAttendanceTab } from "../components/Admin/GroupAttendanceTab";  
import { StudentAttendanceTab } from "../components/Admin/StudentAttendanceTab";  
import "./AdminPage.css";  // ✅ CSS 파일 추가

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const AdminPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const { weeklyAttendanceData, memberAttendanceData, groupAttendanceData, weekOptions, loading, fetchData } =
    useAttendanceData(selectedYear);

  const openStudentModal = () => setIsStudentModalOpen(true);
  const closeStudentModal = () => setIsStudentModalOpen(false);

  return (
    <Layout style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AppHeader />
      <Content className="admin-content">
        <Title level={2}>출석부</Title>
        <Tabs defaultActiveKey="1" className="tabs-section">
          <TabPane tab="전체 출결" key="1">
            <WeeklyAttendanceTab
              weeklyAttendanceData={weeklyAttendanceData}
              loading={loading}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              openStudentModal={openStudentModal}
            />
          </TabPane>
          <TabPane tab="반별 출결" key="2">
            <GroupAttendanceTab groupAttendanceData={groupAttendanceData} weekOptions={weekOptions} loading={loading} />
          </TabPane>
          <TabPane tab="학생별 출결" key="3">
            <StudentAttendanceTab memberAttendanceData={memberAttendanceData} loading={loading} />
          </TabPane>
        </Tabs>
        <CreateStudentModal isOpen={isStudentModalOpen} onClose={closeStudentModal} />
      </Content>
    </Layout>
  );
};

export default AdminPage;