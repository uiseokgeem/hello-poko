from collections import defaultdict

from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated

from accounts.models import CustomUser
from attendance.models import Attendance, Member
from report.models import UserCheck, Feedback
from .serializer import (
    WeeklyAttendanceSerializer,
    GroupAttendanceSerializer,
    MemberAttendanceSerializer,
    TeacherSerializer,
    HeadsSerializer,
    FeedbackWriteSerializer,
    FeedbackReadSerializer,
    AdminStudentSerializer,
    SimpleTeacherSerializer,
    ClassAssignmentRowSerializer,
    ClassAssignmentSaveItemSerializer,
    AdminStudentListSerializer,
    AdminStudentGradeBulkSerializer,
    AdminStudentAssignHeadSerializer,
)

from django.db.models import Count, Q, Prefetch, Case, When, IntegerField
from django.db import transaction
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet
from .permissions import IsAdminOrReadOnly


class AdminTeacherViewSet(ViewSet):
    # list
    def list(self, request):
        q = (request.query_params.get("q") or "").strip()

        teachers = CustomUser.objects.all()

        if q:
            teachers = teachers.filter(
                Q(full_name__icontains=q)
                | Q(email__icontains=q)
                | Q(class_name__icontains=q)
                | Q(head_teacher__full_name__icontains=q)
            ).distinct()

            # 1순위: role 정렬용 가상 필드
        teachers = teachers.annotate(
            role_order=Case(
                When(role="HEAD", then=0),
                When(role="ASSISTANT", then=1),
                default=99,
                output_field=IntegerField(),
            )
        ).order_by("role_order", "full_name")

        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)

    # head filter
    @action(detail=False, methods=["get"])
    def heads(self, request):
        heads = CustomUser.objects.filter(role="HEAD")
        serializer = HeadsSerializer(heads, many=True)
        return Response(serializer.data)

    # partial_update
    def partial_update(self, request, pk=None):
        teacher = get_object_or_404(CustomUser, pk=pk)
        serializer = TeacherSerializer(teacher, data=request.data, partial=True)

        if serializer.is_valid():
            with transaction.atomic():
                # HEAD -> ASSISTANT
                if teacher.role == "HEAD" and request.data.get("role") == "ASSISTANT":
                    CustomUser.objects.filter(head_teacher=teacher).update(
                        head_teacher=None,
                        class_name=None,
                    )
                # ASSISTANT -> HEAD
                elif teacher.role == "ASSISTANT" and request.data.get("role") == "HEAD":
                    teacher.head_teacher = None

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # destroy
    def destroy(self, request, pk=None):
        teacher = get_object_or_404(CustomUser, pk=pk)
        teacher.delete()
        return Response({"message": "삭제되었습니다."}, status=status.HTTP_204_NO_CONTENT)


