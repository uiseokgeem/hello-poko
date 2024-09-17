import React, { useMemo } from "react";
import { Table } from 'antd';

const AttendanceChart = ({ data, students }) => {
  // Columns는 데이터가 변경될 때만 새로 계산되도록 useMemo를 사용하여 최적화
  // useMemo()
  const columns = useMemo(() => [
    {
      title: '학생명',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 50,
    }, 
    ...data.map(dateEntry => ({
      title: dateEntry.date,  // date -> dateEntry로 수정, 각 날짜를 column의 제목으로 사용한다.
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
  const dataSource = useMemo(() => {
    return students.map(student => {
      const studentAttendance = data.reduce((acc, dateEntry) => {
        acc[dateEntry.date] = dateEntry.attendance[student.id];  // date -> dateEntry로 수정
        return acc;
      }, {});
      return {
        key: student.id,
        name: student.name,
        ...studentAttendance,
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