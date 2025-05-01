import React from "react";
import { Layout, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const { Header } = Layout;

const AppHeader = () => {
  const location = useLocation();

  const menuItems = [
    // { label: "홈", path: "/" },
    { label: "출석부", path: "/attendance" },
    { label: "목양일지", path: "/report" },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        background: "#fff",
      }}
    >
      {/* 왼쪽 로고 및 메뉴 */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/images/poko_logo.png`}
            alt="Logo"
            style={{ height: "30px" }}
          />
        </Link>

        {/* 메뉴 목록 */}
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              color: location.pathname === item.path ? "#1890ff" : "#000",
              fontWeight: location.pathname === item.path ? "bold" : "normal",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* 오른쪽 로그아웃 버튼 */}
      <Button className="logout-button">로그아웃</Button>
    </Header>
  );
};

export default AppHeader;