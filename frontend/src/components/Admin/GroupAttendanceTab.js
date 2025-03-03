import React from "react";
import { Select, Button, Spin } from "antd";
import Chart from "react-apexcharts";
import { getBarGraphOptionsForGroups, getGroupGraphSeries } from "../../utils/graphUtils";

const { Option } = Select;

const GroupAttendanceTab = ({ groupAttendanceData, selectedWeek, setSelectedWeek, weekOptions, loading, openStudentModal }) => {
  const groupGrades = groupAttendanceData.map((item) => item.name__teacher__class_name);

  return (
    <>
      <div className="filters">
        <Select value={selectedWeek} onChange={setSelectedWeek} style={{ width: 160, marginRight: "16px" }}>
          {weekOptions.map((week) => <Option key={week} value={week}>{week}</Option>)}
        </Select>
        <Button type="default" onClick={openStudentModal}>+ 새친구 등록</Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ textAlign: "center", padding: "50px" }} />
      ) : (
        <Chart options={getBarGraphOptionsForGroups(groupGrades)} series={getGroupGraphSeries(groupAttendanceData)} type="bar" height={350} />
      )}
    </>
  );
};

export default GroupAttendanceTab;