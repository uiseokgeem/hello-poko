from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf import settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/admin-management/", include("admin_management.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/attendance/", include("attendance.urls")),
    path("api/report/", include("report.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/common/", include("common.urls")),
]

# settings.MEDIA_URL / settings.MEDIA_ROOT의 사용
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    import debug_toolbar

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]
