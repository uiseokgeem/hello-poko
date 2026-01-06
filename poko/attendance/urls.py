from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .api import (
    TeachersViewSet,
    MembersViewSet,
    AttendanceViewSet,
    AttendanceStatsViewSet,
)

app_name = "attendance"

router = DefaultRouter()
router.register(r"teachers", TeachersViewSet, basename="teachers")
router.register(r"members", MembersViewSet, basename="member")
router.register(r"attendance-records", AttendanceViewSet, basename="attendance-records")
router.register(
    r"attendance-stats", AttendanceStatsViewSet, basename="attendance-stats"
)

urlpatterns = [
    path("produce/", views.ApiAttendanceProduce),
    path("date/", views.ApiAttendanceList),
    path("check/", views.ApiAttendanceChecking),
    path("check_modi/", views.ApiAttendanceModify),
    path("", include(router.urls)),
]
