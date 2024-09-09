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
    }, 
    ...data.map(dateEntry => ({
      title: dateEntry.date,  // date -> dateEntry로 수정
      dataIndex: dateEntry.date,
      key: dateEntry.date,
      render: attendance => (
        <span>
          {attendance ? '✅' : '❌'}
        </span>
      ),
    })),
    {
      title: '정보',
      key: 'info',
      render: (text, record) => <a href="#">보기</a>,
    }
  ], [data]);

  // 데이터를 학생 별로 처리
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

  return <Table columns={columns} dataSource={dataSource} pagination={false} />;
};

export default AttendanceChart;