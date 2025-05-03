import axiosInstance from "./axiosInstance";

export const fetchReportAttendanceData = async (nearestSunday) => {
  try {
    const response = await axiosInstance.get("/report/initial/", {
      params: { nearestSunday }, // 파라미터 추가
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching report attendance data:", error);
    throw error;
  }
};