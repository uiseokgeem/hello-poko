import React, { useMemo } from "react";
import { Table } from "antd";
import "./AdminAttendanceChart.css";

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

const AdminAttendanceChart = ({ data, openModal }) => {
  const errorIconPath = `${process.env.PUBLIC_URL}/images/variant=error@3x.png`;
  const successIconPath = `${process.env.PUBLIC_URL}/images/variant=sucess@3x.png`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  // 학생 리스트 추출
  const students = useMemo(() => {
    const allStudents = new Map();
  
    data.forEach((dateEntry) => {
      dateEntry.attendance.forEach((record) => {
        allStudents.set(record.id, {
          id: record.id,
          name: record.name,
          grade: record.grade,
          gender: record.gender,
        });
      });
    });
  
    // 학년을 기준으로 정렬
    return Array.from(allStudents.values()).sort((a, b) => {
      const gradeOrder = ["중1", "중2", "중3", "고1", "고2", "고3"]; // 학년 정렬 우선순위
      return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
    });
  }, [data]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: "학년",
        dataIndex: "grade",
        key: "grade",
        fixed: "left",
        width: 60,
      },
      {
        title: "성별",
        dataIndex: "gender",
        key: "gender",
        fixed: "left",
        width: 60,
      },
      {
        title: "이름",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        width: 80,
      },
    ];

    const dateColumns = sortedData.map((dateEntry) => ({
      title: (
        <a
          onClick={() => openModal(dateEntry.date, "edit")}
          style={{ cursor: "default", color: "#333333" }}
        >
          {formatDate(dateEntry.date)}
        </a>
      ),
      dataIndex: dateEntry.date,
      key: dateEntry.date,
      width: 140,
      render: (attendance) => (
        <span>
          {attendance ? (
            <img
              src={successIconPath}
              alt="Success"
              style={{ width: "20px", height: "20px" }}
            />
          ) : (
            <img
              src={errorIconPath}
              alt="Error"
              style={{ width: "20px", height: "20px" }}
            />
          )}
        </span>
      ),
    }));

    return [...baseColumns, ...dateColumns];
  }, [sortedData, openModal]);

  const dataSource = useMemo(() => {
    return students.map((student) => {
      const studentAttendance = mapAttendanceForStudent(student, sortedData);
      return {
        key: student.id,
        name: student.name,
        grade: student.grade,
        gender: student.gender,
        ...studentAttendance,
      };
    });
  }, [students, sortedData]);

  return (
    <Table
      className="admin-attendance-chart"
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      scroll={{ x: "max-content" }}
      sticky
    />
  );
};

export default AdminAttendanceChart;