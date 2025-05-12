from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from attendance.models import Member, Attendance
from report.models import UserCheck, Pray, MemberCheck
from report.serializers import ReportInitialDataSerializer, UserCheckSerializer


# 목양일지 작성 시 필요한 초기데이터를 관리하는 API viewset
# attednace model 사용
class ReportInitialDataViewSet(ViewSet):
    serializer_class = ReportInitialDataSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def list(self, request):
        teacher = request.user
        nearest_sunday = request.query_params.get("nearestSunday")

        students = Member.objects.filter(teacher=teacher)
        attendance_qs = Attendance.objects.filter(
            name__in=students, date=nearest_sunday
        )

        # 출석 정보 딕셔너리로 구성
        attendance_map = {}
        for attendance in attendance_qs:
            student_id = attendance.name_id
            is_attended = attendance.attendance
            attendance_map[student_id] = is_attended

        # 학생별 출석 정보 조합
        student_data = []
        for student in students:
            student_data.append(
                {
                    "id": student.id,
                    "name": student.name,
                    "attendance": attendance_map.get(student.id, False),
                }
            )

        result = {
            "students": student_data,
        }

        serializer = ReportInitialDataSerializer(result)
        return Response(serializer.data)


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
                "title": report.title,
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
            pray_count=data.get("prayer_count"),
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
            pray_count=data.get("prayer_count"),
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
