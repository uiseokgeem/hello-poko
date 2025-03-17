from rest_framework import serializers

from accounts.models import CustomUser
from attendance.models import Attendance


class WeeklyAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField(format="%Y-%m-%d")
    type = serializers.CharField()
    value = serializers.IntegerField()


class GroupAttendanceSerializer(serializers.ModelSerializer):
    grade = serializers.CharField(source="name.grade")  # 외래키를 통해 Member의 grade 필드 참조

    class Meta:
        model = Attendance
        fields = ("grade", "attendance", "date")  # 필요한 필드만 선택


class MemberAttendanceSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Attendance
        fields = [
            "id",
            "name",
            "attendance",
            "date",
        ]


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "full_name", "email", "class_name", "role"]
