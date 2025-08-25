from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    읽기는 로그인 사용자 모두 허용, 쓰기는 ADMIN(또는 is_staff)만 허용.
    프로젝트 정책에 맞게 조건 조정 가능.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (getattr(user, "role", "") == "ADMIN" or user.is_staff)
        )
