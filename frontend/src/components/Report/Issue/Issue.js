import React from 'react';
import { Form, Input, Button } from 'antd';
import './Issue.css';
import { saveDraft, submitCheck } from '../../../api/reportApi';

const Issue = () => {
    const [form] = Form.useForm();
  
    const handleSaveDraft = async (values) => {
      try {
        const response = await saveDraft({ ...values, status: 0 });
        console.log('임시 저장 성공:', response);
      } catch (error) {
        console.error('임시 저장 실패:', error);
      }
    };
  
    const handleSubmit = async (values) => {
      try {
        const response = await submitCheck({ ...values, status: 1 });
        console.log('제출 성공:', response);
      } catch (error) {
        console.error('제출 실패:', error);
      }
    };

    return(
        <div className="issue-section">
            <h2 className="section-title">추가로 문의 내용이 있나요?</h2>
            <Form
             form={form}
             onFinish={handleSubmit}
             layout='vertical'
            >
                <Form.Item className="form-item" label="개인 공유사항" name="issue_user">
                    <Input.TextArea
                    className="text-input form-item-input"
                    placeholder="질문, 요청 및 건의사항, 근황(이사, 전학, 유학 등)등을 작성하세요."
                    rows={4} // 높이를 설정하는 속성 추가
                    />
                </Form.Item>
                <Form.Item className="form-item" label="부서 문의사항" name="issue_Dept">
                    <Input.TextArea
                    className="text-input form-item-input"
                    placeholder="부서 사역, 학생 양육에 대한 피드백 등을 작성하세요."
                    rows={4} // 높이를 설정하는 속성 추가
                    />
                </Form.Item>
                <Form.Item className="button-group">
                    <Button className="draft-button" onClick={() => form.validateFields().then(handleSaveDraft)}>임시 저장</Button>
                    <Button type="primary" htmlType="submit">제출</Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default Issue;