import React, { useState, useEffect } from "react";
import { Table, Button, Select } from "antd";
import CustomButton from "../../../utils/Button";
import { getNearestSunday } from "../../../utils/dateUtils";
import { getYearOptions } from "../../../utils/dateUtils";
import { CheckExistData } from "../../../api/reportApi";
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
  const [nearestSunday] = useState(getNearestSunday());
  const env = process.env.REACT_APP_ENV;

  const formatKoreanDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${year}년 ${month}월 ${day}일`;
  };
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const reports = await fetchFunction(selectedYear);
        setData(
          reports.map((item) => ({
            key: item.id,
            date: item.date,
            title: `${formatKoreanDate(item.date_sunday)}, ${item.week_number}주차 목양일지`,
            week: item.week_number,
            teacher: item.teacher_name,
            status: item.status === 1 ? "작성완료" : "작성중",
          }))
        );
      } catch (error) {
        console.error("보고서 목록 불러오기 실패:", error);
      }
    };
    loadData();
  }, [fetchFunction, selectedYear]);

  const handleProdClick = async () => {
    const nearestSundayDate = new Date(nearestSunday);
    const formattedDate = nearestSundayDate.toISOString().split("T")[0];
    try {
      await CheckExistData(formattedDate);
      onRowClick({ isNew: true });
    } catch (error) {
      alert(error.response?.data?.detail || "출석 정보 확인에 실패했습니다.");
    }
  };

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

        {/* {showCreateButton && (
          env === "production" ? (
            <CustomButton
              type="primary"
              label="+ 새 목양일지"
              onClick={handleProdClick}
              variant="new"
            />
          ) : (
            <CustomButton
              type="primary"
              label="+ 새 목양일지"
              onClick={() => onRowClick({ isNew: true })}
              variant="new"
            />
          )
        )} */}

      {showCreateButton && (
          <CustomButton
            type="primary"
            label="+ 새 목양일지"
            onClick={() => onRowClick({ isNew: true })}
            variant="new"
          />
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
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default ReportTableMain;