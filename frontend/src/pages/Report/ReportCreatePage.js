import React from "react";
import { Form, Input, Select, Radio, Button, Typography } from "antd";
import AppHeader from "../../components/Header/Header";
import "./ReportCreatePage.css";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ReportCreatePage = () => {
  const [form] = Form.useForm();

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

          <Title level={4}>하나님 앞에서</Title>

          <Form.Item
            label="지난 주에는 얼마나 기도했나요"
            name="prayCount"
            rules={[{ required: true, message: "선택해주세요." }]}
          >
            <Select>
              <Option value="0회">0회</Option>
              <Option value="1회">1회</Option>
              <Option value="2회">2회</Option>
              <Option value="3회 이상">3회 이상</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="지난 주에는 얼마나 QT 묵상을 했나요"
            name="qtCount"
            rules={[{ required: true, message: "선택해주세요." }]}
          >
            <Select>
              <Option value="0회">0회</Option>
              <Option value="1회">1회</Option>
              <Option value="2회">2회</Option>
              <Option value="3회 이상">3회 이상</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="교사모임에 참석했나요"
            name="teacherMeeting"
            rules={[{ required: true, message: "선택해주세요." }]}
          >
            <Radio.Group>
              <Radio value="참석">참석</Radio>
              <Radio value="미참석">미참석</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="주일예배를 참석했나요"
            name="worship"
            rules={[{ required: true, message: "선택해주세요." }]}
          >
            <Radio.Group>
              <Radio value="1부 예배">1부 예배</Radio>
              <Radio value="2부 예배">2부 예배</Radio>
              <Radio value="3부 예배">3부 예배</Radio>
              <Radio value="불참">불참</Radio>
            </Radio.Group>
          </Form.Item>

          <Title level={4}>기도제목</Title>

          <Form.Item name="prayYouth" label="사랑의교회(청소년부)">
            <TextArea rows={3} placeholder="청소년부를 위한 기도제목을 작성하세요." />
          </Form.Item>

          <Form.Item name="prayNew" label="GQS/새친구반">
            <TextArea rows={3} placeholder="GQS/새친구반을 위한 기도제목을 작성하세요." />
          </Form.Item>

          <Form.Item name="prayPersonal" label="선생님 본인">
            <TextArea rows={3} placeholder="본인의 영적 필요를 위한 기도제목을 작성하세요." />
          </Form.Item>

          <Title level={4}>목양일지</Title>

          <Form.Item name="worshipMembers" label="예배 참석 학생">
            <Input placeholder="참석한 학생 이름을 작성하세요." />
          </Form.Item>

          <Form.Item name="gqsMembers" label="GQS 참여 학생">
            <Input placeholder="GQS 참석 학생을 작성하세요." />
          </Form.Item>

          <Form.Item name="conversation" label="상담/격려 사항">
            <TextArea rows={3} placeholder="학생과 나눈 대화나 격려 사항을 작성하세요." />
          </Form.Item>

          <Form.Item name="etc" label="기타(질문, 요청, 건의 등)">
            <TextArea rows={3} placeholder="기타 전달하고 싶은 내용을 작성하세요." />
          </Form.Item>

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