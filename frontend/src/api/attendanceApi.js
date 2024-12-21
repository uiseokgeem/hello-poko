import { withConfirm } from "antd/es/modal/confirm";
import axios from "axios";

// API URL을 환경에 따라 설정 (배포 환경과 개발 환경 구분)
const isProd = process.env.NODE_ENV === "production"; // 배포 환경 감지
const API_URL = isProd ? 'https://www.poko-dev.com/api/attendance/' : 'http://localhost:8000/api/attendance/';

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

// 선생님 데이터를 가져오는 함수
export const fetchTeachers = async () => {
    try {
        const response = await axios.get(`${API_URL}teachers/`,{
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching teachers:', error);
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

