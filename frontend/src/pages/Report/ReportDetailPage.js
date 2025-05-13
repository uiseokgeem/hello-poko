import React, { useEffect, useState, useMemo } from "react";
import { Form, Typography, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import { fetchReportDetail } from "../../api/reportApi";
import AppHeader from "../../components/Header/Header";
import ReportForm from "../../components/Report/ReportForm/ReportForm";
import { getNearestSunday } from "../../utils/dateUtils";
import "./ReportDetailPage.css";


const { Title } = Typography;

const ReportDetailPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [report, setReport] = useState(null);
  const [nearestSunday] = useState(getNearestSunday());
  const [loading, setLoading] = useState(true);

  const formattedTitle = useMemo(() => {
    const date = new Date(nearestSunday);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 목양일지`;
  }, [nearestSunday]);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchReportDetail(id, nearestSunday);
        setReport(data);
      } catch (error) {
        message.error("목양일지 상세 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [id, nearestSunday]);

  if (loading) return <Spin />;

  return (
    <div className="report-detail-container">
      <AppHeader />
      <div className="form-wrapper">
        <Title level={2}>목양일지 상세</Title>
        <ReportForm
          form={form}
          formattedTitle={formattedTitle}
          readOnly={true}
          initialValues={report}
        />
      </div>
    </div>
  );
};

export default ReportDetailPage;