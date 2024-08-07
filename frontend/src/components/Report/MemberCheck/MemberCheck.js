import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Tabs } from 'antd';
import { saveDraft, submitCheck } from '../../../api/reportApi';
import './MemberCheck.css';

// const { TabPane } = Tabs;

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
  const [selectedStudent, setSelectedStudent] = useState(testStudents[0].id);
  const [studentData, setStudentData] = useState({});

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

  const handleValuesChange = (changedValues, allValues) => {
    setStudentData({
      ...studentData,
      [selectedStudent]: allValues,
    });
  };

  const items = testStudents.map(student => ({
    key: student.id,
    label: student.name,
    children: (
      <StudentForm
        key={student.id}
        studentId={student.id}
        initialValues={studentData[student.id] || {}}
        handleSaveDraft={handleSaveDraft}
        handleSubmit={handleSubmit}
        handleValuesChange={handleValuesChange}
      />
    ),
  }));

  return (
    <div className="member-check-section">
      <h2 className="section-title">학생 양육일지</h2>
      <Tabs activeKey={selectedStudent} onChange={setSelectedStudent} items={items} />
    </div>
  );
};

const StudentForm = ({ studentId, initialValues, handleSaveDraft, handleSubmit, handleValuesChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      onValuesChange={handleValuesChange}
      initialValues={initialValues}
    >
      <Form.Item label={<strong>주일예배를 참석했나요?(참조 값)</strong>} name="attendance"> 
        <Radio.Group>
          <Radio value="1">출석</Radio>
          <Radio value="0">결석</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label={<strong>GQS에 참석했나요?</strong>}  name="gqs" >
        <Radio.Group>
          <Radio value="출석">출석</Radio>
          <Radio value="불참 ">결석</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label={<strong>양육 내용</strong>} name="training_content">
        <Input.TextArea 
        className="form-item-input" 
        rows={3}
        placeholder='한 주간 양육 내용을 작성해주세요.'
        />
      </Form.Item>
      <Form.Item label={<strong>기도 내용</strong>} name="pray_member">
        <Input.TextArea 
        className="form-item-input" 
        rows={3}
        placeholder='해당 학생의 기도제목을 작성하세요.'
        />
      </Form.Item>
      <Form.Item className="button-group">
        <Button onClick={() => handleSaveDraft(form.getFieldsValue())}>임시 저장</Button>
        <Button type="primary" htmlType="submit">제출</Button>
      </Form.Item>
    </Form>
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