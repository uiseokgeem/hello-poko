import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "../../components/Header/Header";
import { getNearestSunday } from "../../utils/dateUtils";
import { fetchReportDetail, submitReport, submitDraftReport, submitUpdateReport } from "../../api/reportApi";
import ReportForm from "../../components/Report/ReportForm/ReportForm"
import { buildReportPayload, UpdateBuildReportPayload } from "../../utils/reportUtils";
import "./ReportEditPage.css"
import { Form, Typography, Spin, message, Button } from "antd";


const {Title} = Typography;

const ReportEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [report, setReport] = useState(null);
    const [nearestSunday] = useState(getNearestSunday());
    const [isDraft, setIsDraft] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(true);

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

      const handleUpdate = async (values) => {
        const payload = UpdateBuildReportPayload(values, formattedTitle, isDraft);
        try {
          await submitUpdateReport(id, payload, nearestSunday);
          message.success("목양일지가 수정되었습니다.");
          navigate(`/report/detail/${id}`); 
        } catch (error) {
          message.error("수정 중 오류가 발생했습니다.");
        }
      };

    return (
        <div className="report-edit-container">
            <AppHeader></AppHeader>
            <div className="form-wrapper">
                <Title level={2}>목양일지 수정하기</Title>
                <ReportForm
                    form={form}
                    formattedTitle={formattedTitle}
                    readOnly={false}
                    initialValues={report}
                    students={report.students}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    isDraft={isDraft}
                    setIsDraft={setIsDraft}
                    onFinish={handleUpdate}
                ></ReportForm>
                
            </div>
        </div>
    );
};
export default ReportEditPage;