import React from "react";
import { Layout, Typography } from "antd";
import AppHeader from "../../components/Header/Header";
import TeachersTable from "../../components/Admin/TeachersTable";
import GoHomeButton from "../../utils/GoHomeButton"; // ✅ 추가
import "./AdminTeacher.css"; 

const { Content } = Layout;
const { Title } = Typography; 

const AdminTeacher = () => { 
  return (
    <Layout className="admin-teacher-container">
      <AppHeader />
      <Content className="admin-teacher-content">
        <Title className="admin-teacher-title" level={2}>선생님 관리</Title>
        <div className="go-home-button-wrapper">
          <GoHomeButton />
        </div>
        <TeachersTable />
      </Content>
    </Layout>
  );
};

export default AdminTeacher;