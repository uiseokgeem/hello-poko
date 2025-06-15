// components/Report/ReportForm.js
import React, { useEffect } from "react";
import { Form, Input, Select, Radio, Button, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../utils/Button";
import StudentReportCard from "../ReportCreate/StudentReportCard";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ReportForm = ({
  form,
  students = [],
  onFinish,
  isEdit,
  setIsEdit,
  isDraft,
  setIsDraft,
  nearestSunday,
  readOnly = false,
  formattedTitle,
  initialValues
}) => {

  useEffect(() => {
    if (initialValues) {
      // console.log("✅ 초기값 세팅", initialValues);
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);
    // readOnly form
    //   {readOnly ? (
    //     <Typography.Text>{표시할값}</Typography.Text>
    //   ) : (
    //     <Input />
    //   )}
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Form layout="vertical" 
      form={form} 
      onFinish={onFinish} 
      initialValues={initialValues}
    >
      <Form.Item label="제목">
        <Typography.Text style={{ fontSize: "18px", fontWeight: "bold" }}>
          {formattedTitle}
        </Typography.Text>
      </Form.Item>

      {/* 하나님 앞에서 */}

      {/* 기도 횟수 */}
      <Form.Item
        label="기도 횟수"
        name="pray_count"
        rules={[{ required: true, message: "기도 횟수를 선택해주세요" }]}
      >
        {readOnly ? (
          <Typography.Text>
          {initialValues?.pray_count ?? "-"}회
          </Typography.Text>
        ) : (
          <Select placeholder="기도 횟수 선택">
            {[...Array(8)].map((_, i) => (
              <Option key={i} value={i}>
                {i}회
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
      
      {/* QT 횟수 */}
      <Form.Item label="QT 횟수" name="qt_count" rules={[{ required: true }]}> 
        {readOnly ? (
          <Typography.Text>
          {initialValues?.qt_count ?? "-"}회
          </Typography.Text>
        ) : (
          <Select>{[...Array(8)].map((_, i) => (<Option key={i} value={i}>{i}회</Option>))}</Select>
        )
        }
      </Form.Item>
      
      {/* 교사모임 참석 */}
      <Form.Item label="교사모임 참석" name="meeting_attendance" rules={[{ required: true }]}> 
        {readOnly ? 
          (
            <Typography.Text>
           {initialValues?.meeting_attendance === true
              ? "참석"
              : initialValues?.meeting_attendance === false
              ? "불참"
              : "-"}
          </Typography.Text>
          ) : (
            <Radio.Group>
          <Radio value={true}>참석</Radio>
          <Radio value={false}>불참</Radio>
        </Radio.Group>
          )
          }
        </Form.Item>


        <Form.Item
          label="주일예배 참석"
          name="worship_attendance"
          rules={[{ required: true }]}
        > 
          {readOnly ? ( 
            <Typography.Text>
              {initialValues?.worship_attendance === 1
                ? "1부 예배"
                : initialValues?.worship_attendance === 2
                ? "2부 예배"
                : initialValues?.worship_attendance === 3
                ? "3부 예배"
                : initialValues?.worship_attendance === 0
                ? "불참"
                : "-"}
            </Typography.Text>
          ) : ( 
            <Radio.Group>
              <Radio value={1}>1부 예배</Radio>
              <Radio value={2}>2부 예배</Radio>
              <Radio value={3}>3부 예배</Radio>
              <Radio value={0}>불참</Radio>
            </Radio.Group>
          )}
        </Form.Item>

      {/* 기도제목 */}
      <Title level={4}>기도제목</Title>

      <Form.Item name={["pray", "pray_dept"]} label="사귐의교회(청소년부)">
        {readOnly ? (
          <Typography.Text style={{ whiteSpace: 'pre-line' }}>
            {initialValues?.pray?.pray_dept ?? "-"}
          </Typography.Text>
        ) : (
          <TextArea rows={3} />
        )}
      </Form.Item>

      <Form.Item name={["pray", "pray_group"]}  label="GQS/새친구반">
        {readOnly ? (
          <Typography.Text style={{ whiteSpace: 'pre-line' }}>
            {initialValues?.pray?.pray_group ?? "-"}
          </Typography.Text>
        ) : (
          <TextArea rows={3} />
        )}
      </Form.Item>

      <Form.Item name={["pray", "pray_teacher"]} label="선생님 본인">
        {readOnly ? (
          <Typography.Text style={{ whiteSpace: 'pre-line' }}>
            {initialValues?.pray?.pray_teacher ?? "-"}
          </Typography.Text>
        ) : (
          <TextArea rows={3} />
        )}
      </Form.Item>

      {/* <Title level={4}>기도제목</Title>
      <Form.Item name={["pray","pray_dept" ]} label="사귐의교회(청소년부)"><TextArea rows={3} /></Form.Item>
      <Form.Item name={["pray","pray_group" ]} label="GQS/새친구반"><TextArea rows={3} /></Form.Item>
      <Form.Item name={["pray","pray_teacher" ]} label="선생님 본인"><TextArea rows={3} /></Form.Item> */}

      {/* <Title level={4}>목양일지</Title>
      {(readOnly
        ? Object.values(initialValues?.students || {})
        : students || []
      ).map((student) => (
        <StudentReportCard
          key={student.id}
          student={student}
          readOnly={readOnly}
        />
      ))} */}

      <Title level={4}>목양일지</Title>
      {Object.values((readOnly ? initialValues?.students : students) || {}).map((student) => (
        <StudentReportCard
          key={student.id}
          student={student}
          readOnly={readOnly}
        />
      ))}

     {/* 기타(질문, 요청 및 건의사항, 근황) */}
      <Title level={4}>기타(질문, 요청 및 건의사항, 근황)</Title>
      <Form.Item
        name="issue"
        label="이사, 진학, 유학 등 본인에 대한 특이사항이 있다면 알려주세요."
      >
        {readOnly ? (
          <Typography.Text style={{ whiteSpace: 'pre-line' }}>
            {initialValues?.issue ?? "없습니다."}
          </Typography.Text>
        ) : (
          <TextArea
            rows={3}
            placeholder="질문 혹은 요청, 건의사항 등 편하게 이야기 해주세요."
          />
        )}
      </Form.Item>

      {/* submit (read{/* 버튼 렌더링 조건 */}
      {!readOnly && (
  <Form.Item>
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: "12px",
      marginTop: "24px",
    }}
  >
    {isEdit ? (
      <>
        <CustomButton
          type="primary"
          variant="submit"
          label="수정하기"
          onClick={() => {
            form.submit();
            setIsEdit(false);
          }}
        />
        <CustomButton
          type="default"
          variant="draft"
          label="수정 취소"
          onClick={() => {
            setIsEdit(false);
            form.resetFields();
            navigate(`/report/detail/${id}`);
          }}
        />
      </>
    ) : (
      <>
        <CustomButton
          type="default"
          variant="draft"
          label="임시저장"
          onClick={() => {
            setIsDraft(true);
            form.submit();
          }}
        />
        <CustomButton
          type="primary"
          variant="submit"
          htmlType="submit"
          label="제출하기"
          onClick={() => setIsDraft(false)}
        />
      </>
    )}
  </div>
</Form.Item>
)}    </Form>
  );
};

export default ReportForm;
