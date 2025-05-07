// components/Report/ReportCreate/StudentReportCard.js
import { Form, Checkbox, Input } from "antd";
const { TextArea } = Input;

const StudentReportCard = ({ student }) => {
  return (
    <div
      key={student.id}
      style={{
        marginBottom: "16px",
        padding: "12px",
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <strong>{student.name}</strong>
      <div style={{ display: "flex", gap: "20px", marginTop: "8px", alignItems: "center" }}>
        <div>
            예배 참석:{" "}
            {student.attendance ? (
            <span style={{ color: "#1890ff" }}>예배 출석</span>
            ) : (
            <span style={{ color: "#ff4d4f" }}>예배 결석</span>
            )}
        </div>

        <Form.Item
            name={["students", String(student.id), "attendedGqs"]}
            valuePropName="checked"
            initialValue={false}
            style={{ marginBottom: 0 }}
        >
            <Checkbox>GQS 참석</Checkbox>
        </Form.Item>
        </div>

      <Form.Item
        name={["students", student.id, "careNote"]}
        label="세부 내용"
      >
        <TextArea rows={2} placeholder="격려, 질문, 관찰 등" />
      </Form.Item>
    </div>
  );
};

export default StudentReportCard;