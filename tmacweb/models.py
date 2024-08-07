from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
   pass
class Projects(models.Model):
    project_id = models.AutoField(primary_key=True)
    project_name = models.CharField(max_length=64)
    project_info = models.CharField(max_length=200)
    team_leader = models.CharField(max_length=64)

class members(models.Model):
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    user = models.CharField(max_length=64)

class Tasks(models.Model):
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    task = models.CharField(max_length=64)
    task_info = models.CharField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True)
    
    priority = models.CharField(max_length=20)
    


