# # 초기 gpt 생성코드
# # orm 사용 총 3회
#
# from rest_framework.response import Response
# from rest_framework.viewsets import ViewSet
# from attendance.models import Attendance
# from django.db.models import Count, Q
# from datetime import timedelta
# from django.utils import timezone
#
#
# class AttendanceStatsViewSet(ViewSet):
#     def list(self, request):
#         # 1. 모든 주간의 출석 데이터를 가져옴
#         attendance_stats = {}
#
#         # 주차별 데이터 추출 (모든 출석 기록에서 주차별로 그룹화)
#         all_weeks = Attendance.objects.dates("date", "week")
#
#         for week_start in all_weeks:
#             week_end = week_start + timedelta(days=6)
#
#             # 주차별 출석 데이터 필터링
#             week_attendance = Attendance.objects.filter(
#                 date__range=[week_start, week_end]
#             )
#             total_students = week_attendance.count()
#             present_students = week_attendance.filter(attendance=True).count()
#
#             # 주차별 출석률 계산
#             if total_students > 0:
#                 attendance_rate = (present_students / total_students) * 100
#                 attendance_stats[week_start] = attendance_rate
#
#         # 2. 전체 주차의 출석률 평균 계산
#         if attendance_stats:
#             average_rate = sum(attendance_stats.values()) / len(attendance_stats)
#         else:
#             average_rate = 0
#
#         # 3. 결과 반환
#         return Response(
#             {
#                 "average_attendance_rate": average_rate,  # 전체 주차의 평균 출석률
#                 "weekly_attendance_stats": attendance_stats,  # 주차별 출석률
#             }
#         )
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ViewSet

# # 1. 모든 주간의 출석 데이터를 가져옴
# attendance_stats = {}
#
# # 주차별 데이터 추출 (모든 출석 기록에서 주차별로 그룹화)
# all_weeks = Attendance.objects.dates("date", "week")  # ORM을 한번 사용
#
# for week in all_weeks:
#     print(week.name, week.attendance)

# return Response({"all_weeks": all_weeks})


from attendance.models import Attendance
import pandas as pd


@method_decorator(csrf_exempt, name="dispatch")
class AttendanceStatsViewSet(ViewSet):
    permission_classes = [
        AllowAny
    ]  # TypeError: 'BasePermissionMetaclass' object is not iterable
    # pandas를 이용한 통계

    # ORM으로 모든 출석 데이터 가져오기
    attendance_qs = Attendance.objects.all().values("date", "attendance", "name_id")
    # 특정 필드만 필요할 때: 예를 들어, 통계를 계산하거나 특정 필드 값만을 처리할 때는 values()를 사용해 불필요한 필드를 제외하고 필요한 데이터만 가져옵니다.
    # 성능 최적화: 데이터를 처리할 때 ORM 객체가 필요 없고, 특정 필드값만 다룬다면 values()를 사용하여 더 적은 데이터 전송과 더 빠른 쿼리 실행을 할 수 있습니다.
    # 수치만 나타내고 개별 데이터 별로 수정할 일이 없기 때문에 name_id 필드는 생략한다.

    # QuerySet을 pandas DataFrame으로 변환
    attendance_df = pd.DataFrame(list(attendance_qs))

    # 날짜를 datetime 형식으로 변환
    attendance_df["date"] = pd.to_datetime(attendance_df["date"])

    # 주차별로 그룹화
    attendance_df["week"] = attendance_df["date"].dt.isocalendar().week

    # 주차별 출석률 계산 (True/False 값을 이용)
    weekly_stats = attendance_df.groupby("week")["attendance"].mean() * 100

    result_stats = weekly_stats.mean()

    print(weekly_stats)
