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

// 목양일지 상세 조회하기
// ReportEditPage.js
// ReportDetailPage.js
// ReportInitialDataViewSet, detail_report_data
export const fetchReportDetail = async (id, nearestSunday) => {
  try {
    const response = await axiosInstance.get("/report/initial/detail/", {
      params: { id, nearestSunday },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching report detail:", error);
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
export const submitDraftReport = async (formData, nearestSunday) => {
  try {
    const response = await axiosInstance.post("/report/draft/", formData, {
      params: { nearestSunday },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating draft report:", error);
    throw error;
  }
};

// 목양일지 수정하기 API
export const submitUpdateReport = async (id, formData, nearestSunday) => {
  try {
    const response = await axiosInstance.put(`/report/${id}/`, formData, {
      params: { nearestSunday },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
};


// admin에서 현재 등록 된 목양일지 조회를 위한 API
export const fetchAdminReportSummary = async (year) => {
  try {
    const response = await axiosInstance.get("/admin-management/report/summary/", {
      params: { year }, 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching report summary:", error);
    throw error;
  }
};

// admin에서 목양일지 상세 조회 API
export const fetchAdminReportDetail = async (id, nearestSunday) => {
  try {
    const response = await axiosInstance.get("/admin-management/report/detail/", {
      params: { id, nearestSunday },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching report detail:", error);
    throw error;
  }
};


// 해당주차의 출석 입력 여부 확인 API
export const CheckWeekAttendance = async (nearestSunday) => {
  try {
    const response = await axiosInstance.get("/report/attendance/", {
      params: { nearestSunday },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance :", error);
    throw error;
  }
};