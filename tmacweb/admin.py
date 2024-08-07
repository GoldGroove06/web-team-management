from django.contrib import admin
from .models import Projects, Tasks, members
# Register your models here.

admin.site.register(Projects)
admin.site.register(Tasks)
admin.site.register(members)

