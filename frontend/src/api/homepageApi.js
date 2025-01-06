// export ?
// async ? 
// date : 조회한 날짜 기준 일요일을 지정하는 함수를 제작하고
// 디렉토리에 따로 분류하여 관리하여, modal에서도 사용될 수 있게 구현 해야한다.
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}common/`;

export const fetchHomepageAttendance = async (date) => {
    // await ? 
    // axios.get의 인자 구조는 어떻게 되어있는가?
    try {
        const response = await axios.get(`${API_URL}homepage_attendance/`, {
            params: { date }, // 파라미터 추가
            withCredentials: true, // 쿠키와 함께 요청
            headers: {
                'Content-Type': 'application/json' // JSON 데이터 형식 지정
            }
        });
        return response.data; // 성공 시 데이터 반환
        // error는 어떤 원리로 error 정보가 담기는가?
    } catch (error) {
        console.error('Failed to fetch homepage attendance data:', error);
        // throw ?
        throw error; // 에러를 상위 호출자로 전달
    }
};


// import axios from "axios";

// // API URL을 환경에 따라 설정 (배포 환경과 개발 환경 구분)
// const isProd = process.env.NODE_ENV === "production"; // 배포 환경 감지
// const API_URL = isProd ? 'https://www.poko-dev.com/api/common/' : 'http://localhost:8000/api/common/';

// // 홈페이지 출석 데이터를 가져오는 함수
// export const fetchHomepageAttendance = async (date) => {
//     try {
//         const response = await axios.get(`${API_URL}homepage_attendance/`, {
//             params: { date }, // 파라미터 추가
//             withCredentials: true, // 쿠키와 함께 요청
//             headers: {
//                 'Content-Type': 'application/json' // 요청 데이터 형식
//             }
//         });
//         return response.data; // 성공 시 데이터 반환
//     } catch (error) {
//         console.error('Failed to fetch homepage attendance data:', error);
//         throw error; // 에러를 상위 호출자로 전달
//     }
// };