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


class AttendanceItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()  # 학생 ID
    attendance = serializers.BooleanField()  # 출석 여부


class BulkAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField(format="%Y-%m-%d")
    attendance = serializers.ListField(
        child=AttendanceItemSerializer()  # 중첩 Serializer 사용
    )
    # ModelSerializer 대신 Serializer를 사용한 이유
    # 요청으로 오는 attendance 필드가 일반적인 모델 필드와 다르기 때문에
    # Serializer를 사용하여 그 데이터를 수동으로 처리할 수 있도록 설계한다.

    def create(self, validated_data):
        date = validated_data.get("date")
        attendance_list = validated_data.get("attendance")

        print(date)

        if Attendance.objects.filter(date=date).exists():
            raise serializers.ValidationError(
                {"detail": f"{date}의 출석 데이터가 저장되어있습니다."},
            )

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
