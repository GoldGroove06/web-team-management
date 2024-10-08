from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
   pass
class Projects(models.Model):
    project_id = models.AutoField(primary_key=True)
    project_name = models.CharField(max_length=64)
    project_info = models.CharField(max_length=200)
    team_leader = models.CharField(max_length=64)
    project_deadline = models.DateField( default ="2022-12-31 23:59:59")

class members(models.Model):
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name='pj_id')
    user = models.CharField(max_length=64)

class Tasks(models.Model):
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    task_id = models.AutoField(primary_key=True)
    task = models.CharField(max_length=64)
    task_info = models.CharField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)
    last_date = models.DateTimeField()
    user = models.CharField(max_length=64,default=None)
    priority = models.CharField(max_length=20)
    status = models.CharField(max_length=20,default="tasks")
    sub_late = models.BooleanField(default=False)
    def serialize(self):
        return{
            "task_id":self.task_id,
            "task":self.task,
            "task_info":self.task_info,
            "date_created":self.date_created,
            "last_date":self.last_date,
            "user":self.user,
            "priority":self.priority,
            "status":self.status,



        }  

