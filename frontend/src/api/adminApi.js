import { withConfirm } from "antd/es/modal/confirm";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}admin-management/`;

// 주차별 전체 인원 출석/결석 인원 수 라인 그래프
export const fetchWeeklyAttendanceData = async (year) => {
    try {
      const response = await axios.get(`${API_URL}weekly-attendance/`, {
        params: { year },
        withCredentials: true, // 쿠키와 함께 요청
            headers: {
                'Content-Type': 'application/json'
            }
      });
      return response.data; // 예상 데이터 형식: [{ date: '2023-03-23', type: '출석', value: 54 }, ...]
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      throw error;
    }
  };

export const fetchGroupAttendance = async (selectedWeek) => {
  try {
    const response = await axios.get(`${API_URL}group-attendance/attendance-by-week/`, {
      params: { week: selectedWeek }, // 선택된 주차를 파라미터로 전달
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data for week:", error);
    throw error;
  }
};

export const fetchMemberAttendanceData = async (selectedYear) => {
  try {
    const response = await axios.get(`${API_URL}member-attendance/`, {
      params: { year: selectedYear }, // 선택된 주차를 파라미터로 전달
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data for week:", error);
    throw error;
  }
};

  
export const fetchWeekList = async (year) => {
  try {
    const response = await axios.get(`${API_URL}weekly-list/`, {
      params: { year },
      withCredentials: true, // 쿠키와 함께 요청
          headers: {
              'Content-Type': 'application/json'
          }
    });
    return response.data; // 예상 데이터 형식: [{ date: '2023-03-23', type: '출석', value: 54 }, ...]
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};


