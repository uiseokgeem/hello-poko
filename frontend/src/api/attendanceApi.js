import axiosInstance from "./axiosInstance";

// 출석 데이터를 가져오는 함수
export const fetchAttendanceData = async (year) => {
  try {
    const response = await axiosInstance.get("attendance/attendance-records/", {
      params: { year }, // 파라미터 추가
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error;
  }
};

// 학생 데이터를 가져오는 함수
export const fetchStudents = async () => {
  try {
    const response = await axiosInstance.get("attendance/members/");
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// 단일 선생님 데이터를 가져오는 함수
export const fetchTeachers = async () => {
  try {
    const response = await axiosInstance.get("attendance/teachers/");
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

// 모든 선생님 리스트 가져오기
export const fetchAllTeachers = async () => {
  try {
    const response = await axiosInstance.get("attendance/teachers/all-teachers/");
    return response.data;
  } catch (error) {
    console.error("Error fetching all teachers:", error);
    throw error;
  }
};

// 출석 통계를 가져오는 함수
export const fetchAttendanceStats = async () => {
  try {
    const response = await axiosInstance.get("attendance/attendance-stats/");
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance statistics:", error);
    throw error;
  }
};

// 출석 데이터를 서버로 POST 요청하는 함수
export const postAttendanceData = async (date, attendanceData) => {
  try {
    const response = await axiosInstance.post("attendance/attendance-records/", {
      date: date,
      attendance: attendanceData,
    });
    console.log("Post Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error posting attendance data:", error);
    throw error;
  }
};

// 출석 데이터를 서버로 PATCH 요청하는 함수
export const patchAttendanceData = async (date, attendanceData) => {
  try {
    const response = await axiosInstance.patch("attendance/attendance-records/bulk-update/", {
      date: date,
      attendance: attendanceData,
    });
    console.log("Patch Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error patching attendance data:", error);
    throw error;
  }
};

// 신규 학생 추가 함수
export const createStudent = async (studentData) => {
  try {
    const response = await axiosInstance.post("attendance/members/", studentData);
    console.log("Student added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};