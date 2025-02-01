import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}`;

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // HttpOnly Cookie 사용
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios 응답 인터셉터: 401 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response, // 성공적인 응답은 그대로 반환
  (error) => {
    if (error.response?.status === 401) {
      // Access Token 만료 시 처리
      alert("세션이 만료되었습니다. 다시 로그인 해주세요."); // 사용자에게 알림 표시
      window.location.href = "/login"; // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error); // 다른 에러는 그대로 전달
  }
);

export default axiosInstance;