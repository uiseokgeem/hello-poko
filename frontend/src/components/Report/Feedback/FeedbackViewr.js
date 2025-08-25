import React from "react";
import { Card, Typography, Empty } from "antd";

const { Text, Paragraph } = Typography;

export default function FeedbackViewer({ feedback, loading }) {
  if (loading) {
    return null;
  }

  if (!feedback) {
    return (
      <Empty
        description="관리자 피드백이 아직 등록되지 않았습니다."
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const created = new Date(feedback.created_at).toLocaleString();

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Text type="secondary">
          {feedback.author_name} · {feedback.role} · {created}
        </Text>
      </div>
      <Paragraph style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", marginTop: 8 }}>
        {feedback.body}
      </Paragraph>
    </Card>
  );
}