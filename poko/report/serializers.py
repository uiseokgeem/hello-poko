from django.db.models import QuerySet
from rest_framework import serializers
from report.models import UserCheck, Pray, MemberCheck


class TitleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCheck
        fields = [
            "id",
            "teacher",
            "title",
        ]

    @staticmethod
    def get_optimized_queryset(request) -> QuerySet[UserCheck]:
        return UserCheck.objects.filter(teacher=request.user).only("id", "title")


class MemberAttendanceSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    attendance = serializers.BooleanField()


class ReportInitialDataSerializer(serializers.Serializer):
    # nearest_sunday = serializers.DateField()
    students = MemberAttendanceSerializer(many=True)


class PraySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pray
        fields = ["pray_dept", "pray_group", "pray_teacher"]


class MemberCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberCheck
        fields = ["member", "gqs_attendance", "care_note"]


class UserCheckSerializer(serializers.ModelSerializer):
    pray = PraySerializer()
    students = MemberCheckSerializer(source="membercheck_set", many=True)

    class Meta:
        model = UserCheck
        fields = [
            "id",
            "title",
            "worship_attendance",
            "meeting_attendance",
            "qt_count",
            "pray_count",
            "status",
            "pray",
            "issue",
            "students",
        ]

    def create(self, validated_data):
        pray_data = validated_data.pop("pray")
        students_data = validated_data.pop("membercheck_set")

        user_check = UserCheck.objects.create(**validated_data)
        Pray.objects.create(user_check=user_check, **pray_data)

        for student_data in students_data:
            MemberCheck.objects.create(user_check=user_check, **student_data)

        return user_check
