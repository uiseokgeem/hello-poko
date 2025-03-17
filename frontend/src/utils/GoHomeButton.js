import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./GoHomeButton.css"; // 버튼 스타일 추가

const GoHomeButton = () => {
    const navigate = useNavigate();

    return (
        <Button className="go-home-button" onClick={() => navigate("/admin")}>
            홈으로 가기
        </Button>
    );
};

export default GoHomeButton;