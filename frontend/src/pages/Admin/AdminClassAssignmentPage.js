// src/pages/Admin/AdminClassAssignmentPage.js
import React, { useState, useCallback } from "react";
import { Tabs } from "antd";
import AdminClassAssignmentStep1 from "../../components/Admin/ClassManagement/AdminClassAssignmentStep1";
import AdminStudentGradeStep2 from "../../components/Admin/ClassManagement/AdminStudentGradeStep2";
import AdminStudentPlacementStep3 from "../../components/Admin/ClassManagement/AdminStudentPlacementStep3";

const { TabPane } = Tabs;

const AdminClassAssignmentPage = () => {
  const [activeKey, setActiveKey] = useState("step1");
  const [refreshKey, setRefreshKey] = useState(0);

  const onAnyStepSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <TabPane tab="반편성" key="step1">
          <AdminClassAssignmentStep1 refreshKey={refreshKey} onSaved={onAnyStepSaved} />
        </TabPane>

        <TabPane tab="학년 업데이트" key="step2">
          <AdminStudentGradeStep2 refreshKey={refreshKey} onSaved={onAnyStepSaved} />
        </TabPane>

        <TabPane tab="학생 배치" key="step3">
          <AdminStudentPlacementStep3 refreshKey={refreshKey} onSaved={onAnyStepSaved} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminClassAssignmentPage;