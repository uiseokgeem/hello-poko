import React, { useEffect, useState, useMemo } from "react";
import { Form, Typography, Spin, message, Divider} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { fetchReportDetail,
         fetchUserReportFeedback,
 } from "../../api/reportApi";
import AppHeader from "../../components/Header/Header";
import ReportForm from "../../components/Report/ReportForm/ReportForm";
import FeedbackViewer from "../../components/Report/Feedback/FeedbackViewr";
import { getNearestSunday } from "../../utils/dateUtils";
import CustomButton from "../../utils/Button";
import "./ReportDetailPage.css";


const { Title } = Typography;

const ReportDetailPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [report, setReport] = useState(null);
  const [nearestSunday] = useState(getNearestSunday());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 피드백 상태
  const [fbLoading, setFbLoading] = useState(true);
  const [feedback, setFeedback] = useState(null); 

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

   
   useEffect(() => {
    const loadFeedback = async () => {
      try {
        setFbLoading(true);
        const data = await fetchUserReportFeedback(id);
        setFeedback(data); // 없으면 null
      } catch (e) {
        message.error("관리자 피드백을 불러오는 데 실패했습니다.");
      } finally {
        setFbLoading(false);
      }
    };
    if (id) loadFeedback();
  }, [id]);

  if (loading) return <Spin />;

  return (
    <div className="report-detail-container">
    <AppHeader />
    <div className="form-wrapper">
      <div className="detail-header">
        <Title level={2}>상세보기</Title>
        <div className="detail-header-buttons">
        <CustomButton
            type="default"
            label="목록으로 가기"
            variant="list"
            onClick={() => navigate("/report")}
          />

          <CustomButton
            type="primary"
            label="수정하기"
            variant="edit"
            onClick={() => navigate(`/report/edit/${id}`)}
          />
        </div>
      </div>

      <ReportForm
        form={form}
        formattedTitle={formattedTitle}
        readOnly={true}
        initialValues={report}
      />

      {/* 피드백 섹션 */}
      <Divider />
        <section>
          <Title level={4} style={{ marginBottom: 12 }}>
            목양일지 답변
          </Title>
          <FeedbackViewer feedback={feedback} loading={fbLoading} />
        </section>
    </div>
  </div>
  );
};

export default ReportDetailPage;