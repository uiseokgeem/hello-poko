from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views
from . import api
from django.urls import path, include
from .views import CustomLoginView

# from .api import GetPasswordsAPIView

# app_name = "accounts", api test url reverse 사용 시 api name space와 충돌 됨.(주석처리)

# View
urlpatterns = [
    path("", CustomLoginView.as_view(template_name="account/login.html")),
    path(
        "login/",
        CustomLoginView.as_view(template_name="account/login.html"),
        name="login",
    ),
    path("logout/", views.ApiLogoutView, name="ApiLogoutView"),
    path("signup/", views.ApiSignup, name="ApiSignup"),
    path("update_pwd", views.ApiUpdatePwd, name="ApiUpdatePwd"),
    path("reset_pwd", views.ApiResetPwd.as_view(), name="ApiResetPwd"),
    path(
        "reset/<uidb64>/<token>/",
        views.ApiResetPwdConfirm.as_view(),
        name="ApiResetPwdConfirm",
    ),
]


# DRF
account_api_v1 = [
    # path(
    #    "", include("dj_rest_auth.urls")
    # ),  # dj_rest_auth login test 해당 라인 추가, http://127.0.0.1:8000/api/login -> common으로 이동할 것
    path("login/", api.CustomLoginView.as_view()),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("accounts/", include("allauth.urls")),
    path("send-email", api.SendEmailAPIView.as_view(), name="send_email"),
    path(
        "confirm-email/<str:url_code>/<str:email_code>",
        api.ConfirmEmailAPIView.as_view(),
        name="confirm_email",
    ),
    path(
        "register/<str:url_code>/<str:email_code>",
        api.CustomRegisterAPIView.as_view(),
        name="register",
    ),
    path(
        "validate-pwd/<str:url_code>/<str:email_code>",
        api.ValidatePwdAPIView.as_view(),
        name="validate_pwd",
    ),
    path("test-email/", api.test_email, name="test_email"),
    path("test-boto3/", api.boto3_test, name="boto3_test"),
    # path("get-passwords", GetPasswordsAPIView.as_view(), name="get-passwords"),
]

urlpatterns = [
    path("api/", include((account_api_v1, "accounts-v1"))),
]

# dj_rest_auth 설치 시 사용가능한 url 리스트
# api/ password/reset/ [name='rest_password_reset']
# api/ password/reset/confirm/ [name='rest_password_reset_confirm']
# api/ login/ [name='rest_login']
# api/ logout/ [name='rest_logout']
# api/ user/ [name='rest_user_details']
# api/ password/change/ [name='rest_password_change']
