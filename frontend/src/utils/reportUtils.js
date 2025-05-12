// utils/reportUtils.js

// 
export const buildReportPayload = (values, formattedTitle, isDraft) => {
    return {
      title: formattedTitle,
      worship_attendance: values.worship,
      meeting_attendance: values.teacherMeeting,
      qt_count: values.qtCount,
      pray_count: values.prayCount,
      status: isDraft ? 0 : 1,
      pray: {
        pray_dept: values.prayYouth,
        pray_group: values.prayNew,
        pray_teacher: values.prayPersonal,
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
      worship_attendance: values.worship,
      meeting_attendance: values.teacherMeeting,
      qt_count: values.qtCount,
      pray_count: values.prayCount,
      status: isDraft ? 0 : 1,
      pray: values.pray,
      students: Object.entries(values.students || {}).map(([id, data]) => ({
        member: parseInt(id),
        gqs_attendance: data.attendedGqs || false,
        care_note: data.careNote,
      })),
      issue: values.issue,

    };
  };