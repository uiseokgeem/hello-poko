import React, { useEffect, useCallback, useState, useMemo }  from "react";
import { Form, message, Typography, Spin, Button, Divider, Card, Space, Popconfirm } from "antd";
import { fetchAdminReportDetail,
         fetchAdminReportFeedback,
         deleteFeedback,
 } from "../../api/reportApi";
import AdminAppHeader from "../../components/Admin/AdminHeader";
import ReportForm from "../../components/Report/ReportForm/ReportForm";
import FeedbackEditor from "../../components/Report/Feedback/FeedbackEditor"; // ← 7번 컴포넌트
import { getNearestSunday } from "../../utils/dateUtils";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminReportDetailPage.css"

const { Title, Text } = Typography;

const AdminReportDetailPage = () => {
    const { id } = useParams(); // report_id
    const [form] = Form.useForm();
    const [nearestSunday] = useState(getNearestSunday());
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const navigate = useNavigate();

    // 단건 피드백 상태
    const [fbLoading, setFbLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);     
    const [editorOpen, setEditorOpen] = useState(false);

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
  
    const loadFeedback = useCallback(async () => {
      try {
        setFbLoading(true);
        const data = await fetchAdminReportFeedback(id);
        setFeedback(data);
      } catch (error) {
        message.error("피드백을 불러오는 데 실패했습니다.");
      } finally {
        setFbLoading(false);
      }
    }, [id]);
    
    useEffect(() => {
      if (id) loadFeedback();
    }, [id, loadFeedback]);

  // 에디터 핸들러
  const openCreate = () => { setEditorOpen(true); };
  const openEdit = () => { setEditorOpen(true); };
  const closeEditor = () => { setEditorOpen(false); };

   // FeedbackEditor 성공 콜백: 단건 갱신
   const handleEditorSuccess = async () => {
    closeEditor();
    await loadFeedback();
  };

  // 삭제(정책상 필요할 때만 노출)
  const handleDelete = async () => {
    if (!feedback?.id) return;
    console.log('reportId=', report?.id, 'feedbackId=', feedback?.id, 'feedback.report_id=', feedback?.report_id);
    try {
      await deleteFeedback({id : feedback.id});
      message.success("삭제되었습니다.");
      setFeedback(null);
    } catch {
      message.error("삭제에 실패했습니다.");
    }
  };


    if (loading) return <Spin />;

    return (
        <div className="report-detail-container">
          <AdminAppHeader />
          <div className="form-wrapper">
            <div className="detail-header">
              <Title>상세보기</Title>

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

           <Divider/>

           <section>
            <Title level={4} style={{marginBottom: 12}}>답변 남기기</Title>

            {editorOpen && (
              <FeedbackEditor
              reportId={id}
              editingId={feedback?.id || null}
              defaultValue={feedback?.body || ""}
              onCancel={closeEditor}
              onSuccess={handleEditorSuccess}
              />
            )}

            {!editorOpen && (
            fbLoading ? <Spin/> :
            feedback ? (
              <Card style={{marginTop: 8}}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <Text>
                  {feedback.author_name} · {feedback.role} · {new Date(feedback.created_at).toLocaleString()}
                  </Text>
                  <Space size="small">
                    <Button type="link" onClick={openEdit}>수정</Button>
                    <Popconfirm title="삭제하시겠습니까?" onConfirm={handleDelete}>
                      <Button type="link" danger>삭제</Button>
                    </Popconfirm>
                  </Space>
                </div>
                <div style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{feedback.body}</div>
              </Card>
            ) : (
              <Button type="primary" onClick={openCreate}>답변하기</Button>
            )
          )}
           </section>
          </div>
        </div>
      );
};

export default AdminReportDetailPage;

