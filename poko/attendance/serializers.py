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

        # 요청한 사용자 정보 가져오기
        user = self.context["request"].user  # DRF에서 context를 통해 현재 요청의 사용자 가져오기

        # 사용자와 날짜 조건으로 데이터 확인
        # issue2 학생별로 조회하여 데이터가 있는지 수정
        if Attendance.objects.filter(name__teacher=user, date=date).exists():
            raise serializers.ValidationError(
                {"detail": f"이미 {date}의 출석 데이터가 저장되어있습니다."},
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

        # PATCH 요청: 출석 데이터를 수정하는 메서드

    def update(self, instance, validated_data):
        date = validated_data.get("date")
        attendance_list = validated_data.get("attendance")

        updated_records = []

        for attendance_data in attendance_list:
            member_id = attendance_data.get("id")
            attendance_status = attendance_data.get("attendance")

            # 해당 학생의 출석 데이터를 찾음
            attendance_record = Attendance.objects.filter(
                name_id=member_id, date=date
            ).first()

            if attendance_record:
                # 출석 상태 업데이트
                attendance_record.attendance = attendance_status
                attendance_record.save()
                updated_records.append(attendance_record)

        return updated_records


class AttendanceStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = [
            "id",
            "attendance",
            "date",
        ]
