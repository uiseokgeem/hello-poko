from collections import defaultdict
from datetime import datetime, timedelta, date  # date를 import

from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework import status
from accounts.models import CustomUser
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
from .utils import filter_by_year


# 선생님 정보 조회
@method_decorator(csrf_exempt, name="dispatch")
class TeachersViewSet(ViewSet):
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def list(self, request):
        user = request.user
        if user.is_authenticated:
            teacher_name = user.full_name  # 로그인된 사용자 이름
            teacher_id = user.id  # 로그인된 사용자 ID
            class_name = user.class_name
        else:
            teacher_name = "Failed Authentication"
            teacher_id = None  # 로그인되지 않은 경우 ID 없음

        # 응답에 ID와 이름을 함께 반환
        return Response({"id": teacher_id, "name": teacher_name, "class": class_name})

    # 새친구 등록 시 모든 선생님들의 리스트 반환
    @action(detail=False, methods=["get"], url_path="all-teachers")
    def get_all_teachers(self, request):
        teachers = CustomUser.objects.values("id", "full_name")  # 필요한 필드만 가져오기
        teacher_names = [
            {"id": teacher["id"], "name": teacher["full_name"]} for teacher in teachers
        ]
        return Response(teacher_names)


# 학생 목록 조회 및 생성, 특정 학생 정보 조회 및 수정
def get_sundays_for_year(year, end_date=None):
    """주어진 연도의 모든 일요일 리스트를 반환."""
    first_day_of_year = date(year, 1, 1)  # `date`를 사용
    # 해당 연도의 첫 번째 일요일 찾기
    first_sunday = first_day_of_year + timedelta(days=(6 - first_day_of_year.weekday()))
    sundays = []
    current_sunday = first_sunday
    while current_sunday.year == year:
        if end_date and current_sunday > end_date:  # end_date와 비교
            break
        sundays.append(current_sunday)
        current_sunday += timedelta(weeks=1)
    return sundays


@method_decorator(csrf_exempt, name="dispatch")
class MembersViewSet(ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    # 로그인한 사용자의 반에 속한 학생만 필터링
    def get_queryset(self):
        user = self.request.user

        # 정교사-부교사 확인
        if user.role == "HEAD":
            return Member.objects.filter(teacher__email=user)
        else:
            return Member.objects.filter(teacher__email=user.head_teacher)

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return MemberSerializer
        elif self.action in ["update", "create"]:
            return FullMemberSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        student_data = request.data
        nearest_sunday_str = student_data.pop("initial_attendance_date", None)

        if nearest_sunday_str:
            nearest_sunday = datetime.strptime(
                nearest_sunday_str, "%Y-%m-%d"
            ).date()  # `date` 타입으로 변환
        else:
            return Response(
                {"error": "initial_attendance_date is required"}, status=400
            )

        # 학생 생성
        serializer = self.get_serializer(data=student_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Attendance 모델에 기본 출석 데이터 생성
        member_instance = serializer.instance

        # 해당 연도의 첫 일요일부터 nearest_sunday 이전의 모든 일요일 리스트 생성
        year = nearest_sunday.year
        sundays = get_sundays_for_year(year, end_date=nearest_sunday)

        # Attendance에 기본 출석 데이터 저장
        Attendance.objects.bulk_create(
            [
                Attendance(name=member_instance, attendance=False, date=sunday)
                for sunday in sundays
            ]
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)


# 단일 출석 데이터 목록 조회 및 생성
# 데코레이터와 인증 충돌 확인, login api에서는 post 요청 정상 작동
@method_decorator(csrf_exempt, name="dispatch")
class AttendanceViewSet(ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    # context에 request 정보를 포함하여 Serializer에 전달
    def get_serializer_context(self):
        return {"request": self.request}

    def get_queryset(self):
        user = self.request.user
        user_email = user.email if user.role == "HEAD" else user.head_teacher.email
        if user_email is None:
            return Attendance.objects.none()

        queryset = Attendance.objects.filter(name__teacher__email=user_email)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = filter_by_year(self.get_queryset(), self.request)
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
            data=request.data,
            context={"queryset": self.get_queryset()},
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
        user_email = (
            user.email
            if user.role == "HEAD"
            else (user.head_teacher.email if user.head_teacher else None)
        )

        queryset = Attendance.objects.filter(name__teacher__email=user_email).values(
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
