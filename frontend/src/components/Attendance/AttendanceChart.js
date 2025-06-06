import React, { useMemo } from "react";
import { Table } from "antd";
import "./AttendanceChart.css";

const mapAttendanceForStudent = (student, data) => {
  const attendance = {};
  data.forEach((dateEntry) => {
    const attendanceRecord = dateEntry.attendance.find(
      (item) => item.id === student.id
    );
    attendance[dateEntry.date] = attendanceRecord
      ? attendanceRecord.attendance
      : null;
  });
  return attendance;
};

const AttendanceChart = ({ data, students, openModal }) => {
  const errorIconPath = `${process.env.PUBLIC_URL}/images/variant=error@3x.png`;
  const successIconPath = `${process.env.PUBLIC_URL}/images/variant=sucess@3x.png`;
  const warningIconPath = `${process.env.PUBLIC_URL}/images/variant=warning@3x.png`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  const columns = useMemo(() => {
    return [
      {
        title: "이름",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        width: 100,
      },
      ...sortedData.map((dateEntry) => ({
        title: (
          <button
            onClick={() => openModal(dateEntry.date, "edit")}
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              color: "#1890ff",
              padding: 0,
              font: "inherit",
            }}
          >
            {formatDate(dateEntry.date)}
          </button>
        ),
        dataIndex: dateEntry.date,
        key: dateEntry.date,
        width: 120,
        render: (attendance) => (
          <span>
            {attendance === true ? (
              <img
                src={successIconPath}
                alt="Success"
                style={{ width: "20px", height: "20px" }}
              />
            ) : attendance === false ? (
              <img
                src={errorIconPath}
                alt="Error"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              <img
                src={warningIconPath}
                alt="Warning"
                style={{ width: "20px", height: "20px" }}
              />
            )}
          </span>
        ),
      })),
    ];
  }, [sortedData, openModal, errorIconPath, successIconPath, warningIconPath]);

  const dataSource = useMemo(() => {
    return students.map((student) => {
      const studentAttendance = mapAttendanceForStudent(student, sortedData);
      return {
        key: student.id,
        name: student.name,
        ...studentAttendance,
      };
    });
  }, [sortedData, students]);

  return (
    <Table
      className="attendance-chart"
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      scroll={{ x: "max-content" }}
      sticky
      bordered={false}
    />
  );
};

export default AttendanceChart;

  