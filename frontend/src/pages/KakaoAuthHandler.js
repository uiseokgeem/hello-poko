import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}accounts/`;

const KakaoAuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Kakao 인증 서버에서 받은 인가 코드

    if (code) {
      // Django 서버로 인가 코드 전달
      axios.post(`${API_URL}kakao/login`, { code }, { withCredentials: true }) // 쿠키 사용
        .then((response) => {
          const { additional_info_required, is_admin } = response.data;
          console.log(additional_info_required);

          if (additional_info_required) {
            navigate('/register'); // 추가 정보 입력 페이지로 이동
          } else if (is_admin) {
            navigate('/admin-page'); // 관리자인 경우 관리자 페이지로 이동
          } else {
            navigate('/attendance'); // 일반 사용자는 출석 페이지로 이동
          }
        })
        .catch((error) => {
          console.error(error);
          alert('카카오 로그인 실패');
          navigate('/login'); // 실패 시 로그인 페이지로 이동
        });
    }
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoAuthHandler;