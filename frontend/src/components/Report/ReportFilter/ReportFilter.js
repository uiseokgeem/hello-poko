// components/Report/ReportFilter/ReportFilter.js
import React from "react";
import { Form, Select, DatePicker, Input, Button, Space } from "antd";

const { RangePicker } = DatePicker;

export default function ReportFilter({ onChange, initialValues }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const payload = {
      teacher: values.teacher || null,
      student: values.student || "",
      status: values.status || null,
      keyword: values.keyword || "",
      start_date: values.dateRange?.[0]?.format("YYYY-MM-DD") || null,
      end_date: values.dateRange?.[1]?.format("YYYY-MM-DD") || null,
    };
    onChange(payload);
  };

  const handleReset = () => {
    form.resetFields();
    onChange({
      teacher: null,
      student: "",
      status: null,
      keyword: "",
      start_date: null,
      end_date: null,
    });
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleFinish}
      initialValues={initialValues}
      style={{ marginBottom: 16, gap: 8, flexWrap: "wrap" }}
    >
      <Form.Item name="teacher">
        <Select placeholder="교사" allowClear style={{ width: 160 }}>
          {/* 실제 옵션은 API로 채우는 것을 권장 */}
          <Select.Option value="1">선생님A</Select.Option>
          <Select.Option value="2">선생님B</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="student">
        <Input placeholder="학생 이름" allowClear style={{ width: 180 }} />
      </Form.Item>

      <Form.Item name="dateRange">
        <RangePicker allowEmpty={[true, true]} />
      </Form.Item>

      <Form.Item name="status">
        <Select placeholder="상태" allowClear style={{ width: 140 }}>
          <Select.Option value="draft">임시저장</Select.Option>
          <Select.Option value="submitted">제출완료</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="keyword">
        <Input placeholder="본문/기도제목" allowClear style={{ width: 220 }} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">검색</Button>
          <Button onClick={handleReset}>초기화</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}