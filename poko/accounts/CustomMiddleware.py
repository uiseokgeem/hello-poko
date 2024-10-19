from django.utils.deprecation import MiddlewareMixin
from django.middleware.csrf import CsrfViewMiddleware


class CustomCsrfMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        print(f"CSRF middleware is working for {request.path}")
        return super().process_view(request, callback, callback_args, callback_kwargs)
