import React, { useState, useEffect } from "react";
import { Table, Button, Select } from "antd";
import { getYearOptions } from "../../../utils/dateUtils";
import "./ReportTableMain.css";

const { Option } = Select;

const ReportTableMain = ({
  fetchFunction,
  columns,
  onRowClick,
  showCreateButton = true,
}) => {
  const [data, setData] = useState([]); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const yearOptions = getYearOptions();

  useEffect(() => {
    const loadData = async () => {
      try {
        const reports = await fetchFunction(selectedYear);
        setData(
          reports.map((item) => ({
            key: item.id,
            date: item.date,
            title: item.title,
            teacher: item.teacher_name,
            status: item.status === 1 ? "답변 완료" : "답변 대기",
          }))
        );
      } catch (error) {
        console.error("보고서 목록 불러오기 실패:", error);
      }
    };
    loadData();
  }, [fetchFunction, selectedYear]);

  return (
    <div className="report-main-container">
      <div className="report-header">
        <div className="report-filter">
          <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 100 }}>
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          <span className="report-count">전체 {data.length}</span>
        </div>

        {showCreateButton && (
          <Button type="primary" className="new-report-button" onClick={() => onRowClick({ isNew: true })}>
            + 새 목양일지
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
};

export default ReportTableMain;