from collections import defaultdict
from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework import status
from attendance.models import Member, Attendance
from .serializers import (
    TeacherSerializer,
    FullMemberSerializer,
    MemberSerializer,
    AttendanceSerializer,
    AttendanceStatsSerializer,
    BulkAttendanceSerializer,
)
import pandas as pd


# 선생님 정보 조회
@method_decorator(csrf_exempt, name="dispatch")
# Django의 기본 CSRF 보호를 비활성화
#  CSRF 검사가 수행되지 않기 때문에 CSRF 토큰 없이 POST 요청을 보낼 수 있다.
# 실제 배포환경에서는 삭제 후 기본 Django의 기본 CSRF 보호 기능을 그대로 사용한다.
class TeachersViewSet(ViewSet):
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def list(self, request):
        user = request.user
        if user.is_authenticated:
            teacher_name = user.full_name  # 로그인된 경우 사용자 이름 반환
        else:
            teacher_name = "Failed Authentication"  # 로그인되지 않은 경우 처리
        return Response({"teacher_name": teacher_name})


# 학생 목록 조회 및 생성, 특정 학생 정보 조회 및 수정
@method_decorator(csrf_exempt, name="dispatch")
class MembersViewSet(ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    # 로그인한 사용자의 반에 속한 학생만 필터링
    def get_queryset(self):
        # user = "teacher1@example.com"
        user = self.request.user
        return Member.objects.filter(teacher__email=user)

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return MemberSerializer
        elif self.action in ["update", "create"]:
            return FullMemberSerializer
        return super().get_serializer_class()


# 단일 출석 데이터 목록 조회 및 생성
# 데코레이터와 인증 충돌 확인, login api에서는 post 요청 정상 작동
@method_decorator(csrf_exempt, name="dispatch")
class AttendanceViewSet(ModelViewSet):
    serializer_class = AttendanceSerializer
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTCookieAuthentication]

    def get_serializer_context(self):
        # context에 request 정보를 포함하여 Serializer에 전달
        return {"request": self.request}

    def get_queryset(self):
        # user = "token@toen.com"
        user = self.request.user
        queryset = Attendance.objects.filter(name__teacher__email=user)
        year = self.request.query_params.get("year", None)
        if year is not None:
            queryset = queryset.filter(date__year=year)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        attendance_data = defaultdict(list)

        for record in queryset:
            date_str = record.date.strftime("%Y-%m-%d")
            attendance_data[date_str].append(
                {"id": record.name.id, "attendance": record.attendance}
            )

        response_data = [
            {"date": date, "attendance": attendance}
            for date, attendance in attendance_data.items()
        ]

        return Response(response_data)

    def create(self, request, *args, **kwargs):
        serializer = BulkAttendanceSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["patch"], url_path="bulk-update")
    def bulk_update(self, request, *args, **kwargs):
        serializer = BulkAttendanceSerializer(data=request.data)

        if serializer.is_valid():
            updated_records = serializer.update(None, serializer.validated_data)
            return Response(
                self.get_serializer(updated_records, many=True).data,
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 출석부 통계
@method_decorator(csrf_exempt, name="dispatch")
class AttendanceStatsViewSet(ViewSet):
    serializer_class = AttendanceStatsSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def list(self, request, *args, **kwargs):
        user = self.request.user
        queryset = Attendance.objects.filter(name__teacher__email=user).values(
            "date",
            "attendance",
            "name_id",
        )

        # DataFrame 생성
        attendance_df = pd.DataFrame(queryset)

        if attendance_df.empty:  # 출석 정보가 없을 때 처리
            return Response(
                {
                    "result_stats": 0,
                }
            )

        # 출석 정보가 있는 경우 처리
        attendance_df["date"] = pd.to_datetime(attendance_df["date"])
        attendance_df["week"] = attendance_df["date"].dt.isocalendar().week
        weekly_stats = attendance_df.groupby("week")["attendance"].mean() * 100

        # weekly_stats가 비어 있으면 0으로 반환
        result_stats = int(weekly_stats.mean()) if not weekly_stats.empty else 0

        return Response(
            {
                "result_stats": result_stats,
            }
        )


# 공식 확인
# 데이터 추출식 : 매주 출석인원/전체인원*100의 평균값

# 1. 매주 True 비율을 구하고 그 평균을 내는 경우:
#
# 	•	각 주차별로 출석률을 계산하고, 그 출석률을 평균 내는 방식입니다.
# 	•	각 주의 출석률이 동일한 가중치로 반영되므로, 주차별로 출석한 인원에 차이가 있더라도 각 주차의 비율이 동일하게 반영됩니다.
# 	•	예를 들어, 어떤 주는 전체 학생이 10명이었고, 다른 주는 20명이었어도, 두 주의 출석률은 동일한 가중치로 평균 계산에 반영됩니다.
#
# 2. 전체 데이터에서 True 비율을 구하는 경우:
#
# 	•	전체 출석 데이터를 기준으로, 출석한 횟수(=True 값의 수)를 전체 데이터에서 비율로 계산합니다.
# 	•	이 방식은 주차별로 인원 차이를 무시하고, 전체 데이터에서의 True 값의 비율을 계산합니다.
# 	•	전체 학생 수와 출석 횟수의 총합을 사용하여 단일 비율을 계산합니다.

# 방법
# 1. groupby로 묶어서 주차별 true비율을 구하자
# 2. 그리고 평균을 내자


# 출석부 POST PATCH DELTE API
