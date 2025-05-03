from django.contrib import admin
from .models import UserCheck, Pray, MemberCheck, Feedback


@admin.register(UserCheck)
class UserCheckAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "teacher",
        "title",
        "worship_attendance",
        "qt_count",
        "pray_count",
        "meeting_attendance",
        "status",
        "date_sunday",
    )
    list_filter = ("teacher", "status", "date_sunday")
    search_fields = ("title", "teacher__full_name")
    readonly_fields = ("date", "date_sunday", "week_number")
    ordering = ("-date",)


@admin.register(Pray)
class PrayAdmin(admin.ModelAdmin):
    list_display = ("id", "pray_dept", "pray_group", "pray_teacher")
    search_fields = ("pray_dept", "pray_group", "pray_teacher")


@admin.register(MemberCheck)
class MemberCheckAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "member",
        "user_check",
        "gqs_attendance",
        "status",
        "date_sunday",
    )
    list_filter = ("status", "date_sunday", "gqs_attendance")
    search_fields = ("member__name", "user_check__title")
    readonly_fields = ("date", "date_sunday", "week_number")
    ordering = ("-date",)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("id", "teacher", "user_check", "feedback", "date")
    list_filter = ("teacher", "date")
    search_fields = ("feedback", "teacher__full_name", "user_check__title")
    readonly_fields = ("date",)
