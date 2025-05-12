import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Select } from "antd";
import { reportColumns } from "./ReportColumns";
import {fetchReportSummary} from "../../../api/reportApi"
import { getYearOptions } from "../../../utils/dateUtils";
import "./ReportMain.css";

const { Option } = Select;

const ReportMain = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const yearOptions = getYearOptions(); // 기본: 최근 5년

  const handleRowClick = (record) => {
    navigate(`/report/detail/${record.key}`);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const reports = await fetchReportSummary(selectedYear);
        const formatted = reports.map((item) => ({
          key: item.id,
          date: item.date,
          title: item.title,
          state: item.status === 1 ? "작성 완료" : "작성 중",
        }));
        setData(formatted);
      } catch (error) {
        console.error("목양일지 목록 불러오기 실패:", error);
      }
    };
    loadData();
  }, [selectedYear]);

  return (
    <div className="report-main-container">
      <div className="report-header">
        <div className="report-filter">
          <Select
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
            style={{ width: 100 }}
          >
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          <span className="report-count">전체 {data.length}</span>
        </div>

        <Button type="primary" className="new-report-button" onClick={() => navigate("/report/create/")}>
          + 새 목양일지
        </Button>
      </div>
      <Table
        columns={reportColumns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
};

export default ReportMain;