from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf import settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("accounts.urls")),  # 대시보드 연결에 사용하자!
    path("api-auth/", include("rest_framework.urls")),
    # zpath("blog/", include("blog.urls")),  # drf test
    path("common/", include("common.urls")),
    path("attendance/", include("attendance.urls")),
    path("report/", include("report.urls")),
    # path("accounts/", include("allauth.urls"))
    # path("attendance/", include("attendance.urls")),
    # path("attendance/date/", include("attendance.urls")),
]
# settings.MEDIA_URL / settings.MEDIA_ROOT의 사용

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    import debug_toolbar

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]
