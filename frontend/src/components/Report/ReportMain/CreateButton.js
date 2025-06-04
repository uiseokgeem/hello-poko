// components/Report/Buttons/CreateButton.js

import React from "react";
import { Button } from "antd";

const CreateButton = ({ onClick }) => {
  return (
    <Button type="primary" onClick={onClick}>
      + 새 목양일지
    </Button>
  );
};

export default CreateButton;