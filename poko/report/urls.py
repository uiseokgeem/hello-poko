from django.urls import path, include
from rest_framework.routers import DefaultRouter
from report.api import ReportInitialDataViewSet

router = DefaultRouter()
router.register(r"initial", ReportInitialDataViewSet, basename="report-initial")

urlpatterns = [
    path("", include(router.urls)),
]
