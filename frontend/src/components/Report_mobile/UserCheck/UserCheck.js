import React from 'react';
import { Form, Select, Input, Radio, Button } from 'antd';
import './UserCheck.css';

const { Option } = Select;

const UserCheck = () => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log('Form Values:', values);
  };

  return (
    <div className="user-check-section">
      <h2 className="section-title">하나님 앞에서</h2>
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item label="지난 주에는 얼마나 기도했나요?" name="worship">
          <Select defaultValue="1회" className="form-item-input">
            {['0회', '1회', '2회', '3회', '4회', '5회', '6회', '7회'].map(value => (
              <Option key={value} value={value}>{value}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="지난 주에는 얼마나 QT 했나요?" name="qt">
          <Select defaultValue="1회" className="form-item-input">
            {['0회', '1회', '2회', '3회', '4회', '5회', '6회', '7회'].map(value => (
              <Option key={value} value={value}>{value}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="주일예배는 얼마나 참석했나요?" name="worship_attendance">
          <Radio.Group>
            <Radio value="1부 예배">1부 예배</Radio>
            <Radio value="2부 예배">2부 예배</Radio>
            <Radio value="3부 예배">3부 예배</Radio>
            <Radio value="불참">불참</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="교사와 함께한 기도 내용" name="pray_teacher">
          <Input.TextArea className="form-item-input" />
        </Form.Item>
        <Form.Item className="button-group">
          <Button type="primary" htmlType="submit">제출</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserCheck;