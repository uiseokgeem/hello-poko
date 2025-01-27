/**
 * 그래프 데이터를 생성하는 함수
 * @param {Array} attendanceData - 출석 데이터 배열
 * @returns {Array} series - 그래프 시리즈 데이터
 */
export const getGraphSeries = (attendanceData) => [
  {
    name: "출석",
    data: attendanceData
      .filter((item) => item.type === "출석")
      .map((item) => ({
        x: new Date(item.date).getTime(), // 날짜를 타임스탬프로 변환
        y: item.value,
      })),
  },
  {
    name: "결석",
    data: attendanceData
      .filter((item) => item.type === "결석")
      .map((item) => ({
        x: new Date(item.date).getTime(), // 날짜를 타임스탬프로 변환
        y: item.value,
      })),
  },
];

/**
 * 라인 그래프 옵션을 생성하는 함수
 * @returns {Object} options - 라인 그래프 옵션
 */
export const getLineGraphOptions = () => ({
  chart: {
    type: "line",
    height: 350,
  },
  colors: ["#1E90FF", "#FF6347"], // 출석: 파란색, 결석: 붉은색
  stroke: {
    width: 2, // 선 두께
  },
  xaxis: {
    type: "datetime", // x축을 날짜 형식으로 설정
    title: {
      text: "날짜",
    },
    labels: {
      formatter: (value) => {
        const date = new Date(value);
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
      },
    },
    axisBorder: {
      show: true, // x축 라인 표시
    },
    axisTicks: {
      show: true, // x축 눈금 표시
    },
  },
  yaxis: {
    title: {
      text: "인원",
    },
    labels: {
      show: false, // y축 눈금 숨기기
    },
  },
  grid: {
    show: true, // 전체 그리드 표시
    xaxis: {
      lines: {
        show: true, // x축 그리드 라인 표시
      },
    },
    yaxis: {
      lines: {
        show: false, // y축 그리드 라인 숨기기
      },
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    x: {
      formatter: (value) => {
        const date = new Date(value);
        return `${date.getMonth() + 1}월 ${date.getDate()}일`; // 툴팁 날짜 형식
      },
    },
  },
  legend: {
    position: "top",
  },
});

/**
 * 막대 그래프 옵션을 생성하는 함수
 * @param {Array} grades - 반(grade) 데이터 카테고리
 * @returns {Object} options - 막대 그래프 옵션
 */
export const getBarGraphOptionsForGroups = (grades) => ({
  chart: {
    type: "bar",
    height: 350,
  },
  xaxis: {
    categories: grades, // 반 데이터 카테고리 추가
    title: {
      text: "반(Grade)",
    },
  },
  yaxis: {
    title: {
      text: "인원",
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
  legend: {
    position: "top",
  },
  colors: ["#1E90FF", "#FF6347"], // 출석: 파란색, 결석: 붉은색
});

/**
 * 그룹 그래프 데이터를 생성하는 함수
 * @param {Array} groupAttendanceData - 반별 출석 데이터 배열
 * @returns {Array} series - 그래프 시리즈 데이터
 */
export const getGroupGraphSeries = (groupAttendanceData) => [
  {
    name: "출석",
    data: groupAttendanceData.map((item) => item.attendance_count),
  },
  {
    name: "결석",
    data: groupAttendanceData.map((item) => item.absent_count),
  },
];

