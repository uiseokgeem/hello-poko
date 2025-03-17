import axiosInstance from "./axiosInstance";

// 주차별 전체 인원 출석/결석 인원 수 라인 그래프 API
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

// 주차별 반 출석 데이터를 가져오는 API
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

// 학생별 출석 데이터를 가져오는 API
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

// 주차 리스트 데이터를 가져오는 API
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

// 등록 선생님의 모든 정보를 가져오는 API
export const fetchTeacherList = async () => {
  try {
    const response = await axiosInstance.get("admin-management/teachers");
    return response.data; 
  } catch (error) {
    console.error("선생님 목록을 불러오는 중 오류 발생:", error);
    throw error;
  }
};

// 특정 선생님 삭제하는 API
export const deleteTeacher = async (teacherId) => {
  try {
    await axiosInstance.delete(`admin-management/teachers/${teacherId}`);
  } catch (error) {
    console.error(`선생님 삭제 중 오류 발생 (ID: ${teacherId}):`, error);
    throw error;
  }
};

// 특정 선생님 부분 업데이트하는 API
export const updateTeacherPartial = async (teacherId, updateData) => {
  try {
    const response = await axiosInstance.patch(
      `admin-management/teachers/${teacherId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(`선생님 정보 수정 중 오류 발생 (ID: ${teacherId}):`, error);
    throw error;
  }
};


