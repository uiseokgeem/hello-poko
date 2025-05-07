// components/Report/ReportForm.js
import React, { useMemo } from "react";
import { Form, Input, Select, Radio, Button, Typography } from "antd";
import StudentReportCard from "../ReportCreate/StudentReportCard";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ReportForm = ({ form, students, onFinish, isDraft, setIsDraft, nearestSunday }) => {
  const formattedTitle = useMemo(() => {
    return dayjs(nearestSunday).format("YYYY년 MM월 DD일 목양일지");
  }, [nearestSunday]);

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="제목">
        <Typography.Text style={{ fontSize: "18px", fontWeight: "bold" }}>
          {formattedTitle}
        </Typography.Text>
      </Form.Item>

      {/* 하나님 앞에서 */}
      <Title level={4}>하나님 앞에서</Title>
      <Form.Item label="기도 횟수" name="prayCount" rules={[{ required: true }]}> 
        <Select>{[...Array(8)].map((_, i) => (<Option key={i} value={i}>{i}회</Option>))}</Select>
      </Form.Item>

      <Form.Item label="QT 횟수" name="qtCount" rules={[{ required: true }]}> 
        <Select>{[...Array(8)].map((_, i) => (<Option key={i} value={i}>{i}회</Option>))}</Select>
      </Form.Item>

      <Form.Item label="교사모임 참석" name="teacherMeeting" rules={[{ required: true }]}> 
        <Radio.Group>
          <Radio value={true}>참석</Radio>
          <Radio value={false}>불참</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="주일예배 참석" name="worship" rules={[{ required: true }]}> 
        <Radio.Group>
          <Radio value={1}>1부 예배</Radio>
          <Radio value={2}>2부 예배</Radio>
          <Radio value={3}>3부 예배</Radio>
          <Radio value={0}>불참</Radio>
        </Radio.Group>
      </Form.Item>

      {/* 기도제목 */}
      <Title level={4}>기도제목</Title>
      <Form.Item name="prayYouth" label="사귐의교회(청소년부)"><TextArea rows={3} /></Form.Item>
      <Form.Item name="prayNew" label="GQS/새친구반"><TextArea rows={3} /></Form.Item>
      <Form.Item name="prayPersonal" label="선생님 본인"><TextArea rows={3} /></Form.Item>

      {/* 목양일지 */}
      {students.map((student) => (<StudentReportCard key={student.id} student={student} />))}

      {/* 기타(질문, 요청 및 건의사항, 근황) */}
      <Title level={4}>기타(질문, 요청 및 건의사항, 근황)</Title>
      <Form.Item name="issue" label="이사, 진학, 유학 등 본인에 대한 특이사항이 있다면 알려주세요."><TextArea rows={3} placeholder="질문 혹은 요청, 건의사항 등 편하게 이야기 해주세요." /></Form.Item>

      {/* submit */}
      <Form.Item style={{ textAlign: "right" }}>
        <Button style={{ marginRight: "10px" }} onClick={() => { setIsDraft(true); form.submit(); }}>임시저장</Button>
        <Button type="primary" htmlType="submit" onClick={() => setIsDraft(false)}>제출하기</Button>
      </Form.Item>
    </Form>
  );
};

export default ReportForm;
