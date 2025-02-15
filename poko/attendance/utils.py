from django.db.models import QuerySet


def filter_by_year(queryset: QuerySet, request) -> QuerySet:
    """
    요청에서 'year' 파라미터를 가져와 특정 연도에 해당하는 데이터를 필터링한다.

    :param queryset: 필터링할 쿼리셋 (Attendance.objects.filter(...))
    :param request: Django REST Framework의 request 객체
    :return: 특정 연도에 해당하는 출석 데이터 쿼리셋
    """
    year = request.query_params.get("year", None)
    if year is not None:
        return queryset.filter(date__year=year)
    return queryset
