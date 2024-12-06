from . import views
from django.urls import path, include

# DRF
from rest_framework.routers import DefaultRouter
from .api import (
    TeachersViewSet,
    MembersViewSet,
    AttendanceViewSet,
    AttendanceStatsViewSet,
)

app_name = "attendance"

# DRF 라우터 설정
router = DefaultRouter()
router.register(r"teachers", TeachersViewSet, basename="teachers")
router.register(r"members", MembersViewSet, basename="member")
router.register(r"attendance-records", AttendanceViewSet, basename="attendance-records")
router.register(
    r"attendance-stats", AttendanceStatsViewSet, basename="attendance-stats"
)

# 기존에 정의된 URL 패턴
urlpatterns = [
    path("produce/", views.ApiAttendanceProduce),
    path("date/", views.ApiAttendanceList),
    path("check/", views.ApiAttendanceChecking),
    path("check_modi/", views.ApiAttendanceModify),
    path("", include(router.urls)),  # API URL 포함
    # 5월 22일 기준 사용하지 않는 url
    # path("", views.index_attendance, name="index_attendance"),
    # path("index_detail/", views.index_detail),
    # path("attendance_detail/", views.attendance_detail),
    # path("attendance_group/", views.attendance_group),
    # path("ind/", views.attendance_ind),
    # path("download_excel/", views.result_excel, name="download_excel"),
    path("", include(router.urls)),  # ViewSet을 위한 URL 포함
]
