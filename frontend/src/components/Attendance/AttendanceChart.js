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

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  const columns = useMemo(() => [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 100,
    }, 

    ...sortedData.map(dateEntry => ({
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
      width: 120,
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
      width: 100,
      render: (text, record) => <a href="#">보기</a>,
      
    }
  ], [sortedData]);

  const dataSource = useMemo(() => {
    return students.map(student => {
      const studentAttendance = mapAttendanceForStudent(student, sortedData);
      return {
        key: student.id, // 테이블에서 고유 식별자로 사용
        name: student.name,
        ...studentAttendance, // 날짜별 출석 데이터를 추가
      };
    });
  }, [sortedData, students]);

  return <Table
   columns={columns} 
   dataSource={dataSource} 
   pagination={false} 
   scroll={{ x: 'max-content' }} // 컬럼 내용에 따라 스크롤 크기 조정
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

  // import React, { useMemo } from "react";
  // import { Table } from 'antd';
  
  // const mapAttendanceForStudent = (student, data) => {
  //   const attendance = {};
  
  //   data.forEach(dateEntry => {
  //     const attendanceRecord = dateEntry.attendance.find(
  //       item => item.id === student.id
  //     );
  //     attendance[dateEntry.date] = attendanceRecord
  //       ? attendanceRecord.attendance
  //       : null;
  //   });
  
  //   return attendance;
  // };
  
  // const AttendanceChart = ({ data, students, openModal }) => {
  //   const errorIconPath = `${process.env.PUBLIC_URL}/images/variant=error@3x.png`;
  //   const successIconPath = `${process.env.PUBLIC_URL}/images/variant=sucess@3x.png`;
  
  //   const formatDate = (dateString) => {
  //     const date = new Date(dateString); 
  //     const month = date.getMonth() + 1; 
  //     const day = date.getDate(); 
  //     return `${month}월 ${day}일`;
  //   };
  
  //   const columns = useMemo(() => {
  //     // 전체 너비를 기준으로 각 날짜 컬럼의 비율 계산
  //     const dateColumns = data.map(dateEntry => ({
  //       title: (
  //         <a
  //           onClick={() => openModal(dateEntry.date, "edit")}
  //           style={{ cursor: "pointer", color: "#1890ff" }}
  //         >
  //           {formatDate(dateEntry.date)}
  //         </a>
  //       ),
  //       dataIndex: dateEntry.date,
  //       key: dateEntry.date,
  //       width: `${Math.floor(100 / (data.length + 2))}%`, // 날짜 컬럼 비율
  //       render: attendance => (
  //         <span>
  //           {attendance ? (
  //             <img src={successIconPath} alt="Success" style={{ width: '20px', height: '20px' }} />
  //           ) : (
  //             <img src={errorIconPath} alt="Error" style={{ width: '20px', height: '20px' }} />
  //           )}
  //         </span>
  //       ),
  //     }));
  
  //     // 고정 컬럼 포함
  //     return [
  //       {
  //         title: '이름',
  //         dataIndex: 'name',
  //         key: 'name',
  //         fixed: 'left',
  //         width: `${Math.floor(100 / (data.length + 2))}%`,
  //       },
  //       ...dateColumns,
  //       {
  //         title: '정보',
  //         key: 'info',
  //         fixed: 'right',
  //         width: `${Math.floor(100 / (data.length + 2))}%`,
  //         render: (text, record) => <a href="#">보기</a>,
  //       },
  //     ];
  //   }, [data]);
  
  //   const dataSource = useMemo(() => {
  //     return students.map(student => {
  //       const studentAttendance = mapAttendanceForStudent(student, data);
  //       return {
  //         key: student.id,
  //         name: student.name,
  //         ...studentAttendance,
  //       };
  //     });
  //   }, [data, students]);
  
  //   return (
  //     <Table
  //       columns={columns}
  //       dataSource={dataSource}
  //       pagination={false}
  //       scroll={{ x: true }}
  //       sticky
  //       bordered
  //     />
  //   );
  // };
  
  // export default AttendanceChart;