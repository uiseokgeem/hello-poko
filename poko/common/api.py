from datetime import datetime
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import CustomUser
from attendance.models import Attendance, Member


@method_decorator(csrf_exempt, name="dispatch")
class HomepageAttendance(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *ars, **kwargs):
        sunday_date = request.query_params.get("date")
        user = self.request.user

        # postman test를 위한 user
        # user_email = "token@toen.com"
        # user = get_object_or_404(CustomUser, email=user_email)

        try:
            sunday = datetime.strptime(sunday_date, "%Y-%m-%d")
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=400
            )

        members = user.members.all()

        attendance_records = Attendance.objects.filter(name__in=members, date=sunday)

        total_attendance = attendance_records.filter(attendance=True).count()
        total_absence = attendance_records.filter(attendance=False).count()

        data = {
            "total_attendance": total_attendance,
            "total_absence": total_absence,
            "last_updated": sunday.strftime("%Y-%m-%d"),
        }

        return Response(data)
