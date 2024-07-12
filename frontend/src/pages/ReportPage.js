import React from 'react';
import { Layout, Tabs, Button } from 'antd';
import AppHeader from '../components/Header/Header';
import UserCheck from '../components/Report/UserCheck/UserCheck';
import MemberCheck from '../components/Report/MemberCheck/MemberCheck';
import './ReportPage.css';

const { TabPane } = Tabs;
const { Content } = Layout;

const ReportPage = () => {
  return (
    <Layout>
      <AppHeader />
      <Content className="page-container">
        <div className="header-section">
          <h1>양육일지</h1>
        </div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="하나님 앞에서" key="1">
            <UserCheck />
          </TabPane>
          <TabPane tab="학생 양육일지" key="2">
            <MemberCheck />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default ReportPage;