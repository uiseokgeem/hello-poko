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


class BulkAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField(format="%Y-%m-%d")
    attendance = serializers.ListField(
        child=serializers.DictField(child=serializers.BooleanField())
    )
    # ModelSerializer 대신 Serializer를 사용한 이유
    # 요청으로 오는 attendance 필드가 일반적인 모델 필드와 다르기 때문에
    # Serializer를 사용하여 그 데이터를 수동으로 처리할 수 있도록 설계한다.

    def create(self, validated_data):
        date = validated_data.get("date")
        attendance_list = validated_data.get("attendance")

        for attendance_data in attendance_list:
            member_id = attendance_data.get("id")
            attendance_status = attendance_data.get("attendance")

            Attendance.objects.create(
                date=date,
                name_id=member_id,
                attendance=attendance_status,
            )

        return validated_data


class AttendanceStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = [
            "id",
            "attendance",
            "date",
        ]
