import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../../components/Header/Header';
import ReportMain from '../../components/Report/ReportMain/ReportMain';
import './ReportPage.css';

const { Content } = Layout;

const ReportPage = () => {
  return (
    <Layout style={{ backgroundColor: "#fff" }}>
      <AppHeader />
      <Content className="page-container">
        <div className="header-section">
          <h1>목양일지</h1>
        </div>
        <ReportMain />


      </Content>
    </Layout>
  );
};

export default ReportPage;