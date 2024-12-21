// frontend/src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Typography, Spin, message } from 'antd';
import AppHeader from '../components/Header/Header';
import './HomePage.css';
import { fetchHomepageAttendance } from '../api/homepageApi';
import { getNearestSunday } from "../utils/dateUtils";

const { Content } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  // HomePageattendanceData 명확한 변수이름 추천
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);


  // useEffect 괄호구조 정리
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sunday = getNearestSunday();
        const data = await fetchHomepageAttendance(sunday);
        setAttendanceData(data); 
      } catch (error) {
        message.error("출석부 데이터를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AppHeader />
      <Content className="home-content">
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="출석부" bordered={false}>
                <Title level={4}>
                  총 출석: {attendanceData ? attendanceData.total_attendance : "-"}
                </Title>
                <Text>
                  결석: {attendanceData ? attendanceData.total_absence : "-"}
                </Text>
                <br />
                <Text>
                  {attendanceData
                    ? `${attendanceData.last_updated} 업데이트`
                    : "데이터 없음"}
                </Text>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="양육일지" bordered={false}>
                <Title level={4}>개발 대기</Title>
                <Text>2025년 1월 업데이트 예정</Text>
              </Card>
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default HomePage;