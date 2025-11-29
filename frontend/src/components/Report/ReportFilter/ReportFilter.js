    // components/Report/ReportFilter/ReportFilter.js
    import React, { useState, useEffect } from "react";
    import { Form, Select, DatePicker, Input, Button, Space } from "antd";
    import { fetchTeacherList } from "../../../api//adminApi";

    const { RangePicker } = DatePicker;

    export default function ReportFilter({ onChange, initialValues }) {
      const [form] = Form.useForm();
      const [teachers, setTeachers] = useState([]);

      
      const handleFinish = (values) => {
        const payload = {
          teacher: values.teacher || null,
          student: values.student || "",
          status: values.status !== undefined ? values.status : null,
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

      useEffect(() => {
        const loadTeachers = async () => {
          try {
            const data = await fetchTeacherList();
            setTeachers(data);
          } catch (err) {
            console.error("교사 목록 불러오기 실패", err);
          }
        };

        loadTeachers()

      }, []);

      return (
          <Form
          form={form}
          layout="inline"
          onFinish={handleFinish}
          initialValues={initialValues}
          className="report-filter-form"
        >
          {/* 교사 선택 */}
          <Form.Item name="teacher">
          <Select placeholder="교사" allowClear style={{ width: 160 }}>
            {teachers.map((t) => (
              <Select.Option key={t.id} value={t.id}>
                {t.full_name}
              </Select.Option>
            ))}
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
              <Select.Option value={0}>작성중</Select.Option>
              <Select.Option value={1}>작성완료</Select.Option>
              <Select.Option value={2}>답변완료</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="keyword">
            <Input placeholder="본문/기도제목 키워드" allowClear style={{ width: 220 }} />
          </Form.Item>

          <Form.Item
            style={{
              marginLeft: "auto",   // 오른쪽 끝으로 밀기
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">검색</Button>
              <Button onClick={handleReset}>초기화</Button>
            </Space>
          </Form.Item>
        </Form>
      );
    }