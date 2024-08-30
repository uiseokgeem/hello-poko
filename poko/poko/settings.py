"""
Django settings for poko project.

Generated by 'django-admin startproject' using Django 4.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""
import os
import sys
from pathlib import Path
from environ import Env
from django.core.exceptions import ImproperlyConfigured
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env = Env()
ENV_PATH = BASE_DIR / ".env"
if ENV_PATH.exists():
    print(f".env read success! {ENV_PATH}")
    with ENV_PATH.open(encoding="utf-8") as f:
        env.read_env(f, overwrite=True)
else:
    print(".env read fail!", ENV_PATH)

# boto3 환경변수
EMAIL_BACKEND = env("EMAIL_BACKEND")
print(EMAIL_BACKEND)
AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
print(AWS_ACCESS_KEY_ID)
AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
print(AWS_SECRET_ACCESS_KEY)
AWS_SES_REGION_NAME = env("AWS_SES_REGION_NAME")
print(AWS_SES_REGION_NAME)
AWS_SES_REGION_ENDPOINT = env("AWS_SES_REGION_ENDPOINT")
print(AWS_SES_REGION_ENDPOINT)
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL")
print(DEFAULT_FROM_EMAIL)
USE_SES_V2 = env.bool("USE_SES_V2", default=False)
print(USE_SES_V2)
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = os.environ.get(
    "SECRET_KEY", "django-insecure-^*)3u$zud1z2dfngqh7fdb)xp$cueimjz_0r(4q35l-+gwhme-"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = int(os.environ.get("DEBUG", 1))

if os.environ.get("DJANGO_ALLOWED_HOSTS"):
    ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split()
    print("ALLOWED_HOSTS environ 확인", ALLOWED_HOSTS)

else:
    print("else 확인")
    ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]", "0.0.0.0:8000"]

print("최종 ALLOWED_HOSTS 확인", ALLOWED_HOSTS)
# Application definition

INSTALLED_APPS = [
    # django apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "rest_framework",
    "rest_framework.authtoken",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "corsheaders",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    # thrid apps
    "django_extensions",
    "debug_toolbar",
    # local apps
    "common",
    "checking",
    "report",
    "graph",
    "accounts",
    "allauth.socialaccount.providers.google",
    # "blog",  # dfr test note : OS 업데이트 후 삭제 됨
]

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    # "django.middleware.common.CommonMiddleware", 중복
    # "common.middleware.LoginRequiredMiddleware",
]

ROOT_URLCONF = "poko.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            os.path.join(BASE_DIR, "checking", "templates"),
            os.path.join(BASE_DIR, "templates"),
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "poko.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", os.path.join(BASE_DIR / "db.sqlite3")),
        "USER": os.environ.get("SQL_USER", "user"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "ko-kr"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")

MEDIA_URL = "/media/"  # 웹에서 첨부 파일 접근 시 url로 사용.
MEDIA_ROOT = BASE_DIR / "media"  # 첨부한 파일의 저장경로로 사용.

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

INTERNAL_IPS = ["127.0.0.1"]

AUTH_USER_MODEL = "accounts.CustomUser"

# CustomUser 모델에서 사용자 이름 대신 이메일을 사용
SITE_ID = 1
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "none"
USERNAME_FIELD = "email"
REQUIRED_FIELDS = ["email"]  # 회원가입 필드에 이메일을 추가

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)

# CORS 허용 설정
CORS_ALLOWED_ORIGINS = [
    # "http://localhost:3000",  # React 앱의 주소
    # "http://localhost:80",
    "http://poko-dev.com",  # 도메인 이름 (http 사용)
    "https://poko-dev.com",  # 도메인 이름 (https 사용)
]
CORS_ALLOW_CREDENTIALS = True

# 배포시 설정(csrf 토큰 설정), 개발환경에서는 admin login issue로 사용하지 말 것
CSRF_TRUSTED_ORIGINS = [
    "https://www.poko-dev.com",
    "https://poko-dev.com",
    "http://localhost:3000",
    "http://localhost:80",
]
CSRF_COOKIE_SECURE = False

# session 쿠키 기본 설정
SESSION_ENGINE = "django.contrib.sessions.backends.db"
SESSION_COOKIE_NAME = "sessionid"
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"

# 로그인 성공후 이동하는 URL
LOGIN_REDIRECT_URL = "/"

# middleware login 인증이 아닌 경우 이동하는 URL
LOGIN_URL = "login/"

# Django REST framework 인증/권한 설정
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny"),
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ],
}

#        "rest_framework_simplejwt.authentication.JWTAuthentication",

# dj-rest-auth 설정
# REST_USE_JWT = True
REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_HTTPONLY": True,
    "JWT_AUTH_REFRESH_COOKIE": "refresh_token",
    "JWT_AUTH_COOKIE_USE_CSRF": True,
    "SESSION_LOGIN": False,
}

JWT_AUTH_COOKIE = "my-app-auth"
JWT_AUTH_REFRESH_COOKIE = "my-refresh-token"
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# email
EMAIL_HOST = env.str(var="EMAIL_HOST", default=None)

# 환경변수로 읽어온 EMAIL_HOST가 None이면 console.EmailBackend를 수행!
if DEBUG and EMAIL_HOST is None:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    try:
        EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
        EMAIL_PORT = env.int("EMAIL_PORT")
        EMAIL_USE_SSL = env.bool("EMAIL_USE_SSL", default=False)
        EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=False)
        EMAIL_HOST_USER = env.str("EMAIL_HOST_USER")
        EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD")
        DEFAULT_FROM_EMAIL = env.str("DEFAULT_FROM_EMAIL")
    except ImproperlyConfigured as e:  # 참조시 default 값을 지정하지 않았기에 미설정 오류가 발생할 수 있다.
        print(
            "default 값을 지정 하지않아 발생한 미설정 오류 :", e, file=sys.stderr
        )  # 미설정 시 오류 내용을 화면에 출력
        EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
# 계정정보는 프로젝트에 하드코딩이 아닌 .env을통해 주입 받는다
