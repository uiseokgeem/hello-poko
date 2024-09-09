from . import views
from django.urls import path, include
from . import api

app_name = "attendance"

# 기존에 정의된 URL 패턴
urlpatterns = [
    path("produce/", views.ApiAttendanceProduce),
    path("date/", views.ApiAttendanceList),
    path("check/", views.ApiAttendanceChecking),
    path("check_modi/", views.ApiAttendanceModify),
    # 5월 22일 기준 사용하지 않는 url
    # path("", views.index_attendance, name="index_attendance"),
    # path("index_detail/", views.index_detail),
    # path("attendance_detail/", views.attendance_detail),
    # path("attendance_group/", views.attendance_group),
    # path("ind/", views.attendance_ind),
    # path("download_excel/", views.result_excel, name="download_excel"),
]

# DRF 자원 중심의 엔드포인트 설계

attendance_api_v1 = [
    # 학생 리스트 및 생성 API
    path("students/", api.StudentsAPIView.as_view(), name="students"),
    # 특정 학생 정보 API
    path(
        "students/<int:pk>/info/",
        api.StudentInfoAPIView.as_view(),
        name="students-info",
    ),
    # 출석 리스트 및 생성 API
    path(
        "attendance/",
        api.AttendanceListCreateAPIView.as_view(),
        name="attendance-list-create",
    ),
    # 특정 출석 정보 API (수정 및 삭제)
    path(
        "attendance/<int:pk>/",
        api.AttendanceDetailAPIView.as_view(),
        name="attendance-detail",
    ),
    # 특정 날짜 출석 조회 API
    path(
        "attendance/dates/",
        api.AttendanceDateAPIView.as_view(),
        name="attendance-date",
    ),
    # 출석 통계 API
    path(
        "attendance/statistics/",
        api.AttendanceStatisticsAPIView.as_view(),
        name="attendance-statistics",
    ),
    # 교사 리스트 생성 API
    path(
        "teachers/",
        api.TeachersAPIView.as_view(),
        name="teachers",
    ),
    # 특정 교사 정보 API
    path(
        "teachers/<int:pk>/info/",
        api.TeachersInfoAPIView.as_view(),
        name="teachers-info",
    ),
]

# 전체 URL 패턴
urlpatterns = [
    path("api/", include((attendance_api_v1, "attendance-v1"))),
]
