from django.urls import path

from . import views

urlpatterns = [
    path("", views.homepage, name="homepage"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("createproject", views.createproject, name="createproject")
]