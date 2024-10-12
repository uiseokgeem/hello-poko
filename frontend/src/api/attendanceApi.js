import axios from "axios";
import { Cookies } from "react-cookie";


// API URL을 환경에 따라 설정 (배포 환경과 개발 환경 구분)
const isProd = process.env.NODE_ENV === "production"; // 배포 환경 감지
const API_URL = isProd ? 'https://www.poko-dev.com/api/attendance/' : 'http://127.0.0.1:8000/api/attendance/';


// access token 가져오는 함수
const getAccessToken = () => {
    const cookies = new Cookies();
    const token = cookies.get('poko-auth');
    console.log("Access Token: ", token);  // 오타 수정
    return token;
};

// CSRF 토큰을 가져오는 함수
const getCSRFToken = () => {
    const cookies = new Cookies();
    return cookies.get('csrftoken');
};

const accessToken = getAccessToken();
const csrftoken = getCSRFToken();

// 출석 데이터를 가져오는 함수
export const fetchAttendanceData = async (year) => {
    try {
        const response = await axios.get(`${API_URL}records/`, {
            params: { year }, // 파라미터 추가
            withCredentials: true, // 쿠키와 함께 요청
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-CSRFToken': csrftoken, // CSRF 토큰
                'Content-Type': 'application/json' // 헤더 설정 오타 수정
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
            withCredentials: true, // 쿠키와 함께 요청
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-CSRFToken': csrftoken, // CSRF 토큰
                'Content-Type': 'application/json' // 헤더 설정
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
                'Authorization': `Bearer ${accessToken}`,
                'X-CSRFToken': csrftoken,
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
                'Authorization': `Bearer ${accessToken}`,
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            }
        })
        return response.data;
    } catch (error){
        console.error('Error fetching attendance statistics:', error);
        throw error
    }
};


