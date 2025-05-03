import React, { useState, useEffect } from "react";
import { Form, Input, Select, Radio, Button, Typography, message } from "antd";
import {fetchReportAttendanceData} from "../../api/reportApi";
import { getNearestSunday } from "../../utils/dateUtils";
import StudentReportCard from "../../components/Report/ReportCreate/StudentReportCard";
import AppHeader from "../../components/Header/Header";
import "./ReportCreatePage.css";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ReportCreatePage = () => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [nearestSunday] = useState(getNearestSunday());

  // 초기 Form 데이터 세팅 useEffect
  useEffect(() => {
    const fetchInitialReportData = async () => {
      try {
        const data = await fetchReportAttendanceData(nearestSunday);
        setStudents(data.students)
      } catch (error) {
        message.error("학생 데이터를 불러오는 데 실패했습니다.")
      }
    };
    
    fetchInitialReportData();
  }, [nearestSunday]);

  const handleSubmit = (values) => {
    console.log("제출된 데이터:", values);
  };

  return (
    <div className="report-create-container">
      <AppHeader />
      <div className="form-wrapper">
        <Title level={2}>새 목양일지 작성</Title>

        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="목양일지 제목"
            name="title"
            rules={[{ required: true, message: "제목을 입력해주세요." }]}
          >
            <Input placeholder="예: 4월 19일 목양일지" />
          </Form.Item>

          {/* 하나님 앞에서 */}
          <Title level={4}>하나님 앞에서</Title>

          <Form.Item label="기도 횟수" name="prayCount" rules={[{ required: true }]}> 
            <Select>
              {[...Array(8)].map((_, i) => (
                <Option key={i} value={i}>{i}회</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="QT 횟수" name="qtCount" rules={[{ required: true }]}> 
            <Select>
              {[...Array(8)].map((_, i) => (
                <Option key={i} value={i}>{i}회</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="교사모임 참석" name="teacherMeeting" rules={[{ required: true }]}> 
            <Radio.Group>
              <Radio value={true}>참석</Radio>
              <Radio value={false}>불참</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="주일예배 참석" name="worship" rules={[{ required: true }]}> 
            <Radio.Group>
              <Radio value="1부 예배">1부 예배</Radio>
              <Radio value="2부 예배">2부 예배</Radio>
              <Radio value="3부 예배">3부 예배</Radio>
              <Radio value="불참">불참</Radio>
            </Radio.Group>
          </Form.Item>
          
          {/* 기도 */}
          <Title level={4}>기도제목</Title>

          <Form.Item name="prayYouth" label="사귐의교회(청소년부)">
            <TextArea rows={3} placeholder="청소년부를 위한 기도제목을 작성하세요." />
          </Form.Item>
          <Form.Item name="prayNew" label="GQS/새친구반">
            <TextArea rows={3} placeholder="GQS/새친구반을 위한 기도제목을 작성하세요." />
          </Form.Item>
          <Form.Item name="prayPersonal" label="선생님 본인">
            <TextArea rows={3} placeholder="본인의 영적 필요를 위한 기도제목을 작성하세요." />
          </Form.Item>

          {/* 목양일지 */}
          {students.map((student) => (
            <StudentReportCard key={student.id} student={student} />
          ))}

          {/* submit */}
          <Form.Item style={{ textAlign: "right" }}>
            <Button style={{ marginRight: "10px" }}>임시저장</Button>
            <Button type="primary" htmlType="submit">제출하기</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ReportCreatePage;