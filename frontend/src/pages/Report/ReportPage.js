import React from 'react';
import { useNavigate } from "react-router-dom";
import { Layout } from 'antd';
import AppHeader from '../../components/Header/Header';
import ReportTableMain from "../../components/Report/ReportTableMain/ReportTableMain";
import { fetchReportSummary } from "../../api/reportApi";
import { reportColumns } from "../../components/Report/ReportTableMain/userColumns";
import './ReportPage.css';

const { Content } = Layout;

const ReportPage = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ backgroundColor: "#fff" }}>
      <AppHeader />
      <Content className="page-container">
        <div className="header-section">
          <h1>목양일지</h1>
        </div>
        
        <ReportTableMain
            fetchFunction={fetchReportSummary}
            columns={reportColumns}
            showCreateButton={true}
            onRowClick={(record) => {
              if (record.isNew) {
                navigate("/report/create");
              } else {
                navigate(`/report/detail/${record.key}`);
              }
            }}
          />


      </Content>
    </Layout>
  );
};

export default ReportPage;