from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework.exceptions import AuthenticationFailed


class CustomJWTCookieAuthentication(JWTCookieAuthentication):
    def authenticate(self, request):
        # 기존 쿠키 기반 인증 수행
        result = super().authenticate(request)
        if result is None:
            return None

        user, token = result

        # 토큰의 login_type 확인
        login_type = token.get("login_type", None)
        if not login_type:
            raise AuthenticationFailed("Invalid token: Missing login_type")

        # 현재 API가 기본 로그인만 허용한다고 가정 (필요에 따라 수정 가능)
        if login_type != "default":
            raise AuthenticationFailed("Invalid token: Incorrect login type")

        return user, token
