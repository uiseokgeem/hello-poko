import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Checkbox, Tabs } from 'antd';
import { saveDraft, submitCheck } from '../../../api/reportApi';
import './MemberCheck.css';

const { TabPane } = Tabs;

const testStudents = [
  { id: '1', name: '김사랑' },
  { id: '2', name: '김선우' },
  { id: '3', name: '김예나' },
  { id: '4', name: '오예린' },
  { id: '5', name: '오은빈' },
  { id: '6', name: '이예담' },
  { id: '7', name: '이하진' },
  { id: '8', name: '이조훈' },
  { id: '9', name: '홍수민' },
];

const MemberCheck = () => {
  const [form] = Form.useForm();
  const [selectedStudent, setSelectedStudent] = useState(testStudents[0].id);

  useEffect(() => {
    form.resetFields();
  }, [selectedStudent, form]);

  const handleSaveDraft = async (values) => {
    try {
      const response = await saveDraft({ ...values, status: 0, studentId: selectedStudent });
      console.log('임시 저장 성공:', response);
    } catch (error) {
      console.error('임시 저장 실패:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await submitCheck({ ...values, status: 1, studentId: selectedStudent });
      console.log('제출 성공:', response);
    } catch (error) {
      console.error('제출 실패:', error);
    }
  };

  return (
    <div className="member-check-section">
      <h2 className="section-title">학생 양육일지</h2>
      <Tabs activeKey={selectedStudent} onChange={setSelectedStudent}>
        {testStudents.map(student => (
          <TabPane tab={student.name} key={student.id}>
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
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default MemberCheck;


// 학생 목록 데이터  동적으로 가져오기
// useEffect(() => {
  //   const loadStudents = async () => {
  //     try {
  //       const response = await fetchStudents();
  //       setStudents(response.data);
  //       if (response.data.length > 0) {
  //         setSelectedStudent(response.data[0].id);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch students:', error);
  //     }
  //   };

  //   loadStudents();
  // }, []);