from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from attendance.models import Member, Attendance
from report.models import UserCheck, Pray, MemberCheck
from report.serializers import (
    ReportInitialDataSerializer,
    UserCheckSerializer,
    ReportDetailSerializer,
)


# 목양일지 작성 시 필요한 초기데이터를 관리하는 API viewset
# attednace model 사용
class ReportInitialDataViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def get_serializer_class(self):
        if self.action == "detail_report_data":
            return ReportDetailSerializer
        return ReportInitialDataSerializer

    def get_queryset(self):
        user = self.request.user
        # 정교사-부교사 확인
        if user.role == "HEAD":
            return Member.objects.filter(teacher__email=user)
        else:
            return Member.objects.filter(teacher__email=user.head_teacher)

    def list(self, request):
        nearest_sunday = request.query_params.get("nearestSunday")
        students = self.get_queryset()

        attendance_qs = Attendance.objects.filter(
            name__in=students, date=nearest_sunday
        )

        # 출석 정보 딕셔너리로 구성
        attendance_map = {}
        for attendance in attendance_qs:
            student_id = attendance.name_id
            is_attended = attendance.attendance
            attendance_map[student_id] = is_attended

        # 딕셔너리 구조로 students 구성
        student_data = {
            student.id: {
                "id": student.id,
                "name": student.name,
                "attendance": attendance_map.get(student.id, False),
            }
            for student in students
        }

        result = {
            "students": student_data,
        }

        serializer = ReportInitialDataSerializer(result)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="detail")
    def detail_report_data(self, request):
        user = request.user
        report_id = request.query_params.get("id")
        nearest_sunday = request.query_params.get("nearestSunday")

        try:
            report = UserCheck.objects.get(id=report_id, teacher=user)
        except UserCheck.DoesNotExist:
            return Response({"detail": "Report not found"}, status=404)

        # 해당 교사의 학생 목록
        students = self.get_queryset()
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

    # URL: /api/report/initial/check-exist/?nearestSunday=2025-06-16
    @action(detail=False, methods=["get"], url_path="check-exist")
    def check_exist(self, request):
        nearest_sunday = request.query_params.get("nearestSunday")
        students = self.get_queryset()

        exist_attendance = Attendance.objects.filter(
            name__in=students, date=nearest_sunday
        ).exists()

        if not exist_attendance:
            return Response(
                {"detail": "먼저 출석 정보를 입력해주세요."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        exist_report = UserCheck.objects.filter(
            date__in=nearest_sunday, teacher=request.user
        ).exists()

        if exist_report:
            return Response(
                {"detail": "이미 해당 주차의 목양일지가 존재합니다. 상세페이지의 수정하기를 사용하세요."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"detail": "작성 가능한 상태입니다."},
            status=status.HTTP_200_OK,
        )


# 목양일지 CRUD ViewSet
class ReportViewSet(viewsets.ModelViewSet):
    queryset = UserCheck.objects.all()
    serializer_class = UserCheckSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    # URL: /api/report/summary/
    @action(detail=False, methods=["get"])
    def summary(self, request):
        user = request.user
        year = request.query_params.get("year")

        # user 기준 등록 된 목양일지 조회
        reports = UserCheck.objects.filter(teacher=user)
        if year:
            reports = reports.filter(date__year=year)

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

    # POST : /api/report/draft/
    @action(detail=False, methods=["post"])
    def draft(self, request):
        user = request.user
        data = request.data
        nearest_sunday = request.query_params.get("nearestSunday")

        user_check = UserCheck.objects.create(
            teacher=user,
            # title : 제목을 nearestSunday으로 자동화할 경우 불필요한 필드
            title=nearest_sunday,
            worship_attendance=data.get("worship_attendance"),
            meeting_attendance=data.get("meeting_attendance"),
            qt_count=data.get("qt_count"),
            pray_count=data.get("pray_count"),
            issue=data.get("issue"),
            status=data.get("status"),
        )

        pray_data = data.get("pray", {})
        Pray.objects.create(
            user_check=user_check,
            pray_dept=pray_data.get("pray_dept"),
            pray_group=pray_data.get("pray_group"),
            pray_teacher=pray_data.get("pray_teacher"),
        )

        for student in data.get("students", []):
            MemberCheck.objects.create(
                member_id=student.get("member"),
                user_check=user_check,
                gqs_attendance=student.get("gqs_attendance"),
                care_note=student.get("care_note"),
            )

        return Response({"message": "임시 저장 완료"}, status=status.HTTP_201_CREATED)

    # URL: POST /api/report/
    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        nearest_sunday = request.query_params.get("nearestSunday")

        user_check = UserCheck.objects.create(
            teacher=user,
            # title : 제목을 nearestSunday으로 자동화할 경우 불필요한 필드
            title=nearest_sunday,
            worship_attendance=data.get("worship_attendance"),
            meeting_attendance=data.get("meeting_attendance"),
            qt_count=data.get("qt_count"),
            pray_count=data.get("pray_count"),
            issue=data.get("issue"),
            status=data.get("status"),
        )

        pray_data = data.get("pray", {})
        Pray.objects.create(
            # 생성한 user check를 pray model에 연결
            user_check=user_check,
            pray_dept=pray_data.get("pray_dept"),
            pray_group=pray_data.get("pray_group"),
            # pray_teacher -> pray_user로 변경 필요
            pray_teacher=pray_data.get("pray_teacher"),
        )

        for student in data.get("students", []):
            MemberCheck.objects.create(
                member_id=student.get("member"),
                user_check=user_check,
                gqs_attendance=student.get("gqs_attendance"),
                care_note=student.get("care_note"),
            )

        return Response(
            {"message": "목양일지가 성공적으로 저장되었습니다."}, status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        user = request.user
        report_id = kwargs.get("pk")
        data = request.data
        nearest_sunday = request.query_params.get("nearestSunday")

        try:
            user_check = UserCheck.objects.get(id=report_id, teacher=user)
        except UserCheck.DoesNotExist:
            return Response({"detail": "Report not found"}, status=404)

        # UserCheck 업데이트
        user_check.title = nearest_sunday
        user_check.worship_attendance = data.get("worship_attendance")
        user_check.meeting_attendance = data.get("meeting_attendance")
        user_check.qt_count = data.get("qt_count")
        user_check.pray_count = data.get("pray_count")
        user_check.issue = data.get("issue")
        user_check.status = data.get("status")
        user_check.save()

        # Pray 업데이트
        pray_data = data.get("pray", {})
        if hasattr(user_check, "pray"):
            user_check.pray.pray_dept = pray_data.get("pray_dept")
            user_check.pray.pray_group = pray_data.get("pray_group")
            user_check.pray.pray_teacher = pray_data.get("pray_teacher")
            user_check.pray.save()
        else:
            Pray.objects.create(
                user_check=user_check,
                pray_dept=pray_data.get("pray_dept"),
                pray_group=pray_data.get("pray_group"),
                pray_teacher=pray_data.get("pray_teacher"),
            )

        # 기존 MemberCheck 삭제 후 재생성
        user_check.membercheck_set.all().delete()
        for student in data.get("students", []):
            MemberCheck.objects.create(
                member_id=student.get("member"),
                user_check=user_check,
                gqs_attendance=student.get("gqs_attendance"),
                care_note=student.get("care_note"),
            )

        return Response({"message": "목양일지가 수정되었습니다."}, status=status.HTTP_200_OK)
