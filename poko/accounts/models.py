from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import UserManager


# note :
# username = None: username 필드를 사용하지 않음을 명시.
# USERNAME_FIELD = "email": 이메일을 사용자 이름 필드로 사용하여 인증.
# REQUIRED_FIELDS = []: 이메일 외에 추가로 필수적인 필드가 없음을 설정
class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    full_name = models.CharField(max_length=4)
    birth_date = models.DateField(null=True, blank=True)
    registration_number = models.CharField(max_length=6, null=True, blank=True)
    kakao_id = models.CharField(
        max_length=100, unique=True, null=True, blank=True
    )  # Kakao ID 필드 추가

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


# DRF 로그인 시 모델 필드에서 유효성 검사 진행 코드
# password = models.CharField(
#     _("password"),
#     max_length=128,  # Django의 기본 max_length 설정에 맞춤
#     blank=False,
#     error_messages={
#         "blank": _("비밀번호를 입력해주세요."),  # blank 오류 메시지 설정
#         "null": _("비밀번호를 입력해주세요."),  # null 오류 메시지 설정
#         "required": _("비밀번호를 입력해주세요."),  # required 오류 메시지 설정
#         "max_length": _("비밀번호는 128자 이내여야 합니다."),
#     },
# )
