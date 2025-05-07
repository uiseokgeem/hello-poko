// src/pages/Report/ReportCreatePage.js
import React, { useState, useEffect, useMemo } from "react";
import { Form, message, Typography } from "antd";
import { fetchReportAttendanceData, submitReport } from "../../api/reportApi";
import { getNearestSunday } from "../../utils/dateUtils";
import { buildReportPayload } from "../../utils/reportUtils";
import ReportForm from "../../components/Report/ReportForm/ReportForm";
import AppHeader from "../../components/Header/Header";
import "./ReportCreatePage.css";

const { Title } = Typography;

const ReportCreatePage = () => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [nearestSunday] = useState(getNearestSunday());
  const [isDraft, setIsDraft] = useState(false);

  const formattedTitle = useMemo(() => {
    const date = new Date(nearestSunday);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 목양일지`;
  }, [nearestSunday]);

  useEffect(() => {
    const fetchInitialReportData = async () => {
      try {
        const data = await fetchReportAttendanceData(nearestSunday);
        setStudents(data.students);
      } catch (error) {
        message.error("학생 데이터를 불러오는 데 실패했습니다.");
      }
    };
    fetchInitialReportData();
  }, [nearestSunday]);

  const handleFinish = (values) => {
    console.log("values.students", values); // ⬅️ 여기

    const payload = buildReportPayload(values, formattedTitle, isDraft);
    console.log("values.students", payload); // ⬅️ 여기
    if (isDraft) {
      console.log("임시 저장 데이터:", payload);
      message.success("임시 저장 완료");
    } else {
      submitReport(payload, nearestSunday);
      message.success("제출 완료");
    }
  };

  return (
    <div className="report-create-container">
      <AppHeader />
      <div className="form-wrapper">
        <Title level={2}>새 목양일지 작성</Title>
        <ReportForm
          form={form}
          students={students}
          onFinish={handleFinish}
          isDraft={isDraft}
          setIsDraft={setIsDraft}
          nearestSunday={nearestSunday}
          formattedTitle={formattedTitle}
        />
      </div>
    </div>
  );
};

export default ReportCreatePage;
