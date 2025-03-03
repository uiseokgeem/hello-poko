import { useState, useEffect, useCallback } from "react";
import { fetchWeeklyAttendanceData, fetchWeekList, fetchMemberAttendanceData } from "../../api/adminApi";

const useWeeklyAttendance = (selectedYear) => {
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState([]);
  const [memberAttendanceData, setMemberAttendanceData] = useState([]);
  const [weekOptions, setWeekOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [weeklyData, weeks, attendanceData] = await Promise.all([
        fetchWeeklyAttendanceData(selectedYear),
        fetchWeekList(selectedYear),
        fetchMemberAttendanceData(selectedYear),
      ]);

      setWeeklyAttendanceData(weeklyData);
      setWeekOptions(weeks);
      setMemberAttendanceData(attendanceData.data);
    } catch (error) {
      console.error("Error fetching weekly attendance data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { weeklyAttendanceData, memberAttendanceData, weekOptions, loading, fetchData };
};

export default useWeeklyAttendance;