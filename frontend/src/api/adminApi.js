import axiosInstance from "./axiosInstance";

// 주차별 전체 인원 출석/결석 인원 수 라인 그래프
export const fetchWeeklyAttendanceData = async (year) => {
  try {
    const response = await axiosInstance.get("admin-management/weekly-attendance/", {
      params: { year },
    });
    return response.data; // 예상 데이터 형식: [{ date: '2023-03-23', type: '출석', value: 54 }, ...]
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error;
  }
};

// 주차별 반 출석 데이터를 가져오는 함수
export const fetchGroupAttendance = async (selectedWeek) => {
  try {
    const response = await axiosInstance.get("admin-management/group-attendance/attendance-by-week/", {
      params: { week: selectedWeek }, // 선택된 주차를 파라미터로 전달
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data for week:", error);
    throw error;
  }
};

// 학생별 출석 데이터를 가져오는 함수
export const fetchMemberAttendanceData = async (selectedYear) => {
  try {
    const response = await axiosInstance.get("admin-management/member-attendance/", {
      params: { year: selectedYear },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data for member:", error);
    throw error;
  }
};

// 주차 리스트 데이터를 가져오는 함수
export const fetchWeekList = async (year) => {
  try {
    const response = await axiosInstance.get("admin-management/weekly-list/", {
      params: { year },
    });
    return response.data; // 예상 데이터 형식: [{ date: '2023-03-23', type: '출석', value: 54 }, ...]
  } catch (error) {
    console.error("Error fetching week list:", error);
    throw error;
  }
};