class AdminStudentViewSet(ViewSet):
    """
    기존 students 엔드포인트에 2단계/3단계 액션을 추가합니다.
    - GET  /admin-management/students/                      (기존)
    - PATCH/DELETE ...                                      (기존)
    - GET  /admin-management/students/grade-step/           (2단계 조회)
    - POST /admin-management/students/grade-bulk/           (2단계 저장)
    - GET  /admin-management/students/placement-step/       (3단계 조회)
    - POST /admin-management/students/assign-head/          (3단계 저장)
    """

    @action(detail=False, methods=["get"], url_path="grade-step")
    def grade_step(self, request):
        q = (request.query_params.get("q") or "").strip()
        grade = (request.query_params.get("grade") or "").strip()

        qs = Member.objects.select_related("teacher").all()

        if q:
            qs = qs.filter(name__icontains=q)

        if grade:
            qs = qs.filter(grade=grade)

        qs = qs.order_by("name", "id")

        return Response(AdminStudentListSerializer(qs, many=True).data)

    @action(detail=False, methods=["post"], url_path="grade-bulk")
    def grade_bulk(self, request):
        serializer = AdminStudentGradeBulkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        student_ids = serializer.validated_data["student_ids"]
        target_grade = serializer.validated_data["target_grade"]

        qs = Member.objects.filter(id__in=student_ids)

        with transaction.atomic():
            if target_grade == "졸업":
                qs.update(
                    grade="졸업",
                    teacher=None,
                )
            else:
                qs.update(grade=target_grade)

        return Response(
            {"message": "학년 업데이트가 저장되었습니다."},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"], url_path="placement-step")
    def placement_step(self, request):
        q = (request.query_params.get("q") or "").strip()
        grade = (request.query_params.get("grade") or "").strip()

        qs = Member.objects.select_related("teacher").all().exclude(grade="졸업")

        if q:
            qs = qs.filter(name__icontains=q)

        if grade:
            qs = qs.filter(grade=grade)

        qs = qs.order_by("name", "id")

        return Response(AdminStudentListSerializer(qs, many=True).data)

    @action(detail=False, methods=["post"], url_path="assign-head")
    def assign_head(self, request):
        serializer = AdminStudentAssignHeadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        head_id = serializer.validated_data["head_id"]
        student_ids = serializer.validated_data["student_ids"]

        head = CustomUser.objects.get(id=head_id)  # validate에서 존재/role 확인됨

        with transaction.atomic():
            updated = Member.objects.filter(id__in=student_ids).update(teacher=head)

        return Response(
            {"message": "학생 배치가 저장되었습니다.", "updated_count": updated},
            status=status.HTTP_200_OK,
        )

    def list(self, request):
        q = (request.query_params.get("q") or "").strip()

        students = (
            Member.objects.select_related("teacher", "teacher__head_teacher")
            .prefetch_related("teacher__assistance_teacher")
            .exclude(grade="졸업")
        )

        if q:
            students = students.filter(
                Q(name__icontains=q)
                | Q(grade__icontains=q)
                | Q(teacher__full_name__icontains=q)
                | Q(teacher__head_teacher__full_name__icontains=q)
                | Q(teacher__assistance_teacher__full_name__icontains=q)
            ).distinct()

        serializer = AdminStudentSerializer(students, many=True)
        return Response(serializer.data)

    # 학생 부분 수정 (EditStudentModal)
    def partial_update(self, request, pk=None):
        student = get_object_or_404(Member, pk=pk)
        serializer = AdminStudentSerializer(student, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 학생 삭제 (DeleteStudentModal)
    def destroy(self, request, pk=None):
        student = get_object_or_404(Member, pk=pk)
        student.delete()
        return Response({"message": "학생이 삭제되었습니다."}, status=status.HTTP_204_NO_CONTENT)


class WeeklyAttendanceViewSet(ModelViewSet):
    serializer_class = WeeklyAttendanceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def get_queryset(self):
        year = self.request.query_params.get("year", None)
        if year is not None:
            return Attendance.objects.filter(date__year=year)
        return Attendance.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        aggregated_data = (
            queryset.values("date")
            .annotate(
                출석=Count("id", filter=Q(attendance=True)),
                결석=Count("id", filter=Q(attendance=False)),
            )
            .order_by("date")
        )

        response_data = [
            {"date": record["date"], "type": "출석", "value": record["출석"]}
            for record in aggregated_data
        ] + [
            {"date": record["date"], "type": "결석", "value": record["결석"]}
            for record in aggregated_data
        ]

        return Response(response_data)


class GroupAttendanceViewSet(ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = GroupAttendanceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    @action(detail=False, methods=["get"], url_path="attendance-by-week")
    def attendance_by_week(self, request):
        # 쿼리 파라미터에서 날짜 가져오기
        week = request.query_params.get("week")

        if not week:
            return Response({"error": "Week parameter is required"}, status=400)

        try:
            # 요청된 날짜를 필터링
            attendance_data = (
                Attendance.objects.filter(date=week)  # 요청된 날짜 필터링
                .values("name__teacher__class_name")  # class_name 별 분류
                .annotate(
                    attendance_count=Count("id", filter=Q(attendance=True)),  # 출석 수
                    absent_count=Count("id", filter=Q(attendance=False)),  # 결석 수
                )
                .order_by("name__teacher__class_name")  # 학년 기준 정렬
            )

            return Response(attendance_data)  # 결과 반환

        except Exception as e:
            print("Error processing attendance data:", str(e))
            return Response(
                {"error": "An error occurred while processing attendance data."},
                status=500,
            )


class MemberAttendanceViewSet(ModelViewSet):
    serializer_class = MemberAttendanceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def get_serializer_context(self):
        # context에 request 정보를 포함하여 Serializer에 전달
        return {"request": self.request}

    def get_queryset(self):
        year = self.request.query_params.get("year", None)
        queryset = Attendance.objects.all()  # 기본 쿼리셋 설정

        if year:
            queryset = queryset.filter(date__year=year)

        # Member와 관련된 데이터를 함께 가져오도록 최적화
        queryset = queryset.select_related("name").prefetch_related(
            Prefetch("name", queryset=Member.objects.all())
        )

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # 데이터를 날짜별로 그룹화
        attendance_data = defaultdict(list)

        for record in queryset:
            grouped_record = {
                "id": record.name.id,
                "name": record.name.name,
                "grade": record.name.grade,
                "gender": record.name.gender,
                "attendance": record.attendance,
            }
            attendance_data[record.date.strftime("%Y-%m-%d")].append(grouped_record)

        # 학생 데이터 생성
        students = []
        seen_students = set()  # 중복 방지용

        for record in queryset:
            if record.name.id not in seen_students:
                seen_students.add(record.name.id)
                students.append(
                    {
                        "id": record.name.id,
                        "name": record.name.name,
                        "grade": record.name.grade,
                        "gender": record.name.gender,
                    }
                )

        # 응답 데이터 생성
        response_data = {
            "data": [
                {"date": date, "attendance": attendance}
                for date, attendance in attendance_data.items()
            ],
            "students": students,
        }

        return Response(response_data)


class WeeklyListView(ListAPIView):
    def get(self, request, *args, **kwargs):
        year = self.request.query_params.get("year", None)
        if year:
            # 선택한 연도의 출석 데이터 필터링
            attendance_dates = (
                Attendance.objects.filter(date__year=year)
                .values_list("date", flat=True)
                .distinct()
            )
        else:
            attendance_dates = Attendance.objects.values_list(
                "date", flat=True
            ).distinct()

        sorted_dates = sorted(attendance_dates, reverse=True)

        return Response(sorted_dates)


class AdminReportViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]
    queryset = UserCheck.objects.all()

    # 목양일지 목록 리스트에 정보 날짜 / 선생님 / 제목 / 작성 상태 API
    @action(detail=False, methods=["get"])
    def summary(self, request):
        reports = UserCheck.objects.all()

        teacher = request.query_params.get("teacher")
        if teacher:
            reports = reports.filter(teacher_id=teacher)

        student = request.query_params.get("student")
        if student:
            reports = reports.filter(membercheck__member__name__icontains=student)

        status_param = request.query_params.get("status")
        if status_param:
            reports = reports.filter(status=status_param)

        start_date = request.query_params.get("start_date")
        if start_date:
            reports = reports.filter(date__gte=start_date)

        end_date = request.query_params.get("end_date")
        if end_date:
            reports = reports.filter(date__lte=end_date)

        keyword = request.query_params.get("keyword")

        if keyword:
            reports = reports.filter(
                Q(issue__icontains=keyword)
                | Q(pray__pray_dept__icontains=keyword)
                | Q(pray__pray_group__icontains=keyword)
                | Q(pray__pray_teacher__icontains=keyword)
                | Q(membercheck__care_note__icontains=keyword)
            ).distinct()

        result = [
            {
                "id": report.id,
                "date": report.date.strftime("%Y-%m-%d"),
                "date_sunday": report.date_sunday.strftime("%Y-%m-%d"),
                "week_number": report.week_number,
                "teacher_name": report.teacher.full_name,
                "status": report.status,
            }
            for report in reports.order_by("-date")
        ]

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="detail")
    def admin_detail_report_data(self, request):
        report_id = request.query_params.get("id")
        nearest_sunday = request.query_params.get("nearestSunday")

        try:
            report = UserCheck.objects.get(id=report_id)
        except UserCheck.DoesNotExist:
            return Response({"detail": "Report not found"}, status=404)

        # 해당 교사의 학생 목록
        students = Member.objects.all()
        student_info_map = {s.id: {"name": s.name} for s in students}

        # 저장된 report 내 student 데이터
        member_checks = report.membercheck_set.all()
        student_data = {}
        for check in member_checks:
            sid = check.member_id
            student_data[sid] = {
                "id": sid,
                "name": student_info_map.get(sid, {}).get("name", ""),
                "attendance": Attendance.objects.filter(
                    name_id=sid, date=nearest_sunday
                )
                .first()
                .attendance
                if Attendance.objects.filter(name_id=sid, date=nearest_sunday).exists()
                else False,
                "gqs_attendance": check.gqs_attendance,
                "care_note": check.care_note,
            }

        # 응답 구조
        response_data = {
            "id": report.id,
            "title": report.title,
            "worship_attendance": report.worship_attendance,
            "meeting_attendance": report.meeting_attendance,
            "qt_count": report.qt_count,
            "pray_count": report.pray_count,
            "status": report.status,
            "pray": {
                "pray_dept": report.pray.pray_dept if report.pray else "",
                "pray_group": report.pray.pray_group if report.pray else "",
                "pray_teacher": report.pray.pray_teacher if report.pray else "",
            },
            "issue": report.issue,
            "students": student_data,
        }

        return Response(response_data, status=200)

    @action(detail=True, methods=["get"], url_path="feedback")
    def feedback(self, request, pk=None):  # pk = report_id
        report = get_object_or_404(UserCheck, pk=pk)
        fb = getattr(report, "feedback", None)
        return Response(FeedbackReadSerializer(fb).data if fb else None, status=200)


class AdminFeedbackViewSet(viewsets.ModelViewSet):
    """
    /admin-management/feedbacks/ (POST)
    /admin-management/feedbacks/{id}/ (PATCH, DELETE)
    """

    queryset = Feedback.objects.select_related("teacher", "user_check")
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return FeedbackWriteSerializer
        return FeedbackReadSerializer

    def create(self, request, *args, **kwargs):
        report_id = request.query_params.get("report")
        if not report_id:
            return Response({"detail": "report(query param)가 필요합니다."}, status=400)
        try:
            uc = UserCheck.objects.get(pk=report_id)
        except UserCheck.DoesNotExist:
            return Response({"detail": "Report(user_check) 를 찾을 수 없습니다."}, status=404)

        serializer = self.get_serializer(
            data=request.data, context={"request": request, "user_check": uc}
        )
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        out = FeedbackReadSerializer(instance).data
        return Response(out, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(FeedbackReadSerializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        instance: Feedback = self.get_object()
        uc = instance.user_check  # 연결된 UserCheck 인스턴스 확보

        with transaction.atomic():
            instance.delete()

            if uc:
                UserCheck.objects.filter(pk=uc.pk).update(status=1)

        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminClassAssignmentViewSet(ViewSet):
    """
    GET  /admin-management/class-assignments/        반편성 화면 초기 데이터
    POST /admin-management/class-assignments/save/   반편성 일괄 저장
    """

    def list(self, request):
        class_names = list(
            CustomUser.objects.exclude(class_name__isnull=True)
            .exclude(class_name__exact="")
            .values_list("class_name", flat=True)
            .distinct()
            .order_by("class_name")
        )

        rows = []
        for cn in class_names:
            head = (
                CustomUser.objects.filter(role="HEAD", class_name=cn)
                .order_by("id")
                .first()
            )

            if head:
                assistant = (
                    CustomUser.objects.filter(
                        role="ASSISTANT", class_name=cn, head_teacher=head
                    )
                    .order_by("id")
                    .first()
                )
            else:
                assistant = (
                    CustomUser.objects.filter(role="ASSISTANT", class_name=cn)
                    .order_by("id")
                    .first()
                )

            rows.append(
                {
                    "class_name": cn,
                    "current_head_id": head.id if head else None,
                    "current_head_name": head.full_name if head else "",
                    "current_assistant_id": assistant.id if assistant else None,
                    "current_assistant_name": assistant.full_name if assistant else "",
                }
            )

        heads = CustomUser.objects.filter(role="HEAD").order_by("full_name")
        assistants = CustomUser.objects.filter(role="ASSISTANT").order_by("full_name")

        return Response(
            {
                "rows": ClassAssignmentRowSerializer(rows, many=True).data,
                "head_candidates": SimpleTeacherSerializer(heads, many=True).data,
                "assistant_candidates": SimpleTeacherSerializer(
                    assistants, many=True
                ).data,
            }
        )

    @action(detail=False, methods=["post"], url_path="save")
    def save(self, request):
        # payload: [{class_name, head_id, assistant_id?}, ...]
        serializer = ClassAssignmentSaveItemSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        items = serializer.validated_data

        # 1) 반별 필수/선택 검증 + 동일 반에서 head/assistant 동일인 금지
        for it in items:
            if not it.get("head_id"):
                return Response({"detail": "담당 선생님(HEAD)은 필수입니다."}, status=400)

            if it.get("assistant_id") and it["assistant_id"] == it["head_id"]:
                return Response(
                    {"detail": f"{it['class_name']} 반: 담당/보조가 같은 사람입니다."}, status=400
                )

        # 2) 전체 중복 금지(반 편성 전체에서 동일 teacher 2번 등장 금지)
        used = {}
        for it in items:
            cn = it["class_name"]
            hid = it["head_id"]
            aid = it.get("assistant_id")

            for tid in [hid, aid]:
                if not tid:
                    continue
                if tid in used:
                    return Response(
                        {
                            "detail": f"중복 배정: 선생님({tid})이 {used[tid]} 와 {cn} 에 동시에 배정되었습니다."
                        },
                        status=400,
                    )
                used[tid] = cn

        # 3) role 검증(이 페이지에서 role 변경 금지)
        head_ids = [it["head_id"] for it in items]
        assistant_ids = [
            it.get("assistant_id") for it in items if it.get("assistant_id")
        ]

        heads_map = {t.id: t for t in CustomUser.objects.filter(id__in=head_ids)}
        assistants_map = {
            t.id: t for t in CustomUser.objects.filter(id__in=assistant_ids)
        }

        for it in items:
            cn = it["class_name"]
            head = heads_map.get(it["head_id"])
            if not head:
                return Response({"detail": f"{cn} 반: 담당 선생님을 찾을 수 없습니다."}, status=400)
            if head.role != "HEAD":
                return Response({"detail": f"{cn} 반: 담당은 HEAD만 선택 가능합니다."}, status=400)

            aid = it.get("assistant_id")
            if aid:
                assistant = assistants_map.get(aid)
                if not assistant:
                    return Response(
                        {"detail": f"{cn} 반: 보조 선생님을 찾을 수 없습니다."}, status=400
                    )
                if assistant.role != "ASSISTANT":
                    return Response(
                        {"detail": f"{cn} 반: 보조는 ASSISTANT만 선택 가능합니다."}, status=400
                    )

        # 4) 학생 일괄 변경을 위해 저장 전 “기존 반 담당”을 잡아둠
        old_head_by_class = {}
        for it in items:
            cn = it["class_name"]
            old_head = (
                CustomUser.objects.filter(role="HEAD", class_name=cn)
                .order_by("id")
                .first()
            )
            old_head_by_class[cn] = old_head

        # 5) 실제 저장(정책 B: 미배정(null) 허용)
        with transaction.atomic():
            # (1) 이번 저장에서 선택된 사람들은 최종적으로 중복이 없으므로,
            #     먼저: 선택되지 않은 기존 배정자들을 “미배정”으로 정리 (class_name=None)
            #     - 대상: class_name이 items에 포함된 반들에 속해 있던 모든 선생님 중, 이번에 선택되지 않은 사람
            target_class_names = [it["class_name"] for it in items]
            selected_ids = set(used.keys())

            existing_in_scope = CustomUser.objects.filter(
                class_name__in=target_class_names
            )
            for t in existing_in_scope:
                if t.id not in selected_ids:
                    t.class_name = None
                    if t.role == "ASSISTANT":
                        t.head_teacher = None
                    # HEAD는 head_teacher가 원래 null이어야 자연스럽지만, 혹시 값이 있으면 null로 정리
                    if t.role == "HEAD":
                        t.head_teacher = None
                    t.save(update_fields=["class_name", "head_teacher"])

            # (2) 각 반의 head/assistant를 배정
            for it in items:
                cn = it["class_name"]
                head = heads_map[it["head_id"]]
                head.class_name = cn
                head.head_teacher = None
                head.save(update_fields=["class_name", "head_teacher"])

                aid = it.get("assistant_id")
                if aid:
                    assistant = assistants_map[aid]
                    assistant.class_name = cn
                    # 정책 A: 보조 head_teacher 강제 연결
                    assistant.head_teacher = head
                    assistant.save(update_fields=["class_name", "head_teacher"])

                # (3) 학생 일괄 변경
                old_head = old_head_by_class.get(cn)
                if old_head and old_head.id != head.id:
                    Member.objects.filter(teacher_id=old_head.id).update(teacher=head)

        return Response({"message": "반 편성이 저장되었습니다."}, status=status.HTTP_200_OK)
