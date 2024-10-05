from rest_framework import serializers
from attendance.models import Member, Attendance
from accounts.models import CustomUser


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "full_name"]


class FullMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            "id",
            "name",
            "grade",
            "gender",
            "attendance_count",
            "absent_count",
            "teacher",
        ]


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            "id",
            "name",
        ]


class AttendanceSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Attendance
        fields = [
            "id",
            "name",
            "attendance",
            "date",
        ]


class AttendanceStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = [
            "id",
            "attendance",
            "date",
        ]


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
