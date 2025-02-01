import React from "react";
import './TeacherInfo.css';


const TeacherInfo = ({teacherName, className, attendanceRate}) => (
    <div className="teacher-info">
        <p>선생님: <strong>{teacherName}</strong></p>
        <p>반: <strong>{className}</strong></p>
        <p>출석률: <strong>{attendanceRate}</strong>%</p>
    </div>
);

export default TeacherInfo;

