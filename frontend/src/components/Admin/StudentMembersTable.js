import React from "react";
import { Table } from "antd";
import { render } from "@testing-library/react";

const StudentMembersTable = () => {

    const columns = [
        {
            title: "학생명",
            dataIndex: "studentName",
            key: "studentName"
        },
        {
            title: "생년월일",
            dataIndex: "birthDate",
            key: "birthDate"
        },
        {
            title: "담당반",
            dataIndex: "grade",
            key: "grade"
        },
        {
            title: "담당 선생님",
            dataIndex: "teacherName",
            key: "teacherName"
        },
        {
            title: "보조 선생님",
            dataIndex: "assistantName",
            key: "assistantName"
        },
        {
            title: "보기",
            dataIndex: "actions",
            key: "actions",
            render: () => <span style={{color: "#1890ff"}}>수정</span>
        },
    ];

    const dataSource = [];

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

