import React from "react";
import { Table } from "antd";
import { render } from "@testing-library/react";

const StudentMembersTable = () => {

    const columns = [
        {
            title: "학생명",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "생년월일",
            dataIndex: "birth_date",         // Member.birth_date (추가 예정)
            key: "birth_date",
        },
        {
            title: "담당반",
            dataIndex: "grade",              // Member.grade
            key: "grade",
        },
        {
            title: "담당 선생님",
            dataIndex: "teacher",            // Member.teacher
            key: "teacher",
            render: (text) => text || "미등록",
            
        },
        {
            title: "보조 선생님",
            dataIndex: "assistant_teacher", // serializer에서 문자열로 내려줌(연산추가)
            key: "assistant_teacher",
            render: (text) => text || "미등록",
            
        },
        {
            title: "보기",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <span
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={() => console.log("Edit:", record)}
                >
                  수정
                </span>
          
                <span
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => console.log("Delete:", record)}
                >
                  삭제
                </span>
              </div>
            ),
          }
    ];

    const dataSource = [
  {
    id: 1,
    name: "김학생",
    birth_date: "2011-03-01",
    grade: "초5",
    teacher: "김정교사",              // Member.teacher.full_name
    assistant_teacher: "이부교사",   // teacher에 매칭된 보조교사 이름
  },
  {
    id: 2,
    name: "박학생",
    birth_date: "2011-05-14",
    grade: "초5",
    teacher: "김정교사",
    assistant_teacher: "이부교사",
  },
  {
    id: 3,
    name: "최학생",
    birth_date: "2010-11-20",
    grade: "초6",
    teacher: "박정교사",
    assistant_teacher: "정부교사",
  },
  {
    id: 4,
    name: "이학생",
    birth_date: "2010-09-02",
    grade: "초6",
    teacher: "박정교사",
    assistant_teacher: "정부교사",
  },
];
    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={dataSource}
            pagination={false}
        />
    )
};

export default StudentMembersTable

