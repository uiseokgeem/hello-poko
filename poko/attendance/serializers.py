from rest_framework import serializers
from attendance.models import Member


class MemberSerializer(serializers.ModelSerializer):
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

        def __init__(self, *args, **kwargs):
            super(MemberSerializer, self).__init__(*args, *kwargs)
            request = self.context.get("request")
            if request and request.method == "GET":
                self.fields = ["id", "name"]
            if request and request.method == ["POST", "PATCH"]:
                self.fields = [
                    "id",
                    "name",
                    "grade",
                    "gender",
                    "attendance_count",
                    "absent_count",
                    "teacher",
                ]
