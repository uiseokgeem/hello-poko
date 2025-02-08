from collections import defaultdict

from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from attendance.models import Attendance, Member
from .serializer import (
    WeeklyAttendanceSerializer,
    GroupAttendanceSerializer,
    MemberAttendanceSerializer,
)

from django.db.models import Count, Q, Prefetch
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class WeeklyAttendanceViewSet(ModelViewSet):
    serializer_class = WeeklyAttendanceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def get_queryset(self):
        year = self.request.query_params.get("year", None)
        if year is not None:
            return Attendance.objects.filter(date__year=year)
        return Attendance.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        aggregated_data = (
            queryset.values("date")
            .annotate(
                출석=Count("id", filter=Q(attendance=True)),
                결석=Count("id", filter=Q(attendance=False)),
            )
            .order_by("date")
        )

        response_data = [
            {"date": record["date"], "type": "출석", "value": record["출석"]}
            for record in aggregated_data
        ] + [
            {"date": record["date"], "type": "결석", "value": record["결석"]}
            for record in aggregated_data
        ]

        return Response(response_data)


class GroupAttendanceViewSet(ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = GroupAttendanceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    @action(detail=False, methods=["get"], url_path="attendance-by-week")
    def attendance_by_week(self, request):
        # 쿼리 파라미터에서 날짜 가져오기
        week = request.query_params.get("week")

        if not week:
            return Response({"error": "Week parameter is required"}, status=400)

        try:
            # 요청된 날짜를 필터링
            attendance_data = (
                Attendance.objects.filter(date=week)  # 요청된 날짜 필터링
                .values("name__grade")  # 학년 기준 그룹화
                .annotate(
                    attendance_count=Count("id", filter=Q(attendance=True)),  # 출석 수
                    absent_count=Count("id", filter=Q(attendance=False)),  # 결석 수
                )
                .order_by("name__grade")  # 학년 기준 정렬
            )

            return Response(attendance_data)  # 결과 반환

        except Exception as e:
            print("Error processing attendance data:", str(e))
            return Response(
                {"error": "An error occurred while processing attendance data."},
                status=500,
            )


class MemberAttendanceViewSet(ModelViewSet):
    serializer_class = MemberAttendanceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def get_serializer_context(self):
        # context에 request 정보를 포함하여 Serializer에 전달
        return {"request": self.request}

    def get_queryset(self):
        year = self.request.query_params.get("year", None)
        queryset = Attendance.objects.all()  # 기본 쿼리셋 설정

        if year:
            queryset = queryset.filter(date__year=year)

        # Member와 관련된 데이터를 함께 가져오도록 최적화
        queryset = queryset.select_related("name").prefetch_related(
            Prefetch("name", queryset=Member.objects.all())
        )

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Print the raw queryset for debugging
        # print("Queryset before grouping:")
        # for record in queryset:
        #     print(
        #         {
        #             "id": record.id,
        #             "name_id": record.name.id,
        #             "name": record.name.name,
        #             "grade": record.name.grade,
        #             "gender": record.name.gender,
        #             "date": record.date,
        #             "attendance": record.attendance,
        #         }
        #     )

        # 데이터를 날짜별로 그룹화
        attendance_data = defaultdict(list)

        for record in queryset:
            grouped_record = {
                "id": record.name.id,
                "name": record.name.name,
                "grade": record.name.grade,
                "gender": record.name.gender,
                "attendance": record.attendance,
            }
            attendance_data[record.date.strftime("%Y-%m-%d")].append(grouped_record)

        # 학생 데이터 생성
        students = []
        seen_students = set()  # 중복 방지용

        for record in queryset:
            if record.name.id not in seen_students:
                seen_students.add(record.name.id)
                students.append(
                    {
                        "id": record.name.id,
                        "name": record.name.name,
                        "grade": record.name.grade,
                        "gender": record.name.gender,
                    }
                )

        # 응답 데이터 생성
        response_data = {
            "data": [
                {"date": date, "attendance": attendance}
                for date, attendance in attendance_data.items()
            ],
            "students": students,
        }

        # Print the final response data for debugging
        # print("Response Data:")
        # print(response_data)

        return Response(response_data)


class WeeklyListView(ListAPIView):
    def get(self, request, *args, **kwargs):
        year = self.request.query_params.get("year", None)
        if year:
            # 선택한 연도의 출석 데이터 필터링
            attendance_dates = (
                Attendance.objects.filter(date__year=year)
                .values_list("date", flat=True)
                .distinct()
            )
        else:
            attendance_dates = Attendance.objects.values_list(
                "date", flat=True
            ).distinct()

        sorted_dates = sorted(attendance_dates, reverse=True)

        return Response(sorted_dates)
