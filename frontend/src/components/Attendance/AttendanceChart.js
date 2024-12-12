import React, { useMemo } from "react";
import { Table } from 'antd';

const mapAttendanceForStudent = (student, data) => {
  const attendance = {};

  data.forEach(dateEntry => {
    // 학생의 출석 데이터를 찾음
    const attendanceRecord = dateEntry.attendance.find(
      item => item.id === student.id
    );
    attendance[dateEntry.date] = attendanceRecord
      ? attendanceRecord.attendance
      : null; // 출석 여부가 없으면 null로 설정
  });

  return attendance;
};

const AttendanceChart = ({ data, students, openModal }) => {
  const errorIconPath = `${process.env.PUBLIC_URL}/images/variant=error@3x.png`;
  const successIconPath = `${process.env.PUBLIC_URL}/images/variant=sucess@3x.png`;

  const formatDate = (dateString) => {
    const date = new Date(dateString); 
    const month = date.getMonth() + 1; 
    const day = date.getDate(); 
    return `${month}월 ${day}일`;
  };

  const columns = useMemo(() => [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 50,
    }, 

    ...data.map(dateEntry => ({
      title: (
        <a
          onClick={() => openModal(dateEntry.date, "edit")}
          style={{ cursor: "pointer", color: "#1890ff" }}
        >
          {formatDate(dateEntry.date)}
        </a>
      ),
      dataIndex: dateEntry.date,
      key: dateEntry.date,
      width: 100,
      render: attendance => (
        <span>
        {attendance ? (
          <img src={successIconPath} alt="Success" style={{ width: '20px', height: '20px' }} />
        ) : (
          <img src={errorIconPath} alt="Error" style={{ width: '20px', height: '20px' }} />
        )}
      </span>
      ),
    })),
    {
      title: '정보',
      key: 'info',
      fixed: 'right',
      width: 40,
      render: (text, record) => <a href="#">보기</a>,
      
    }
  ], [data]);

  const dataSource = useMemo(() => {
    return students.map(student => {
      const studentAttendance = mapAttendanceForStudent(student, data);
      return {
        key: student.id, // 테이블에서 고유 식별자로 사용
        name: student.name,
        ...studentAttendance, // 날짜별 출석 데이터를 추가
      };
    });
  }, [data, students]);

  return <Table
   columns={columns} 
   dataSource={dataSource} 
   pagination={false} 
   scroll={{ x: 1500 }} // 가로 스크롤 강제 설정 (1500px 넓이 이상일 때 스크롤 생성)
   sticky
   bordered
   />;
};

export default AttendanceChart;

  // 학생별 출석 데이터를 매핑하여 테이블에 표할 데이터 구조로 변환
  // const dataSource = useMemo(() => {
  //   return students.map(student => {
  //     const studentAttendance = data.reduce((acc, dateEntry) => {
  //       const attendanceRecord = dateEntry.attendance.find(
  //         item => item.id === student.id
  //       );
  //       acc[dateEntry.date] = attendanceRecord ? attendanceRecord.attendance : null;
  //       return acc;
  //     }, {});
  //     return {
  //       key: student.id,
  //       name: student.name,
  //       ...studentAttendance,
  //     };
  //   });
  // }, [data, students]);