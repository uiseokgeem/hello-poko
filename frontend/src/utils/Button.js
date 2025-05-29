// components/Common/Button.js
import React from "react";
import { Button } from "antd";

const CustomButton = ({ type = "default", label, onClick, variant = "list" }) => {
  const styles = {
    list: {
      height: "42px",
      width: "110px",
      padding: "10px 14px",
      fontSize: "15px",
      borderRadius: "10px",
      fontWeight: 500,
      backgroundColor: "#F5F5F5",
      border: "none",
      color: "#000",
    },
    edit: {
      height: "42px",
      width: "80px",
      padding: "10px 14px",
      fontSize: "15px",
      borderRadius: "10px",
      fontWeight: 500,
      backgroundColor: "#2A83F2",
      border: "none",
      color: "#fff",
    },
    new: {
      height: "40px",
      width: "128px",
      padding: "10px 16px",
      fontSize: "15px",
      fontWeight: 500,
      borderRadius: "8px",
      backgroundColor: "#2A83F2",
      border: "none",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    draft: {
      height: "48px",
      width: "88px",
      padding: "14px 16px",
      fontSize: "16px",
      fontWeight: 500,
      borderRadius: "12px",
      backgroundColor: "#F5F5F5", // ≈ #2125290A
      border: "none",
      color: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    submit: {
      height: "48px",
      width: "88px",
      padding: "14px 16px",
      fontSize: "16px",
      fontWeight: 500,
      borderRadius: "12px",
      backgroundColor: "#2A83F2",
      border: "none",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
  };

  return (
    <Button
      type={type}
      style={styles[variant]}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default CustomButton;