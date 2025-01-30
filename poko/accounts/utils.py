from rest_framework_simplejwt.tokens import RefreshToken


def generate_jwt_token(user, login_type="default"):
    # user 객체를 통해 리프래시 토큰 생성
    refresh = RefreshToken.for_user(user)
    refresh["login_type"] = login_type

    return {
        "poko-auth": str(refresh.access_token),
        "refresh_token": str(refresh),
    }
