import React from "react";
import { Select, Button, Spin } from "antd";
import Chart from "react-apexcharts";
import { getGraphSeries, getLineGraphOptions } from "../../utils/graphUtils";

const { Option } = Select;

const WeeklyAttendanceTab = ({ weeklyAttendanceData, selectedYear, setSelectedYear, loading, openStudentModal }) => {
  return (
    <>
      <div className="filters">
        <Select defaultValue={selectedYear} onChange={setSelectedYear} style={{ width: 120, marginRight: "16px" }}>
          {[2025, 2026].map((year) => (
            <Option key={year} value={year}>{year}</Option>
          ))}
        </Select>
        <Button type="default" onClick={openStudentModal}>+ 새친구 등록</Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ textAlign: "center", padding: "50px" }} />
      ) : (
        <Chart options={getLineGraphOptions()} series={getGraphSeries(weeklyAttendanceData)} type="line" height={350} />
      )}
    </>
  );
};

export default WeeklyAttendanceTab;