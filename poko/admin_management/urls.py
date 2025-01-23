from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import (
    WeeklyAttendanceViewSet,
    WeeklyListView,
    GroupAttendanceViewSet,
    MemberAttendanceViewSet,
)

app_name = "admin_management"

router = DefaultRouter()
router.register(
    r"weekly-attendance",
    WeeklyAttendanceViewSet,
    basename="weekly-attendance",
)
router.register(
    r"group-attendance",
    GroupAttendanceViewSet,
    basename="group-attendance",
)
router.register(
    r"member-attendance",
    MemberAttendanceViewSet,
    basename="member-attendance",
)

urlpatterns = [
    path("", include(router.urls)),
    path("weekly-list/", WeeklyListView.as_view(), name="weekly-list"),
]
