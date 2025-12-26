import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Typography, Tabs, Button, Space, Input } from "antd";
import AdminAppHeader from "../../components/Admin/AdminHeader";
import TeachersTable from "../../components/Admin/TeachersTable";
import StudentMembersTable from "../../components/Admin/StudentMembersTable";
import CreateStudentModal from "../../components/Attendance/CreateStudentModal"; // 경로는 프로젝트에 맞게
import "./AdminMembersPage.css";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const AdminMembersPage = () => {
  const [activeTab, setActiveTab] = useState("teacher");
  const [keyword, setKeyword] = useState("");
  const [studentRefreshKey, setStudentRefreshKey] = useState(0);
  const navigate = useNavigate();


  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [mode] = useState("admin");

  const handleOpenStudentRegisterModal = () => setIsStudentModalOpen(true);
  const handleCloseStudentRegisterModal = () => setIsStudentModalOpen(false);

  const handleStudentAdded = (createdStudent) => {
    setIsStudentModalOpen(false);
    setStudentRefreshKey((prev) => prev + 1); 
  };

  return (
    <Layout style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AdminAppHeader />
      <Content className="admin-members-content">
        <div className="admin-members-header-row">
          <div className="admin-members-title-area">
            <Title level={2} className="admin-members-title">멤버 관리</Title>

            <Tabs
              defaultActiveKey="teacher"
              className="admin-members-tabs"
              onChange={(key) => setActiveTab(key)}
            >
              <TabPane tab="선생님" key="teacher">
                <TeachersTable keyword={keyword} />
              </TabPane>

              <TabPane tab="학생" key="student">
                <StudentMembersTable 
                keyword={keyword}
                refreshKey={studentRefreshKey}
                 />
              </TabPane>
            </Tabs>
          </div>

          <div className="admin-members-actions">
            <Space size="middle" className="admin-members-action-buttons">
              <Button
                onClick={() => navigate("/admin/class-assignment")}
              >
                + 반 편성
              </Button>

              <Button type="primary" onClick={handleOpenStudentRegisterModal}>
                + 학생 등록
              </Button>
            </Space>

            <Input
              placeholder="선생님, 학생 이름, 학년 입력"
              allowClear
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 320 }}
            />
          </div>
        </div>

        <CreateStudentModal
          isOpen={isStudentModalOpen}
          onClose={handleCloseStudentRegisterModal}
          onStudentAdded={handleStudentAdded}
          mode={mode}
        />
      </Content>
    </Layout>
  );
};

export default AdminMembersPage;