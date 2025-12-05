import React, { useState } from "react";
import { Layout, Typography, Tabs, Button, Space } from "antd";
import AdminAppHeader from "../../components/Admin/AdminHeader";
import CreateStudentModal from "../../components/Attendance/CreateStudentModal";
import TeachersTable from "../../components/Admin/TeachersTable";
import GoHomeButton from "../../utils/GoHomeButton";
import StudentMembersTable from "../../components/Admin/StudentMembersTable";
import "./AdminMembersPage.css";


const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const AdminMembersPage = () => {
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [mode] = useState("admin");
    
    const handleOpenChangeClassModal = () => {
        // TODO: 반 전체 변경 모달 열기
      };
    
    const handleOpenStudentRegisterModal = () => {
      setIsStudentModalOpen(true);
      };

    const handleCloseStudentRegisterModal = () => {
        setIsStudentModalOpen(false);
      };

    const handleStudentAdded = () => {
        setIsStudentModalOpen(false);

    };

    return (
        <Layout>
            <AdminAppHeader />
            <Content className="admin-members-content">
                <div className="admin-members-header-row">
                    <div className="admin-members-title-area">
                <Title level={2} className="admin-members-title">
                    멤버 관리
                </Title>

                <Tabs defaultActiveKey="teacher" className="admin-members-tabs">
                    <TabPane tab="선생님" key="teacher">
                        <TeachersTable/>
                    </TabPane>

                    <TabPane tab="학생" key="student">
                        <StudentMembersTable/>
                    </TabPane>
                </Tabs>
                    </div>
                
                <div className="admin-members-actions">
                <GoHomeButton/>

                <Space size="middle" className="admin-members-ation-buttons">
                    <Button onClick={handleOpenChangeClassModal}>
                        + 반 전체 변경
                    </Button>

                    <Button type="primary" onClick={handleOpenStudentRegisterModal}>
                        + 학생 등록
                    </Button>
                </Space>
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


