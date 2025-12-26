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

// 특정 선생님 삭제하는 API
export const deleteTeacher = async (teacherId) => {
  try {
    await axiosInstance.delete(`admin-management/teachers/${teacherId}`);
  } catch (error) {
    console.error(`선생님 삭제 중 오류 발생 (ID: ${teacherId}):`, error);
    throw error;
  }
};

// HEAD 선생님 부분 수정 API
export const updateTeacherPartial = async (teacherId, updateData) => {
  try {
    const response = await axiosInstance.patch(
      `admin-management/teachers/${teacherId}/`,
      updateData
    );
    console.log("수정 api 작동");
    return response.data;
  } catch (error) {
    console.error(`선생님 정보 수정 중 오류 발생 (ID: ${teacherId}):`, error);
    throw error;
  }
};

// ASSISTANT 선생님 등록 API
export const registerTeacher = async (teacherId, formData) => {
  try {
    const response = await axiosInstance.patch(
      `admin-management/teachers/${teacherId}/`,
      formData
    );
    console.log("등록 api 작동");
    return response.data;
  } catch (error) {
    console.error(`선생님 정보 등록 중 오류 발생 (ID: ${teacherId}):`, error);
    throw error;
  }
};

// API로 모든 HEAD 선생님 리스트를 불러오는 fetch API
export const fetchHeadTeachers = async () => {
  try {
    const response = await axiosInstance.get("admin-management/teachers/heads/", {
    });
    return response.data;
  } catch (error) {
    console.error("HEAD 선생님 목록 오류:", error);
    return [];
  }
};

// 등록 선생님의 모든 정보를 가져오는 API(AdminReportPage.js filiter)
export const fetchTeacherList = async () => {
  try {
    const response = await axiosInstance.get("admin-management/teachers");
    return response.data; 
  } catch (error) {
    console.error("선생님 목록을 불러오는 중 오류 발생:", error);
    throw error;
  }
};

// 등록 학생의 모든 정보를 가져오는 API(AdminReportPage.js filiter)
export const fetchStudentList = async () => {
  try {
    const response = await axiosInstance.get("admin-management/students/");
    return response.data;
  } catch (error) {
    console.error("학생 목록을 불러오는 중 오류 발생:", error);
    throw error;
  }
};

// 학생 부분 수정(PATCH) API
export const updateStudentPartial = async (studentId, updateData) => {
  try {
    const response = await axiosInstance.patch(
      `admin-management/students/${studentId}/`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(`학생 정보 수정 중 오류 발생 (ID: ${studentId}):`, error);
    throw error;
  }
};

// 학생 삭제(DELETE) API
export const deleteStudent = async (studentId) => {
  try {
    await axiosInstance.delete(`admin-management/students/${studentId}/`);
  } catch (error) {
    console.error(`학생 삭제 중 오류 발생 (ID: ${studentId}):`, error);
    throw error;
  }
};

// 등록 선생님의 모든 정보를 가져오는 API(AdminMembersPage.js filter)
export const fetchTeacherFilter = async (q = "") => {
  try {
    const response = await axiosInstance.get("admin-management/teachers/", {
      params: q ? { q } : {},
    });
    return response.data;
  } catch (error) {
    console.error("선생님 목록 불러오기 실패:", error);
    throw error;
  }
};

// 학생 선생님의 모든 정보를 가져오는 API (AdminMembersPage.js filter)
export const fetchStudentFilter = async (q = "") => {
  try {
    const response = await axiosInstance.get("admin-management/students/", {
      params: q ? { q } : {},
    });
    return response.data;
  } catch (error) {
    console.error("학생 목록 불러오기 실패:", error);
    throw error;
  }
};

// // 반 목록의 가져오는 API
// export const fetchClassAssignments = async () => {
//   try {
//     const response = await axiosInstance.get("admin-management/class-assignments/");
//     return response.data; // { rows, head_candidates, assistant_candidates }
//   } catch (error) {
//     console.error("반 목록을 불러오는 중 오류 발생:", error);
//     throw error;
//   }
// };

// // 반 편성 업데이트 API
// export const saveClassAssignments = async (payload) => {
//   try {
//     // payload: [{ class_name, head_id, assistant_id }]
//     const response = await axiosInstance.post("admin-management/class-assignments/save/", payload);
//     return response.data; 
//   } catch (error) {
//     console.error("반 편성 중 오류 발생:", error);
//     throw error;
//   }
// };

/* 1단계 반편성 */
export const fetchClassAssignments = async () => {
  const res = await axiosInstance.get("admin-management/class-assignments/");
  return res.data;
};

export const saveClassAssignments = async (payload) => {
  const res = await axiosInstance.post("admin-management/class-assignments/save/", payload);
  return res.data;
};

/* 2단계 학년 업데이트 */
export const fetchStudentsForGradeStep = async ({ q = "", grade = "" } = {}) => {
  const res = await axiosInstance.get("admin-management/students/grade-step/", {
    params: {
      ...(q ? { q } : {}),
      ...(grade ? { grade } : {}),
    },
  });
  return res.data;
};

// body: { mode: "selected"|"promote", student_ids: number[], target_grade: string|null }
export const saveStudentsGradeBulk = async (body) => {
  const res = await axiosInstance.post("admin-management/students/grade-bulk/", body);
  return res.data;
};

/* 3단계 학생 배치 */
export const fetchStudentsForPlacementStep = async ({ q = "", grade = "" } = {}) => {
  const res = await axiosInstance.get("admin-management/students/placement-step/", {
    params: {
      ...(q ? { q } : {}),
      ...(grade ? { grade } : {}),
    },
  });
  return res.data;
};

export const fetchHeadTeacherCandidates = async () => {
  const res = await axiosInstance.get("admin-management/teachers/heads/");
  return res.data;
};

// body: { head_id: number, student_ids: number[] }
export const assignStudentsToHead = async (body) => {
  const res = await axiosInstance.post("admin-management/students/assign-head/", body);
  return res.data;
};

  