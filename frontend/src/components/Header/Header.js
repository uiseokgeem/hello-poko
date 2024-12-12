import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import './Header.css';

const { Header } = Layout;

const items = [
  {
    key: '1',
    icon: <HomeOutlined />,
    label: <Link to="/home">홈</Link>,
  },
  {
    key: '2',
    icon: <FileTextOutlined />,
    label: <Link to="/attendance">출석부</Link>,
  },
  {
    key: '3',
    icon: <FileTextOutlined />,
    label: <Link to="/report">양육일지</Link>,
  },
];

const AppHeader = () => {
  return (
    <Header className="app-header">
      <div className="logo">
        <Link to="/">
        <img src={`${process.env.PUBLIC_URL}/images/poko_logo.png`} alt="Logo" />
        </Link>
      </div>
      <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} className="menu" items={items} />
      <div className="user-icon">
        <UserOutlined />
      </div>
    </Header>
  );
};

export default AppHeader;