# tests/test_custom_user.py
import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
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
    url = reverse("register")
    data = {
        "email": "testuser@example.com",
        "password1": "testpassword123",
        "password2": "testpassword123",
        "full_name": "Test",
        "birth_date": "1990-01-01",
        "registration_number": "123456",
    }

    response = client.post(url, data, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert CustomUser.objects.filter(email="testuser@example.com").exists()
    user = CustomUser.objects.get(email="testuser@example.com")
    assert user.full_name == "Test"
    assert user.birth_date.strftime("%Y-%m-%d") == "1990-01-01"
    assert user.registration_number == "123456"
