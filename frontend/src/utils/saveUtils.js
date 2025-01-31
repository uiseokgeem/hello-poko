import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

/**
 * Save modal content as a text file
 * @param {Array} absentStudents - List of absent students
 * @param {String} date - Attendance date
 */
export const saveAsText = (absentStudents, date) => {
  const formattedData = absentStudents
    .map(
      (student) =>
        `이름: ${student.name}, 학년: ${student.grade}, 성별: ${student.gender}`
    )
    .join("\n");
  const fileContent = `출석일: ${date}\n\n${formattedData}`;
  const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `결석_인원_${date}.txt`);
};

/**
 * Save modal content as an image
 * @param {String} modalSelector - CSS selector for the modal container
 * @param {String} fileName - File name for the saved image
 */
export const saveAsImage = async (selector, excludeSelectors = []) => {
    const element = document.querySelector(selector); // 캡처할 메인 영역
    if (!element) {
      console.error(`Selector "${selector}" not found.`);
      return;
    }
  
    try {
      const canvas = await html2canvas(element, {
        scrollX: 0, // 수평 스크롤 무시
        scrollY: 0, // 수직 스크롤 무시
        useCORS: true, // CORS 문제 해결
        ignoreElements: (el) => {
          // 제외할 요소 필터링
          return excludeSelectors.some((excludeSelector) =>
            el.matches(excludeSelector)
          );
        },
      });
      canvas.toBlob((blob) => {
        saveAs(blob, "결석_인원_목록.png");
      });
    } catch (error) {
      console.error("Failed to capture the element as an image:", error);
    }
  };