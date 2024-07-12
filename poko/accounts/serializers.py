# 회원가입
from allauth.account.adapter import get_adapter
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer

# 로그인
from dj_rest_auth.serializers import LoginSerializer
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class CustomLoginSerializer(LoginSerializer):
    email = serializers.CharField(
        required=True,
        error_messages={
            "required": _("아이디(이메일)을 입력해주세요."),
            "blank": _("아이디(이메일)을 입력해주세요."),
        },
    )
    password = serializers.CharField(
        required=True,
        error_messages={
            "required": _("비밀번호를 입력해주세요."),
            "blank": _("비밀번호를 입력해주세요."),
        },
    )

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(
            request=self.context.get("request"), username=email, password=password
        )
        if user is None:
            if not User.objects.filter(email=email).exists():
                raise serializers.ValidationError({"email": _("등록되지 않은 아이디(이메일)입니다.")})
            raise serializers.ValidationError({"password": _("비밀번호가 올바르지 않습니다.")})

        data["user"] = user
        return data


class SendEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ValidatePwdSerializer(serializers.Serializer):
    password1 = serializers.CharField(
        write_only=True,
        required=True,
        allow_blank=False,
        allow_null=False,
        validators=[validate_password],
        error_messages={"required": "비밀번호는 반드시 입력 되어야 합니다."},
    )

    password2 = serializers.CharField(
        write_only=True,
        required=True,
    )

    def validate(self, data):
        password1 = data.get("password1")
        password2 = data.get("password2")
        if password1 and password2 and password1 != password2:
            raise serializers.ValidationError("비밀번호가 일치하지 않습니다. 다시 입력해주세요.")

        return data


class CustomRegisterSerializer(RegisterSerializer):
    username = None
    full_name = serializers.CharField(
        required=True,
        max_length=6,
        allow_blank=False,
    )
    birth_date = serializers.DateField(
        required=True,
    )
    registration_number = serializers.CharField(
        required=True,
        max_length=6,
        allow_blank=False,
    )

    def save(self, request):
        adapter = get_adapter()  # adapter?
        # user = super().save(request)
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        user.full_name = self.validated_data.get("full_name")  # 기존코드
        user.birth_date = self.validated_data.get("birth_date")  # 기존코드
        user.registration_number = self.validated_data.get("registration_number")
        user.email = self.validated_data.get("email")  # email 추가
        user.set_password(self.validated_data.get("password1"))  # password 설정
        user.save()

        return user
