// src/components/Admin/ClassManagement/ClassManagementButtons.js
import React from "react";
import { Button, Space } from "antd";
import "./ClassManagementButtons.css";

export const ClassCancelButton = ({ children = "취소", ...props }) => {
  return (
    <Button className="cm-btn cm-btn-cancel" {...props}>
      {children}
    </Button>
  );
};

export const ClassSaveButton = ({ children = "저장하기", ...props }) => {
  return (
    <Button className="cm-btn cm-btn-save" {...props}>
      {children}
    </Button>
  );
};

export const ClassManagementButtonGroup = ({
  onCancel,
  onSave,
  cancelText = "취소",
  saveText = "저장하기",
  loading = false,
  disabled = false,
  align = "right", // "right" | "left"
}) => {
  return (
    <div className={`cm-btn-row cm-btn-row-${align}`}>
      <Space>
        <ClassCancelButton onClick={onCancel} disabled={disabled || loading}>
          {cancelText}
        </ClassCancelButton>

        <ClassSaveButton
          type="primary"
          onClick={onSave}
          loading={loading}
          disabled={disabled}
        >
          {saveText}
        </ClassSaveButton>
      </Space>
    </div>
  );
};