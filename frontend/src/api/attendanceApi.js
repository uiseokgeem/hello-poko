import axios from "axios";
import { Cookies } from "react-cookie";

// CSRF 토큰을 가져오는 함수
const getCSRFToken = () => {
    const cookies = new Cookies();
    return cookies.get('csrftoken');
};

const csrftoken = getCSRFToken();

// 출석 데이터를 가져오는 함수
export const fetchAttendanceData = async (year) => {
    try {
        const response = await axios.get('https://www.poko-dev.com/attendance/api/records', {
            params: { year }, // 파라미터 추가
            withCredentials: true, // 쿠키와 함께 요청
            headers: {
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
        const response = await axios.get('https://www.poko-dev.com/attendance/api/members', {
            withCredentials: true, // 쿠키와 함께 요청
            headers: {
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

