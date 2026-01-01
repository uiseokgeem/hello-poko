import React from "react";
import { Layout, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./AdminHeader.css"; // 버튼 스타일 import

const { Header } = Layout;

const AdminAppHeader = () => {
  const location = useLocation();

  const menuItems = [
    // { label: "홈", path: "/" },
    { label: "출석", path: "/admin" },
    { label: "목양일지", path: "/admin/report" },
    { label: "멤버", path: "/admin/members" },
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
      {/* 로고 */}
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

      {/* 우측 버튼 영역 */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* 로그아웃 버튼 */}
        <Button className="logout-button">로그아웃</Button>
      </div>
    </Header>
  );
};

export default AdminAppHeader;
