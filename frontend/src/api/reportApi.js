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

// 해당주차의 출석 입력 여부 및 user 별 중복작성 확인 API
export const CheckExistData = async (nearestSunday) => {
  try {
    const response = await axiosInstance.get("/report/initial/check-exist/", {
      params: { nearestSunday },
    });
    return response.data;
  } catch (error) {
    console.error("Already Exist Data :", error);
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
export const fetchAdminReportSummary = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(
      "/admin-management/report/summary/",
      {
        params: filters,
      }
    );
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

// User에서 usercheck의 feedback 여부 확인 API
export const fetchUserReportFeedback = async (reportId) => {
  const { data } = await axiosInstance.get(
    `/admin-management/report/${reportId}/feedback/`
  );
  return data ?? null; 
};

// Admin에서 usercheck의 feedback 여부 확인 API
export const fetchAdminReportFeedback = async (reportId) => {
  const { data } = await axiosInstance.get(`/admin-management/report/${reportId}/feedback/`);
  return data ?? null;
};
  

// params report = user_check_id
export const createFeedback = async ({ report, body }) => {
  try {
    const response = await axiosInstance.post(
      "/admin-management/feedbacks/",
      { body },              // ← 본문을 객체로 보냄
      { params: { report } } // ← report는 params
    );
    return response.data;
  } catch (error) {
    console.error("Error creating report feedback:", error);
    throw error;
  }
};

// params id = feedback_id
export const updateFeedback = async ({ id, body }) => {
  try {
    const response = await axiosInstance.patch(
      `/admin-management/feedbacks/${id}/`, // 보통 DRF는 trailing slash 사용
      { body }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating report feedback:", error);
    throw error;
  }
};

// 4) 삭제: DELETE 메서드 사용
export const deleteFeedback = async ({ id }) => {
  try {
    const response = await axiosInstance.delete(`/admin-management/feedbacks/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting report feedback:", error);
    throw error;
  }
};
