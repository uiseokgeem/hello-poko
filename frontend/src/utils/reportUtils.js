// utils/reportUtils.js

// 
export const buildReportPayload = (values, formattedTitle, isDraft) => {
    return {
      title: formattedTitle,
      worship_attendance: values.worship_attendance,
      meeting_attendance: values.meeting_attendance,
      qt_count: values.qt_count,
      pray_count: values.pray_count,
      status: isDraft ? 0 : 1,
      pray: {
        pray_dept: values.pray_dept,
        pray_group: values.pray_group,
        pray_teacher: values.pray_teacher,
      },
      students: Object.entries(values.students || {}).map(([id, data]) => ({
        member: parseInt(id),
        gqs_attendance: data.attendedGqs || false,
        care_note: data.careNote,
      })),
      issue: values.issue,

    };
  };


  export const UpdateBuildReportPayload = (values, formattedTitle, isDraft) => {
    return {
      title: formattedTitle,
      worship_attendance: values.worship_attendance,
      meeting_attendance: values.meeting_attendance,
      qt_count: values.qt_count,
      pray_count: values.pray_count,
      status: isDraft ? 0 : 1,
      pray: values.pray,
      students: Object.entries(values.students || {}).map(([id, data]) => ({
        member: parseInt(id),
        gqs_attendance: data.gqs_attendance || false,
        care_note: data.care_note || "",
      })),
      issue: values.issue,

    };
  };