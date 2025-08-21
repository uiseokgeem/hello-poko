from rest_framework import serializers

from accounts.models import CustomUser
from attendance.models import Attendance
from report.models import Feedback


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
        fields = [
            "id",
            "full_name",
            "email",
            "class_name",
            "head_teacher",
            "role",
        ]


class HeadsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "full_name",
            "class_name",
            "head_teacher",
            "role",
        ]


class FeedbackWriteSerializer(serializers.ModelSerializer):
    """
    생성/수정용. 프론트의 body <-> 모델의 feedback 필드 매핑.
    user_check는 query param(report)로 받고, create에서 주입.
    """

    body = serializers.CharField(source="feedback", max_length=500)

    class Meta:
        model = Feedback
        fields = ["id", "body"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request = self.context.get("request")
        # POST에서만 OneToOne 중복 체크
        if request and request.method == "POST":
            user_check = self.context.get("user_check")
            if not user_check:
                raise serializers.ValidationError("유효하지 않은 report(user_check)")
            if hasattr(user_check, "feedback"):
                raise serializers.ValidationError("해당 보고서에는 이미 피드백이 존재합니다.")
        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        author = request.user
        user_check = self.context.get("user_check")
        return Feedback.objects.create(
            teacher=author,
            user_check=user_check,
            **validated_data,
        )

    def update(self, instance, validated_data):
        # body(source="feedback") → validated_data에는 "feedback" 키로 들어옵니다.
        if "feedback" in validated_data:
            instance.feedback = validated_data["feedback"]
        # 수정시각을 date에 반영하지 않으려면 아래 라인 생략
        # instance.date = timezone.now()
        instance.save(update_fields=["feedback"])  # date 갱신 안 할거면 feedback만
        return instance


class FeedbackReadSerializer(serializers.ModelSerializer):
    """
    조회용. 읽기 편한 필드명으
    """

    author_name = serializers.CharField(source="teacher.full_name", read_only=True)
    role = serializers.CharField(source="teacher.role", read_only=True)
    report_id = serializers.CharField(source="user_check.id", read_only=True)
    body = serializers.CharField(source="feedback", read_only=True)
    created_at = serializers.DateTimeField(source="date", read_only=True)

    class Meta:
        model = Feedback
        fields = ["id", "report_id", "author_name", "role", "body", "created_at"]
