import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

// 인라인 스타일 css

const AppHeader = () => {
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/images/poko_logo.png`}
            alt="Logo"
            style={{ height: "35px" }}
          />
        </Link>
      </div>
      <div style={{ fontSize: "20px", cursor: "pointer" }}>
        <UserOutlined />
      </div>
    </Header>
  );
};

export default AppHeader;