import React from 'react';
import { Form, Input, Button, Radio, Checkbox } from 'antd';
import { saveDraft, submitCheck } from '../../../api/reportApi';
import './MemberCheck.css';

const MemberCheck = () => {
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

  return (
    <div className="member-check-section">
      <h2 className="section-title">학생 양육일지</h2>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item label="주일예배는 얼마나 참석했나요?" name="worship_attendance">
          <Radio.Group>
            <Radio value="1부 예배">1부 예배</Radio>
            <Radio value="2부 예배">2부 예배</Radio>
            <Radio value="3부 예배">3부 예배</Radio>
            <Radio value="불참">불참</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="GQS 참석 여부" name="gqs" valuePropName="checked">
          <Checkbox>GQS 참석 여부</Checkbox>
        </Form.Item>
        <Form.Item label="양육 내용" name="training_content">
          <Input.TextArea className="form-item-input" />
        </Form.Item>
        <Form.Item label="기도 내용" name="pray_member">
          <Input.TextArea className="form-item-input" />
        </Form.Item>
        <Form.Item label="기타 내용" name="additional_issues">
          <Input.TextArea className="form-item-input" />
        </Form.Item>
        <Form.Item className="button-group">
          <Button onClick={() => form.submit(handleSaveDraft)}>임시 저장</Button>
          <Button type="primary" htmlType="submit">제출</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MemberCheck;