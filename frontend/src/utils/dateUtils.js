/**
 * 현재 날짜 기준으로 가장 가까운 일요일의 날짜를 반환합니다.
 * @returns {string} - "YYYY-MM-DD" 형식의 일요일 날짜
 */
export const getNearestSunday = () => {
  const today = new Date(); // 현재 날짜
  const dayOfWeek = today.getDay(); // 현재 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)

  // 현재 날짜에서 요일 값을 빼서 가장 가까운 일요일 계산
  const sundayDate = new Date(today);
  sundayDate.setDate(today.getDate() - dayOfWeek);

  // YYYY-MM-DD 형식으로 반환
  const year = sundayDate.getFullYear();
  const month = String(sundayDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
  const day = String(sundayDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// /**
//  * 접속한 현재 날짜 기준으로 가장 가까운 일요일을 반환합니다.
//  * @returns {string} - "YYYY-MM-DD" 형식의 가장 가까운 일요일 날짜
//  */
// export const getNearestSunday = () => {
//   const today = new Date(); // 현재 날짜 가져오기
//   const dayOfWeek = today.getDay(); // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)

//   // 오늘 날짜에서 요일을 빼고 일요일 날짜로 이동
//   const sundayDate = new Date(today);
//   sundayDate.setDate(today.getDate() - dayOfWeek);

//   // YYYY-MM-DD 형식으로 반환
//   return sundayDate.toISOString().split("T")[0];
// };

/**
 * 가장 가까운 일요일 기준으로 2주 전까지의 날짜를 반환합니다.
 * @param {string} nearestSunday - 가장 가까운 일요일 ("YYYY-MM-DD" 형식)
 * @returns {Array<string>} - 3개의 날짜 배열 (현재, 1주 전, 2주 전)
 */
export const getLastTwoWeeks = (nearestSunday) => {
  const dates = [];
  for (let i = 0; i < 3; i++) {
    const date = new Date(nearestSunday);
    date.setDate(date.getDate() - i * 7); // 1주 간격으로 이전 날짜 계산
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    dates.push(formattedDate);
  }
  return dates;
};

export const getYearOptions = (range = 2) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < range; i++) {
    years.push(String(currentYear - i));
  }
  return years;
};