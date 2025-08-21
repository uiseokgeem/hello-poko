import { Button, Input, Space, Form, message } from "antd";
import { useState } from "react";
import { createFeedback, updateFeedback } from "../../../api/reportApi";

const { TextArea } = Input;

export default function FeedbackEditor({reportId, defaultValue = "", editingId = null, onCancel, onSuccess}) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
          setLoading(true);
          const content = values.body.trim();
          if (editingId) {
            await updateFeedback({ id: editingId, body: content });
            message.success("수정되었습니다.");
          } else {
            await createFeedback({ report: reportId, body: content });
            message.success("등록되었습니다.");
          }
          form.resetFields();
          onSuccess?.();
        } catch (e) {
          message.error("처리 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };

    return(
        <Form
            form={form}
            initialValues={{body : defaultValue}}
            onFinish={handleSubmit}
            layout="vertical"
        >
            <Form.Item
                name="body"
                rules={[
                    {required: true, message: "내용을 입력하세요."},
                ]}
            >
                <TextArea rows={6} placeholder="목양일지에 대한 피드백을 남겨주세요."/>
            </Form.Item>

            <Space style={{display: "flex", justifyContent : "flex-end"}}>
                <Button onClick={() => {form.resetFields(); onCancel?.(); }}>취소</Button>
                <Button type="primary" htmlType="submit" loading={loading}>{editingId ? "수정" : "등록"}</Button>
            </Space>
            
        </Form>
    );




};


  