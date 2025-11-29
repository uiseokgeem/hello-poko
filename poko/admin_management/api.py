from collections import defaultdict

from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated

from accounts.models import CustomUser
from attendance.models import Attendance, Member
from report.models import UserCheck, Feedback
from .serializer import (
    WeeklyAttendanceSerializer,
    GroupAttendanceSerializer,
    MemberAttendanceSerializer,
    TeacherSerializer,
    HeadsSerializer,
    FeedbackWriteSerializer,
    FeedbackReadSerializer,
)

from django.db.models import Count, Q, Prefetch
from django.db import transaction
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet
from .permissions import IsAdminOrReadOnly


class AdminTeacherViewSet(ViewSet):
    # list
    def list(self, request):
        teachers = CustomUser.objects.all()
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)

    # head filter
    @action(detail=False, methods=["get"])
    def heads(self, request):
        heads = CustomUser.objects.filter(role="HEAD")
        serializer = HeadsSerializer(heads, many=True)
        return Response(serializer.data)

    # partial_update
    def partial_update(self, request, pk=None):
        teacher = get_object_or_404(CustomUser, pk=pk)
        serializer = TeacherSerializer(teacher, data=request.data, partial=True)

        if serializer.is_valid():
            with transaction.atomic():
                # HEAD -> ASSISTANT
                if teacher.role == "HEAD" and request.data.get("role") == "ASSISTANT":
                    CustomUser.objects.filter(head_teacher=teacher).update(
                        head_teacher=None,
                        class_name=None,
                    )
                # ASSISTANT -> HEAD
                elif teacher.role == "ASSISTANT" and request.data.get("role") == "HEAD":
                    teacher.head_teacher = None

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # destroy
    def destroy(self, request, pk=None):
        teacher = get_object_or_404(CustomUser, pk=pk)
        teacher.delete()
        return Response({"message": "삭제되었습니다."}, status=status.HTTP_204_NO_CONTENT)


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
                .values("name__teacher__class_name")  # class_name 별 분류
                .annotate(
                    attendance_count=Count("id", filter=Q(attendance=True)),  # 출석 수
                    absent_count=Count("id", filter=Q(attendance=False)),  # 결석 수
                )
                .order_by("name__teacher__class_name")  # 학년 기준 정렬
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


class AdminReportViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]
    queryset = UserCheck.objects.all()

    # 목양일지 목록 리스트에 정보 날짜 / 선생님 / 제목 / 작성 상태 API
    @action(detail=False, methods=["get"])
    def summary(self, request):
        reports = UserCheck.objects.all()

        teacher = request.query_params.get("teacher")
        if teacher:
            reports = reports.filter(teacher_id=teacher)

        student = request.query_params.get("student")
        if student:
            reports = reports.filter(membercheck__member__name__icontains=student)

        status_param = request.query_params.get("status")
        if status_param:
            reports = reports.filter(status=status_param)

        start_date = request.query_params.get("start_date")
        if start_date:
            reports = reports.filter(date__gte=start_date)

        end_date = request.query_params.get("end_date")
        if end_date:
            reports = reports.filter(date__lte=end_date)

        keyword = request.query_params.get("keyword")

        if keyword:
            reports = reports.filter(
                Q(issue__icontains=keyword)
                | Q(pray__pray_dept__icontains=keyword)
                | Q(pray__pray_group__icontains=keyword)
                | Q(pray__pray_teacher__icontains=keyword)
                | Q(membercheck__care_note__icontains=keyword)
            ).distinct()

        result = [
            {
                "id": report.id,
                "date": report.date.strftime("%Y-%m-%d"),
                "date_sunday": report.date_sunday.strftime("%Y-%m-%d"),
                "week_number": report.week_number,
                "teacher_name": report.teacher.full_name,
                "status": report.status,
            }
            for report in reports.order_by("-date")
        ]

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="detail")
    def admin_detail_report_data(self, request):
        report_id = request.query_params.get("id")
        nearest_sunday = request.query_params.get("nearestSunday")

        try:
            report = UserCheck.objects.get(id=report_id)
        except UserCheck.DoesNotExist:
            return Response({"detail": "Report not found"}, status=404)

        # 해당 교사의 학생 목록
        students = Member.objects.all()
        student_info_map = {s.id: {"name": s.name} for s in students}

        # 저장된 report 내 student 데이터
        member_checks = report.membercheck_set.all()
        student_data = {}
        for check in member_checks:
            sid = check.member_id
            student_data[sid] = {
                "id": sid,
                "name": student_info_map.get(sid, {}).get("name", ""),
                "attendance": Attendance.objects.filter(
                    name_id=sid, date=nearest_sunday
                )
                .first()
                .attendance
                if Attendance.objects.filter(name_id=sid, date=nearest_sunday).exists()
                else False,
                "gqs_attendance": check.gqs_attendance,
                "care_note": check.care_note,
            }

        # 응답 구조
        response_data = {
            "id": report.id,
            "title": report.title,
            "worship_attendance": report.worship_attendance,
            "meeting_attendance": report.meeting_attendance,
            "qt_count": report.qt_count,
            "pray_count": report.pray_count,
            "status": report.status,
            "pray": {
                "pray_dept": report.pray.pray_dept if report.pray else "",
                "pray_group": report.pray.pray_group if report.pray else "",
                "pray_teacher": report.pray.pray_teacher if report.pray else "",
            },
            "issue": report.issue,
            "students": student_data,
        }

        return Response(response_data, status=200)

    @action(detail=True, methods=["get"], url_path="feedback")
    def feedback(self, request, pk=None):  # pk = report_id
        report = get_object_or_404(UserCheck, pk=pk)
        fb = getattr(report, "feedback", None)
        return Response(FeedbackReadSerializer(fb).data if fb else None, status=200)


class AdminFeedbackViewSet(viewsets.ModelViewSet):
    """
    /admin-management/feedbacks/ (POST)
    /admin-management/feedbacks/{id}/ (PATCH, DELETE)
    """

    queryset = Feedback.objects.select_related("teacher", "user_check")
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return FeedbackWriteSerializer
        return FeedbackReadSerializer

    def create(self, request, *args, **kwargs):
        report_id = request.query_params.get("report")
        if not report_id:
            return Response({"detail": "report(query param)가 필요합니다."}, status=400)
        try:
            uc = UserCheck.objects.get(pk=report_id)
        except UserCheck.DoesNotExist:
            return Response({"detail": "Report(user_check) 를 찾을 수 없습니다."}, status=404)

        serializer = self.get_serializer(
            data=request.data, context={"request": request, "user_check": uc}
        )
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        out = FeedbackReadSerializer(instance).data
        return Response(out, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(FeedbackReadSerializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        instance: Feedback = self.get_object()
        uc = instance.user_check  # 연결된 UserCheck 인스턴스 확보

        with transaction.atomic():
            instance.delete()

            if uc:
                UserCheck.objects.filter(pk=uc.pk).update(status=1)

        return Response(status=status.HTTP_204_NO_CONTENT)
