import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import  Logo  from "../Logo/Logo"
import './Header.css';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header className="app-header">
      <div className="logo">
        <Link to="/">
          <img src="/images/poko_logo.png" alt="Logo" />
        </Link>
      </div>
      <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} className="menu">
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">홈</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<FileTextOutlined />}>
          <Link to="/attendance">출석부</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<FileTextOutlined />}>
          <Link to="/report">양육일지</Link>
        </Menu.Item>
      </Menu>
      <div className="user-icon">
        <UserOutlined />
      </div>
    </Header>
  );
};

export default AppHeader;