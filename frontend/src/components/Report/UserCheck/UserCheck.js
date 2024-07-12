import React from 'react';
import { Form, Select, Input, Radio, Button } from 'antd';
import './UserCheck.css';
import { saveDraft, submitCheck } from '../../../api/reportApi';

const { Option } = Select;

const UserCheck = () => {
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
    <div className="user-check-section">
      <h2 className="section-title">하나님 앞에서</h2>
      <Form 
        form={form} 
        onFinish={handleSubmit} 
        initialValues={{
          pray: '1회',
          qt: '1회',
          worship: '1부 예배',
          meeting: '참석',
        }} 
        layout="vertical"
      >
        <div className="horizontal-group">
          <Form.Item className="form-item-horizontal" label={<strong>지난 주에는 얼마나 기도했나요?</strong>} name="pray">
            <Select 
              className="select-input" 
              getPopupContainer={trigger => trigger.parentNode}
              dropdownStyle={{ width: '200px', maxHeight: '256px', overflowY: 'auto' }}
            >
              {['0회', '1회', '2회', '3회', '4회', '5회', '6회', '7회'].map(value => (
                <Option key={value} value={value}>{value}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="form-item-horizontal" label={<strong>지난 주에는 얼마나 QT를 했나요?</strong>} name="qt">
            <Select 
              className="select-input" 
              getPopupContainer={trigger => trigger.parentNode}
              dropdownStyle={{ width: '200px', maxHeight: '256px', overflowY: 'auto' }}
            >
              {['0회', '1회', '2회', '3회', '4회', '5회', '6회', '7회'].map(value => (
                <Option key={value} value={value}>{value}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="horizontal-group">
          <Form.Item className="form-item-horizontal" label={<strong>주일예배를 참석했나요?</strong>} name="worship">
            <Radio.Group>
              <Radio value="1부 예배">1부 예배</Radio>
              <Radio value="2부 예배">2부 예배</Radio>
              <Radio value="3부 예배">3부 예배</Radio>
              <Radio value="불참">불참</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item className="form-item-horizontal" label={<strong>교사모임에 참석했나요?</strong>} name="meeting">
            <Radio.Group>
              <Radio value="참석">참석</Radio>
              <Radio value="불참">불참</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <h3 className="subsection-title">이번 주 기도제목을 알려주세요</h3>
        <Form.Item label="사귐의교회 청소년부" name="pray_youth">
          <Input.TextArea className="text-input form-item-input" />
        </Form.Item>
        <Form.Item label="GQS/새소식반" name="pray_group">
          <Input.TextArea className="text-input form-item-input" />
        </Form.Item>
        <Form.Item label="교사 본인" name="pray_user">
          <Input.TextArea className="text-input form-item-input" />
        </Form.Item>
        <Form.Item className="button-group">
          <Button className="draft-button" onClick={() => form.validateFields().then(handleSaveDraft)}>임시 저장</Button>
          <Button type="primary" htmlType="submit">제출</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserCheck;