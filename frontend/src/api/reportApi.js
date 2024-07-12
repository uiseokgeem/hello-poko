import axios from 'axios';

const API_BASE_URL = 'http://your-api-base-url'; // 실제 API 베이스 URL로 변경하세요

export const saveDraft = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/member-check/draft`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitCheck = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/member-check/submit`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};