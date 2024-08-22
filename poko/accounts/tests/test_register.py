# tests/test_register.py


import pytest
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode
from rest_framework.test import APIClient
from django.core import mail
from accounts.models import CustomUser


@pytest.mark.django_db
def test_send_email():
    client = APIClient()
    url = reverse("accounts-v1:send_email")
    data = {"email": "es468@naver.com"}

    response = client.post(url, data, format="json")

    assert response.status_code == 200
    assert len(mail.outbox) == 1  # 이메일이 발송되었는지 확인
    assert "인증코드가 발송 되었습니다." in response.data["message"]
    email = mail.outbox[0]
    assert "안녕하세요. poko 입니다!" in email.subject
    assert "회원가입을 위한 코드입니다" in email.body

    # 인증코드 및 인증 링크 확인
    # 테스트 환경에서는 실제 이메일 발송은 이루어지지 않고 메모리에 저장 됨. 이를 통해 assert 검증
    assert response.data["url_code"] in email.body
    assert response.data["email_code"] in email.body


# @pytest.mark.django_db
# def test_confirm_email():
#     client = APIClient()
#     send_email_url = reverse("send-email")
#     confirm_email_url = reverse("confirm-email")
#     email = "testuser@example.com"
#     data = {"email": email}
#
#     # 이메일 전송
#     response = client.post(send_email_url, data, format="json")
#     assert response.status_code == 200
#
#     # 이메일 확인
#     email_message = mail.outbox[0]
#     confirmation_link = email_message.body.split('href="')[1].split('">')[0]
#
#     url_code = confirmation_link.split("/")[-2]
#     email_code = confirmation_link.split("/")[-1]
#
#     confirm_data = {"user_input_code": urlsafe_base64_decode(url_code).decode("utf-8")}
#
#     response = client.post(
#         confirm_email_url,
#         confirm_data,
#         format="json",
#         kwargs={"url_code": url_code, "email_code": email_code},
#     )
#     assert response.status_code == 200
#     assert "인증코드가 일치 합니다." in response.data["message"]
#
#
# @pytest.mark.django_db
# def test_validate_password():
#     client = APIClient()
#     url = reverse("validate-password")
#     data = {"password1": "testpassword123", "password2": "testpassword123"}
#
#     response = client.post(url, data, format="json")
#
#     assert response.status_code == 200
#     assert "입력 비밀번호가 일치 합니다." in response.data["message"]
#
#
# @pytest.mark.django_db
# def test_register_user():
#     client = APIClient()
#
#     # Send Email
#     send_email_url = reverse("send-email")
#     email = "testuser@example.com"
#     data = {"email": email}
#     client.post(send_email_url, data, format="json")
#
#     # Confirm Email
#     email_message = mail.outbox[0]
#     confirmation_link = email_message.body.split('href="')[1].split('">')[0]
#     url_code = confirmation_link.split("/")[-2]
#     email_code = confirmation_link.split("/")[-1]
#     confirm_data = {"user_input_code": urlsafe_base64_decode(url_code).decode("utf-8")}
#     confirm_email_url = reverse(
#         "confirm-email", kwargs={"url_code": url_code, "email_code": email_code}
#     )
#     client.post(confirm_email_url, confirm_data, format="json")
#
#     # Validate Password
#     validate_password_url = reverse("validate-password")
#     password_data = {"password1": "testpassword123", "password2": "testpassword123"}
#     client.post(validate_password_url, password_data, format="json")
#
#     # Register User
#     register_url = reverse("custom-register")
#     registration_data = {
#         "username": "testuser",  # 필요한 경우 추가 필드 포함
#     }
#     response = client.post(
#         register_url,
#         registration_data,
#         format="json",
#         kwargs={"url_code": url_code, "email_code": email_code},
#     )
#
#     assert response.status_code == 201
#     assert "회원가입이 완료되었습니다." in response.data["message"]
#     assert CustomUser.objects.filter(email=email).exists()
