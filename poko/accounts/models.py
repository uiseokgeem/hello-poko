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
    kakao_id = models.CharField(max_length=100, unique=True, null=True, blank=True)

    ROLE_CHOICES = (
        ("HEAD", "정교사"),
        ("ASSISTANT", "부교사"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="ASSISTANT")

    head_teacher = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assistance_teacher",
        # head_teacher = CustomUser.objects.get(email="head_teacher@example.com")
        # assistants = head_teacher.assistant_teachers.all()  # 역참조로 소속된 부교사 조회
        # for assistant in assistants:
        #     print(assistant.full_name)  # 출력: 이부교1, 박부교2
        limit_choices_to={"role": "HEAD"},
        # 제한 조건: {"role": "HEAD"}
        # role 필드의 값이 "HEAD"(정교사)인 객체만 선택하여 head_teacher 필드에 저장할 수 있다.
        # admin의 select 에서도 head_teacher 값이 "정교사"인 계정만 출력된다.
        # 즉, role 필드가 "ASSISTANT"(부교사)인 객체는 선택할 수 없습니다.
        # 부교사를 정교사로 설정하는 실수를 방지하기 위해 사용.
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

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
