import { withConfirm } from "antd/es/modal/confirm";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}attendance/`;

// 출석 데이터를 가져오는 함수
export const fetchAttendanceData = async (year) => {
    try {
        const response = await axios.get(`${API_URL}attendance-records/`, {
            params: { year }, // 파라미터 추가
            withCredentials: true, // 쿠키와 함께 요청
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        throw error;
    }
};

// 학생 데이터를 가져오는 함수
export const fetchStudents = async () => {
    try {
        const response = await axios.get(`${API_URL}members/`, {
            withCredentials: true, 
            headers: {
                'Content-Type': 'application/json' // 
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// 단일 선생님 데이터를 가져오는 함수
export const fetchTeachers = async () => {
    try {
        const response = await axios.get(`${API_URL}teachers/`,{
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // console.log('fetchTeachers', response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
    }
};

// 모든 선생님 리스트 가져오기
export const fetchAllTeachers = async () => {
    try {
        const response = await axios.get(`${API_URL}teachers/all-teachers/`, { withCredentials: true });
        return response.data; // 선생님 리스트 반환
    } catch (error) {
        console.error("Error fetching all teachers:", error);
        throw error;
    }
};

// 출석 통계를 가져오는 함수
export const fetchAttendanceStats = async () => {
    
    try {
        const response = await axios.get(`${API_URL}attendance-stats/`,{
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data;
    } catch (error){
        console.error('Error fetching attendance statistics:', error);
        throw error
    }
};

// 출석 데이터를 서버로 POST 요청하는 함수
export const postAttendanceData = async (date, attendanceData) => {
    
    try {
        console.log('post 요청 데이터:', { date, attendanceData }); // 데이터를 확인하기 위해 추가
        const response = await axios.post(
            `${API_URL}attendance-records/`,
            {
                date: date,
                attendance: attendanceData
            },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Post Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error posting attendance data:', error);
        throw error;
    }
};


// 출석 데이터를 서버로 PATCH  요청하는 함수
export const patchAttendanceData = async (date, attendanceData) => {
    try {
        console.log('PATCH 요청 데이터:', { date, attendanceData }); // 데이터를 확인하기 위해 추가
        const response = await axios.patch(
            `${API_URL}attendance-records/bulk-update/`, // PATCH 요청 URL
            {
                date: date,
                attendance: attendanceData
            },
            {
                withCredentials: true, // 인증 정보를 포함
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Patch Response:', response.data); // 서버 응답 데이터 로그 출력
        return response.data;
    } catch (error) {
        console.error('Error patching attendance data:', error);
        throw error;
    }
};

// 신규학생 추가 함수
export const createStudent = async (studentData) => {
    try {
        const response = await axios.post(
            `${API_URL}members/`, // 학생 추가 API 엔드포인트
            studentData, // 요청 데이터 (학생 정보)
            {
                withCredentials: true, // 인증 정보를 포함
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Student added successfully:', response.data); // 응답 데이터 확인
        return response.data; // 서버에서 반환된 새 학생 데이터 반환
    } catch (error) {
        console.error('Error creating student:', error); // 에러 로그 출력
        throw error; // 에러를 호출한 쪽으로 전달
    }
};