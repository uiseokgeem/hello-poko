import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Select } from "antd";
import { reportColumns } from "./ReportColumns";
import { getYearOptions } from "../../../utils/dateUtils";
import "./ReportMain.css";

const { Option } = Select;

const ReportMain = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const yearOptions = getYearOptions(); // 기본: 최근 5년

  useEffect(() => {
    setData([
      {
        key: "1",
        date: "2025-05-01",
        title: "5월 첫째주 목양",
        state: "작성 완료",
      },
    ]);
  }, []);

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

      <Table columns={reportColumns} dataSource={data} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default ReportMain;