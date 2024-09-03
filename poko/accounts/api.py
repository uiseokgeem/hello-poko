from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import SendEmailSerializer, ValidatePwdSerializer
import random
import string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

# 회원가입 API
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer
from accounts.models import CustomUser
from django.core.mail import EmailMessage
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny

# 로그인
from dj_rest_auth.views import LoginView
from dj_rest_auth.serializers import LoginSerializer
from .serializers import CustomLoginSerializer

# email test
import logging
from django.core.mail import send_mail
from django.http import HttpResponse

# boto3
import boto3
from poko import settings
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from django.http import JsonResponse

logger = logging.getLogger(__name__)


@csrf_exempt
def boto3_test(request):
    ses_client = boto3.client(
        "ses",
        region_name=settings.AWS_SES_REGION_NAME,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )

    subject = "TEST SES FROM DJANGO WITH BOTO3"
    body = "TEST SES FROM DJANGO WITH BOTO3"
    recipient = "manager.poko@gmail.com"

    try:
        response = ses_client.send_email(
            Source=settings.DEFAULT_FROM_EMAIL,
            Destination={
                "ToAddresses": [
                    recipient,
                ],
            },
            Message={
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {"Text": {"Data": body, "Charset": "UTF-8"}},
            },
        )
        return JsonResponse({"status": "success", "message_id": response["MessageId"]})

    except (NoCredentialsError, PartialCredentialsError) as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@method_decorator(csrf_exempt, name="dispatch")
class CustomLoginView(LoginView):
    serializer_class = CustomLoginSerializer


# @method_decorator(csrf_exempt, name="dispatch") : 개발 시에만 사용.
@method_decorator(csrf_exempt, name="dispatch")
class SendEmailAPIView(APIView):
    permission_classes = [AllowAny]  # 적절한 권한 클래스를 설정

    def post(self, request):
        serializer = SendEmailSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            # if CustomUser.objects.filter(email=email).exists():
            #     return Response(
            #         {"message": "이미 가입된 이메일입니다."}, status=status.HTTP_409_CONFLICT
            #     )
            ses_client = boto3.client(
                "ses",
                region_name=settings.AWS_SES_REGION_NAME,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )

            # 인증코드 및 이메일 인증 링크 생성
            code = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
            url_code = urlsafe_base64_encode(force_bytes(code))
            email_code = urlsafe_base64_encode(force_bytes(email))
            protocol = "https"
            domain = "poko-dev.com"
            code_confirm_url = (
                f"{protocol}://{domain}/verify-email/{url_code}/{email_code}/"
            )

            # 이메일 message 세팅
            subject = "안녕하세요. poko 등록 안내입니다."
            html_message = f"""
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <title>회원가입 이메일 인증</title>
                        </head>
                        <body>
                            <p>poko 등록을 위한 코드입니다: <strong>{code}</strong></p>
                            <p><a href="{code_confirm_url}">이메일 인증 링크</a></p>
                        </body>
                        </html>
                        """

            # 이메일 발송 세팅
            try:
                response = ses_client.send_email(
                    Source=settings.DEFAULT_FROM_EMAIL,
                    Destination={
                        "ToAddresses": [
                            email,
                        ],
                    },
                    Message={
                        "Subject": {"Data": subject, "Charset": "utf-8"},
                        "Body": {"Html": {"Data": html_message, "Charset": "utf-8"}},
                    },
                )

                return Response(
                    {
                        "message": "인증코드가 발송 되었습니다.",
                        "url_code": url_code,
                        "email_code": email_code,
                    },
                    status=status.HTTP_200_OK,
                )
            except (NameError, PartialCredentialsError) as e:
                return Response(
                    {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except Exception as e:
                return Response(
                    {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(
            data={"message": "이메일 주소가 올바르지 않습니다. 다시 시도해주세요."},
            status=status.HTTP_400_BAD_REQUEST,
        )


@method_decorator(csrf_exempt, name="dispatch")
class ConfirmEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, **kwargs):
        user_input_code = request.data["user_input_code"]
        url_code = kwargs.get("url_code")
        origin_code = urlsafe_base64_decode(url_code)  # 바이트(bytes) 타입
        origin_code_str = force_str(origin_code)  # 문자열(str) 타입

        email_code = kwargs.get("email_code")
        origin_email = urlsafe_base64_decode(email_code)
        origin_email_str = force_str(origin_email)

        # 대조
        if origin_code_str != user_input_code:
            return Response(
                {"message": "코드가 일치하지 않습니다. 확인 후 다시 입력해주세요."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        elif CustomUser.objects.filter(registration_number=origin_code_str).exists():
            return Response(
                {"message": "가입된 인증코드 입니다. 인증 코드를 재발급해주세요."},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            {
                "message": "인증코드가 일치 합니다. 다음 단계에서 비밀번호를 입력해주세요.",
                "user_input_code": user_input_code,
                "origin_code": origin_code_str,
                "email_code": origin_email_str,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_exempt, name="dispatch")
class ValidatePwdAPIView(APIView):
    serializer_class = ValidatePwdSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ValidatePwdSerializer(data=request.data)
        if serializer.is_valid():
            request.session["password1"] = serializer.validated_data["password1"]
            request.session["password2"] = serializer.validated_data["password2"]

            return Response(
                {"message": "입력 비밀번호가 일치 합니다."},
                status=status.HTTP_200_OK,
            )

        else:
            errors = serializer.errors
            return Response(
                {"message": "입력 비밀번호가 일치하지 않습니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CustomRegisterAPIView(RegisterView):
    serializer_class = CustomRegisterSerializer
    permission_classes = [AllowAny]

    @method_decorator(csrf_exempt)
    def post(self, request, *args, **kwargs):
        def decode_url_param(param):
            decoded_param = urlsafe_base64_decode(param)
            decoded_param_str = force_str(decoded_param)
            return decoded_param_str

        email = kwargs.get("email_code")
        origin_email_str = decode_url_param(email)

        registration_number = kwargs.get("url_code")
        origin_register_num_str = decode_url_param(registration_number)

        password1 = request.session.get("password1")
        password2 = request.session.get("password2")

        data = request.data.copy()
        data["email"] = origin_email_str
        data["registration_number"] = origin_register_num_str
        data["password1"] = password1
        data["password2"] = password2

        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save(request)

            return Response(
                {"message": "회원가입이 완료되었습니다."}, status=status.HTTP_201_CREATED
            )
        except ValidationError as e:
            print("Validation errors:", e.detail)
            return Response(
                {"message": "잘못된 가입 요청입니다.", "errors": e.detail},
                status=status.HTTP_400_BAD_REQUEST,
            )


# 입력 비밀번호 session 저장 확인 API
# class GetPasswordsAPIView(APIView):
#     def get(self, request, *args, **kwargs):
#         password1 = request.session.get("password1", None)
#         password2 = request.session.get("password2", None)
#         return Response(
#             {"password1": password1, "password2": password2},
#             status=status.HTTP_200_OK,
#         )
