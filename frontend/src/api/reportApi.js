import axiosInstance from "./axiosInstance";

// 현재 등록 된 목양일지 조회를 위한 API
export const fetchReportSummary = async (year) => {
  try {
    const response = await axiosInstance.get("/report/summary/", {
      params: { year }, 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching report summary:", error);
    throw error;
  }
};

// 목양일지 Form 초기 세팅을 위한 API
export const fetchReportAttendanceData = async (nearestSunday) => {
  try {
    const response = await axiosInstance.get("/report/initial/", {
      params: { nearestSunday }, 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching report attendance data:", error);
    throw error;
  }
};

// 목양일지 제출하기
export const submitReport = async (formData, nearestSunday) => {
  try {
    const response = await axiosInstance.post("/report/", formData, {
      params: { nearestSunday },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
};

// 목양일지 임시저장 API

// 목양일지 수정하기 API

// 목양일지 삭제하기 API

