from django.db import transaction
from rest_framework import serializers

from accounts.models import CustomUser
from attendance.models import Attendance, Member
from report.models import Feedback, UserCheck


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
    head_teacher_name = serializers.CharField(
        source="head_teacher.full_name", read_only=True
    )

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "full_name",
            "email",
            "class_name",
            "head_teacher",  # 기존 그대로 유지 (id)
            "head_teacher_name",  # 화면용
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

    body = serializers.CharField(
        source="feedback",
        allow_blank=False,
        trim_whitespace=True,
        required=True,
    )

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
        with transaction.atomic():
            feedback = Feedback.objects.create(
                teacher=author,
                user_check=user_check,
                **validated_data,
            )
            if user_check and user_check.status != 2:
                UserCheck.objects.filter(pk=user_check.pk).update(status=2)
            return feedback

    def update(self, instance, validated_data):
        feedback_text = validated_data.get("feedback", instance.feedback)

        with transaction.atomic():
            instance.feedback = feedback_text
            instance.save(update_fields=["feedback"])

            uc = instance.user_check
            if uc and uc.status != 2:
                UserCheck.objects.filter(pk=uc.pk).update(status=2)

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


class AdminStudentSerializer(serializers.ModelSerializer):
    # 기존처럼 teacher라는 키로 문자열 내려줌 (프론트 컬럼 유지 가능)
    teacher = serializers.SerializerMethodField()
    assistant_teacher = serializers.SerializerMethodField()

    teacher_id = serializers.IntegerField(source="teacher.id", read_only=True)
    class_name = serializers.CharField(source="teacher.class_name", read_only=True)

    birth_date = serializers.DateField(
        format="%Y-%m-%d", required=False, allow_null=True
    )

    class Meta:
        model = Member
        fields = [
            "id",
            "name",
            "birth_date",
            "grade",
            "teacher",
            "assistant_teacher",
            "teacher_id",
            "class_name",
        ]

    def get_teacher(self, obj):
        """
        담당 선생님 이름(문자열)
        - teacher가 HEAD면: teacher.full_name
        - teacher가 ASSISTANT면: head_teacher.full_name (있으면), 없으면 teacher.full_name
        """
        teacher = obj.teacher
        if not teacher:
            return None

        if teacher.role == "ASSISTANT":
            return (
                teacher.head_teacher.full_name
                if teacher.head_teacher
                else teacher.full_name
            )

        return teacher.full_name

    def get_assistant_teacher(self, obj):
        """
        반에 배정된 보조 교사 이름
        규칙:
        - teacher가 HEAD면 → 그 teacher의 assistance_teacher 중 1명(첫 번째)
        - teacher가 ASSISTANT면 → 자기 자신
        """
        teacher = obj.teacher
        if not teacher:
            return None

        if teacher.role == "ASSISTANT":
            return teacher.full_name

        assistant = teacher.assistance_teacher.first()
        return assistant.full_name if assistant else None


# 반편성
class SimpleTeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "full_name", "role", "class_name"]


class ClassAssignmentRowSerializer(serializers.Serializer):
    class_name = serializers.CharField()
    current_head_id = serializers.IntegerField(allow_null=True)
    current_head_name = serializers.CharField(allow_blank=True)
    current_assistant_id = serializers.IntegerField(allow_null=True)
    current_assistant_name = serializers.CharField(allow_blank=True)


class ClassAssignmentSaveItemSerializer(serializers.Serializer):
    class_name = serializers.CharField()
    head_id = serializers.IntegerField()
    assistant_id = serializers.IntegerField(required=False, allow_null=True)


GRADE_CHOICES = ["중1", "중2", "중3", "고1", "고2", "고3"]


class AdminStudentListSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.full_name", read_only=True)
    class_name = serializers.CharField(source="teacher.class_name", read_only=True)

    class Meta:
        model = Member
        fields = ["id", "name", "grade", "gender", "teacher_name", "class_name"]


class AdminStudentGradeBulkSerializer(serializers.Serializer):
    mode = serializers.ChoiceField(choices=["selected", "promote"])
    student_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, allow_empty=True
    )
    target_grade = serializers.ChoiceField(
        choices=GRADE_CHOICES, required=False, allow_null=True
    )

    def validate(self, attrs):
        mode = attrs.get("mode")

        if mode == "selected":
            ids = attrs.get("student_ids") or []
            if not ids:
                raise serializers.ValidationError({"student_ids": "학생을 선택하세요."})
            if not attrs.get("target_grade"):
                raise serializers.ValidationError({"target_grade": "변경할 학년을 선택하세요."})

        return attrs


class AdminStudentAssignHeadSerializer(serializers.Serializer):
    head_id = serializers.IntegerField()
    student_ids = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False
    )

    def validate(self, attrs):
        head_id = attrs["head_id"]
        try:
            head = CustomUser.objects.get(id=head_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"head_id": "담당 선생님을 찾을 수 없습니다."})

        if head.role != "HEAD":
            raise serializers.ValidationError({"head_id": "담당 선생님은 HEAD만 가능합니다."})

        return attrs
