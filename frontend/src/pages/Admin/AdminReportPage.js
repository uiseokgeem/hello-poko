import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from 'antd';
import AdminAppHeader from "../../components/Admin/AdminHeader";
import ReportTableMain from "../../components/Report/ReportTableMain/ReportTableMain";
import { fetchAdminReportSummary } from "../../api/reportApi";
import { adminReportColumns } from "../../components/Report/ReportTableMain/adminColumns";

const { Content } = Layout;

const AdminReportPage = () => {
  const navigate = useNavigate();

return (
<Layout style={{ backgroundColor: "#fff" }}>
  <AdminAppHeader />
  <Content className="page-container">
    <div className="header-section">
      <h1>목양일지</h1>
    </div>
  <ReportTableMain
      fetchFunction={fetchAdminReportSummary}
      columns={adminReportColumns}
      showCreateButton={false}
      onRowClick={(record) => {
        navigate(`/admin/report/detail/${record.key}`);
      }}
    />

    
  </Content>


</Layout>
  );
};

export default AdminReportPage;