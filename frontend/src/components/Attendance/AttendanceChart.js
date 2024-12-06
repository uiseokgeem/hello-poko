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

const AttendanceChart = ({ data, students }) => {
  // Columns는 데이터가 변경될 때만 새로 계산되도록 useMemo를 사용하여 최적화
  // useMemo()
  const columns = useMemo(() => [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 50,
    }, 
    // date -> dateEntry로 수정, 각 날짜를 column의 제목으로 사용한다.
    ...data.map(dateEntry => ({
      title: dateEntry.date,
      dataIndex: dateEntry.date,
      key: dateEntry.date,
      width: 100,
      render: attendance => (
        <span>
          {attendance ? '✅' : '❌'}
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