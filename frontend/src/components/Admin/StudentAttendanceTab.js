import React from "react";
import { Button, Spin } from "antd";
import AdminAttendanceChart from "./AdminAttendanceChart";

const StudentAttendanceTab = ({ memberAttendanceData, students, loading, openStudentModal }) => {
  return (
    <>
      <div className="filters">
        <div></div>
        <Button type="default" onClick={openStudentModal}>+ 새친구 등록</Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ textAlign: "center", padding: "50px" }} />
      ) : (
        <AdminAttendanceChart data={memberAttendanceData} students={students} />
      )}
    </>
  );
};

export default StudentAttendanceTab;