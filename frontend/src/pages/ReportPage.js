import React from 'react';
import { Layout, Tabs } from 'antd';
import AppHeader from '../components/Header/Header';
import UserCheck from '../components/Report/UserCheck/UserCheck';
import MemberCheck from '../components/Report/MemberCheck/MemberCheck';
import Issue from '../components/Report/Issue/Issue';
import './ReportPage.css';

const { Content } = Layout;

const items = [
  {
    key: '1',
    label: '하나님 앞에서',
    children: <UserCheck />,
  },
  {
    key: '2',
    label: '학생 양육일지',
    children: <MemberCheck />,
  },
  {
    key: '3',
    label: '문의사항',
    children: <Issue />,
    

  },
];

const ReportPage = () => {
  return (
    <Layout>
      <AppHeader />
      <Content className="page-container">
        <div className="header-section">
          <h1>양육일지</h1>
        </div>
        <Tabs defaultActiveKey="1" items={items} />
      </Content>
    </Layout>
  );
};

export default ReportPage;