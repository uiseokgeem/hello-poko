// src/pages/Report/ReportCreatePage.js
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Form, message, Typography } from "antd";
import { fetchReportAttendanceData, submitReport, submitDraftReport } from "../../api/reportApi";
import { getNearestSunday } from "../../utils/dateUtils";
import { buildReportPayload, UpdateBuildReportPayload } from "../../utils/reportUtils";
import ReportForm from "../../components/Report/ReportForm/ReportForm";
import AppHeader from "../../components/Header/Header";
import "./ReportCreatePage.css";

const { Title } = Typography;

const ReportCreatePage = () => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [nearestSunday] = useState(getNearestSunday());
  const [isDraft, setIsDraft] = useState(false);
  const navigate = useNavigate();

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

    const payload = UpdateBuildReportPayload(values, formattedTitle, isDraft);
    
    if (isDraft) {
      submitDraftReport(payload, nearestSunday)
      message.success("임시 저장 완료");
      navigate(`/report`);  
      
    } else {
      submitReport(payload, nearestSunday);
      message.success("목양일지 제출 완료");
      navigate(`/report`);  
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
          readOnly={false}
        />
      </div>
    </div>
  );
};

export default ReportCreatePage;
