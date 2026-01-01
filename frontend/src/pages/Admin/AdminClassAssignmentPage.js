// src/pages/Admin/AdminClassAssignmentPage.js
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Typography, Tabs, Button } from "antd";
import AdminAppHeader from "../../components/Admin/AdminHeader";
import AdminClassAssignmentStep1 from "../../components/Admin/ClassManagement/AdminClassAssignmentStep1";
import AdminStudentGradeStep2 from "../../components/Admin/ClassManagement/AdminStudentGradeStep2";
import AdminStudentPlacementStep3 from "../../components/Admin/ClassManagement/AdminStudentPlacementStep3";
import "./AdminClassAssignmentPage.css";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const AdminClassAssignmentPage = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("step1");
  const [refreshKey, setRefreshKey] = useState(0);

  const GRADE_OPTIONS = ["중1", "중2", "중3", "고1", "고2", "고3", "졸업"];

  const onAnyStepSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleGoBack = () => {
    navigate("/admin/members");
  };

  return (
    <Layout className="admin-class-layout">
      <AdminAppHeader />

      <Content className="admin-class-content">
        <div className="admin-class-scroll">
          <div className="admin-class-page">
            <div className="admin-class-topbar">
              <Title level={2} className="admin-class-title">
                반 편성
              </Title>

              <Button className="admin-class-back-button" onClick={handleGoBack}>
                이전 페이지로
              </Button>
            </div>

            <div className="admin-class-tabs-wrap">
              <Tabs activeKey={activeKey} onChange={setActiveKey}>
                <TabPane tab="반편성" key="step1">
                  <AdminClassAssignmentStep1
                    refreshKey={refreshKey}
                    onSaved={onAnyStepSaved}
                  />
                </TabPane>

                <TabPane tab="학년 수정" key="step2">
                  <AdminStudentGradeStep2
                    refreshKey={refreshKey}
                    onSaved={onAnyStepSaved}
                    gradeOptions={GRADE_OPTIONS}
                  />
                </TabPane>

                <TabPane tab="학생 배정" key="step3">
                  <AdminStudentPlacementStep3
                    refreshKey={refreshKey}
                    onSaved={onAnyStepSaved}
                    gradeOptions={GRADE_OPTIONS}
                  />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminClassAssignmentPage;