# tests/test_custom_user.py

import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import datetime


CustomUser = get_user_model()


@pytest.mark.django_db
def test_create_custom_user():
    birth_date = datetime.date(1990, 1, 1)

    user = CustomUser.objects.create_user(
        email="testuser@example.com",
        password="testpassword123",
        full_name="Test",
        birth_date=birth_date,
        registration_number="123456",
    )

    assert user.email == "testuser@example.com"
    assert user.check_password("testpassword123")
    assert user.full_name == "Test"
    assert user.birth_date.strftime("%Y-%m-%d") == birth_date.strftime("%Y-%m-%d")
    assert user.registration_number == "123456"


@pytest.mark.django_db
def test_create_custom_user_api():
    client = APIClient()

    # Base64로 인코딩된 URL 파라미터 생성
    email = "testuser@example.com"
    registration_number = "123456"
    email_code = urlsafe_base64_encode(force_bytes(email))
    url_code = urlsafe_base64_encode(force_bytes(registration_number))

    # URL 생성 (URL 패턴에 맞게 수정)
    # url = f"http://127.0.0.1:8000/api/register/{url_code}/{email_code}"
    # URL 생성 (수정된 부분: 네임스페이스 사용)
    url = reverse(
        "accounts-v1:register", kwargs={"email_code": email_code, "url_code": url_code}
    )

    print("url 확인", url)

    # 세션 데이터 설정 (필요에 따라 session을 mocking 하거나 설정)
    session = client.session
    session["password1"] = "testpassword123"
    session["password2"] = "testpassword123"
    session.save()

    # 요청 데이터
    data = {
        "full_name": "Test",
        "birth_date": "1990-01-01",
    }

    # POST 요청
    response = client.post(url, data, format="json")

    # 응답 검증
    assert response.status_code == status.HTTP_201_CREATED
    assert CustomUser.objects.filter(email="testuser@example.com").exists()
    user = CustomUser.objects.get(email="testuser@example.com")
    assert user.full_name == "Test"
    assert user.birth_date.strftime("%Y-%m-%d") == "1990-01-01"
    assert user.registration_number == "123456"
