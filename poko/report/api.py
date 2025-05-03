from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from attendance.models import Member, Attendance
from report.serializers import ReportInitialDataSerializer


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
