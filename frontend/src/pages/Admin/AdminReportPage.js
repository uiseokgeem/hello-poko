// pages/Admin/AdminReportPage.js
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import AdminAppHeader from "../../components/Admin/AdminHeader";
import ReportTableMain from "../../components/Report/ReportTableMain/ReportTableMain";
import ReportFilter from "../../components/Report/ReportFilter/ReportFilter";
import { fetchAdminReportSummary } from "../../api/reportApi";
import { adminReportColumns } from "../../components/Report/ReportTableMain/adminColumns";

const { Content } = Layout;

const defaultFilters = {
  teacher: null,
  student: "",
  status: null,
  keyword: "",
  start_date: null,
  end_date: null,
};

const AdminReportPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, []);

  const fetchWithFilters = useMemo(() => {
    return async () => {
      return await fetchAdminReportSummary(filters);
    };
  }, [filters]);

  return (
    <Layout style={{ backgroundColor: "#fff" }}>
      <AdminAppHeader />
      <Content className="page-container">
        <div className="header-section" style={{ marginBottom: 8 }}>
          <h1>목양일지</h1>
        </div>

        <ReportFilter
          initialValues={{}}
          onChange={(next) => setFilters(next)}
        />

        <ReportTableMain
          // 필터 변경 시 테이블을 새로고침하고 싶다면 key에 의존성 부여
          key={JSON.stringify(filters)}
          fetchFunction={fetchWithFilters}
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