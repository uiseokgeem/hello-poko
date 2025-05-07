from django.urls import path, include
from rest_framework.routers import DefaultRouter
from report.api import ReportInitialDataViewSet, ReportViewSet

router = DefaultRouter()
router.register(r"initial", ReportInitialDataViewSet, basename="report-initial")
router.register(r"", ReportViewSet, basename="report")

urlpatterns = [
    path("", include(router.urls)),
]
