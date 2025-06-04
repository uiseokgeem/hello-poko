import React, { useEffect, useState, useMemo }  from "react";
import { Form, message, Typography, Spin, Button } from "antd";
import { fetchAdminReportDetail } from "../../api/reportApi";
import AdminAppHeader from "../../components/Admin/AdminHeader";
import ReportForm from "../../components/Report/ReportForm/ReportForm";
import { getNearestSunday } from "../../utils/dateUtils";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminReportDetailPage.css"

const { Title } = Typography;

const AdminReportDetailPage = () => {
    const {id} =useParams();
    const [form] = Form.useForm();
    const [nearestSunday] = useState(getNearestSunday());
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const navigate = useNavigate();

    const formattedTitle = useMemo(() => {
        const date = new Date(nearestSunday);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 목양일지`;
      }, [nearestSunday]);

    useEffect(() => {
        const loadReport = async () => {
            try {
                const data = await fetchAdminReportDetail(id, nearestSunday);
                setReport(data);
            } catch (error) {
                message.error("목양일지를 불러오는 데 실패했습니다.")
            } finally {
                setLoading(false);
            }
        };
        loadReport();
    },[id, nearestSunday]);

    if (loading) return <Spin />;

    return (
        <div className="report-detail-container">
          <AdminAppHeader />
          <div className="form-wrapper">
            <div className="detail-header">
              <Title>목양일지 상세보기</Title>

              <div className="detail-header-buttons">
              <Button
                className="custom-secondary-button"
                onClick={() => navigate("/admin/report")}
            >
                목록으로 가기
            </Button>
              </div>
            </div>
      
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

export default AdminReportDetailPage;

