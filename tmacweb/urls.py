from django.urls import path

from . import views

urlpatterns = [
    path("", views.homepage, name="homepage"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("createproject", views.createproject, name="createproject"),
    path("project/<int:id>", views.projectpage, name="projectpage"),
    path("dashboard", views.dashboard, name="dashboard"),
    path("newmember/<int:pid>", views.newmember, name="newmember"),
    path("newtask/<int:pid>", views.newtask, name="newtask"),


    #api 
    path("projectlistapi", views.apipl, name="projectlistapi"),
    path("projectfetch/<int:id>", views.apiproject, name="projectfetch"),
    path("calendarfetch", views.calendarfetch, name="calendarfetch" ),
    
    
]