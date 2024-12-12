// frontend/src/pages/HomePage.js
import React from 'react';
import { Layout, Row, Col, Card, Typography } from 'antd';
import AppHeader from '../components/Header/Header';
import './HomePage.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  return (
    <Layout style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AppHeader />
      <Content className="home-content">
        <Row gutter={[16, 16]}>
          {/* 출석부 섹션 */}
          <Col span={12}>
            <Card title="출석부" bordered={false}>
              <Title level={4}>총 출석: 6</Title>
              <Text>GQS: 5</Text>
              <br />
              <Text>결석: 2</Text>
              <br />
              <Text>2024년 08월 18일 업데이트</Text>
            </Card>
          </Col>
          
          {/* 양육일지 섹션 */}
          <Col span={12}>
            <Card title="양육일지" bordered={false}>
              <Title level={4}>5월 첫째주 양육일지</Title>
              <Text>2024년 08월 18일 업데이트</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="prayer-records-section">
          <Col span={24}>
            <Card title="기도제목" bordered={false} extra={<button>복사하기</button>}>
              <table className="prayer-table">
                <thead>
                  <tr>
                    <th>우리 반</th>
                    <th>선생님</th>
                    <th>중보기도</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>김사랑</td>
                    <td>사랑이는 한 주에 시험을 치르는데...</td>
                  </tr>
                  <tr>
                    <td>김선유</td>
                    <td>사랑이는 한 주에 시험을 치르는데...</td>
                  </tr>
                  {/* 여기에 더 많은 학생 데이터를 추가 */}
                </tbody>
              </table>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomePage;