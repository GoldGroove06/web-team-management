from django.contrib import admin
from .models import Projects, Tasks, members
# Register your models here.

class FooAdmin(admin.ModelAdmin):
    readonly_fields = ('date_created',)
admin.site.register(Projects)
admin.site.register(Tasks, FooAdmin)
admin.site.register(members)

