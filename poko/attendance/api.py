from collections import defaultdict

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet, ViewSet
from attendance.models import Member, Attendance
from .serializers import FullMemberSerializer, MemberSerializer, AttendanceSerializer


# DRF에서는 모델을 기준으로 하나의 ViewSet으로 묶어서 구현
# https://wikidocs.net/197563


# 학생 목록 조회 및 생성, 특정 학생 정보 조회 및 수정


# @login_required
@method_decorator(csrf_exempt, name="dispatch")
class MembersViewSet(ModelViewSet):
    serializer_class = MemberSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    # 로그인한 사용자의 반에 속한 학생만 필터링
    def get_queryset(self):
        user = "teacher1@example.com"
        # user = self.request.user
        # return Member.objects.filter(teacher=user)
        return Member.objects.filter(teacher__email=user)

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return MemberSerializer
        elif self.action in ["update", "create"]:
            return FullMemberSerializer
        return super().get_serializer_class()


# 출석 데이터 목록 조회 및 생성
# @login_required
@method_decorator(csrf_exempt, name="dispatch")
class AttendanceViewSet(ModelViewSet):
    serializer_class = AttendanceSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def get_queryset(self):
        # user = self.request.uesr
        user = "teacher1@example.com"
        queryset = Attendance.objects.filter(name__teacher__email=user)
        # return Attendance.objects.filter(name__teacher__email=user)

        year = self.request.query_params.get("year", None)
        if year is not None:
            queryset = queryset.filter(date__year=year)
            # print(queryset)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        attendance_data = defaultdict(dict)

        for record in queryset:
            date_str = record.date.strftime("%Y-%m-%d")
            attendance_data[date_str][record.name.id] = record.attendance

        response_data = [
            {"date": date, "attendance": attendance}
            for date, attendance in attendance_data.items()
        ]

        return Response(response_data)


# 출석부 통계
class AttendanceStatisticsViewSet(ViewSet):
    pass


# 선생님 정보 조회
class TeachersViewSet(ViewSet):
    pass
