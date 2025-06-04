import { useState, useEffect, useCallback } from "react";
import { fetchGroupAttendance } from "../../api/adminApi";

const useGroupAttendance = (weekOptions) => {
  const [groupAttendanceData, setGroupAttendanceData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(weekOptions.length > 0 ? weekOptions[0] : "");
  const [loading, setLoading] = useState(false);

  const fetchGroupData = useCallback(async () => {
    if (!selectedWeek) return;

    setLoading(true);
    try {
      const formattedWeek = new Date(selectedWeek).toISOString().split("T")[0];
      const data = await fetchGroupAttendance(formattedWeek);
      setGroupAttendanceData(data);
    } catch (error) {
      console.error("Error fetching group attendance data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedWeek]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  return { groupAttendanceData, selectedWeek, setSelectedWeek, loading, fetchGroupData };
};

export default useGroupAttendance;