import React from "react";
import { Layout, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./AdminHeader.css"; // 버튼 스타일 import

const { Header } = Layout;

const AdminAppHeader = () => {
  const navigate = useNavigate();

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
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/images/poko_logo.png`}
            alt="Logo"
            style={{ height: "35px" }}
          />
        </Link>
      </div>

      {/* 우측 버튼 영역 */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* 선생님 관리 버튼 */}
        <Button className="teacher-button" onClick={() => navigate('/admin/teachers')}>
          선생님 관리
        </Button>

        {/* 로그아웃 버튼 */}
        <Button className="logout-button">로그아웃</Button>
      </div>
    </Header>
  );
};

export default AdminAppHeader;