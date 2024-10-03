from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django import forms
from django.contrib import messages
from .models import User,Projects, Tasks, members
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib import messages
from django.core.exceptions import ValidationError
import json
from datetime import datetime

from django.utils import timezone
priority_choices=(
    ("L", "Low"),
    ("N", "Normal"),
    ("H", "High")
)

class new_task_form(forms.Form):
    taskName = forms.CharField(max_length=64 )
    taskDesc = forms.CharField(max_length=200)
    lastDate = forms.DateTimeField( input_formats=['%Y-%m-%d %H:%M:%S'], 
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    taskUser = forms.CharField(max_length=64)
    priority = forms.ChoiceField(choices=priority_choices)

    def clean_user(self):
        user = self.cleaned_data.get("taskUser")
        if not User.objects.filter(username=user).exists():
            raise ValidationError("User doesn't exist")
        return user
   
error_message = ''        

def homepage(request):
   return render(request, "tmacweb/homepage.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("dashboard"))
        else:
            return render(request, "tmacweb/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "tmacweb/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("homepage"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "tmacweb/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "tmacweb/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("dashboard"))
    else:
        return render(request, "tmacweb/register.html")
    
def createproject(request):
    if request.method == "POST":
        Projects.objects.create(
            project_name = request.POST["projectname"],
            project_info = request.POST["projectdesc"],
            team_leader = str(request.user),
            project_deadline = request.POST["projectdeadline"],
        )
      
        
        return HttpResponseRedirect(reverse("homepage"))
    return render(request, "tmacweb/createproject.html")

def projectpage(request, id):
    p = Projects.objects.get(project_id = id)
    if p.team_leader == str(request.user):
        return render(request, "tmacweb/projectpage.html",{
                "id":id
            })
    if members.objects.filter(project_id = p, user = str(request.user)).exists():
            return render(request, "tmacweb/projectpage.html",{
                "id":id
            })
    else:
            return render(request, "tmacweb/forbidden.html",{
                
            })
    


def dashboard(request):
    return render(request, "tmacweb/dashboard.html")

def apipl(request):
    p_list = Projects.objects.filter(team_leader = str(request.user))
    temp = members.objects.filter(user = str(request.user))
    
        
    
    r_dict={}
    p= 0
    for i in p_list:
        temp_dict ={
            "project_id"   : i.project_id,
            "project_name" : i.project_name,
            "project_info" : i.project_info,
            "project_deadline" : i.project_deadline, 
        }
        r_dict[p] = temp_dict 
        p = p + 1
    for i in temp:
        temp_dict ={
            "project_id"   : i.project_id.project_id,
            "project_name" : i.project_id.project_name,
            "project_info" : i.project_id.project_info, 
        }
        r_dict[p] = temp_dict
        p = p + 1



    

    return JsonResponse(r_dict, status=200)

def apiproject(request, id):
    project = Projects.objects.get(project_id = id)
    members_list = members.objects.filter(project_id = project)
    task_list = Tasks.objects.filter(project_id = project)

    r_dict= {}
    temp_dict ={
            "project_id"   : project.project_id,
            "project_name" : project.project_name,
            "project_info" : project.project_info, 
            "project_user" : project.team_leader,
            "project_deadline" : project.project_deadline
        }
    r_dict["project"] = temp_dict
    m_list = []
    for i in members_list:
        m_list.append(i.user)
    r_dict["members"] = m_list
    tasktemp2 = []
    for i in task_list:
        task_temp = {}
        task_temp["task_id"] = i.task_id
        task_temp["task"] = i.task
        task_temp["task_info"] = i.task_info
        
        tasktemp2.append(task_temp)
    r_dict["tasks"] = tasktemp2
    
    p_list={}
    active = Tasks.objects.filter(project_id = project, status = "active").count()
    completed = Tasks.objects.filter(project_id = project, status = "completed").count()
    backlog = Tasks.objects.filter(project_id = project, status = "backlog").count()
    tasks = Tasks.objects.filter(project_id = project, status = "tasks").count()
    print(completed)
    percentage = (int(completed)  / task_list.count()) * 100
    if completed == 0:
        percentage = 0
    print(round(percentage))
    p_list["active"] = active
    p_list["completed"] = completed
    p_list["backlog"] = backlog
    p_list["tasks"] = tasks
    p_list["percentage"] = round(percentage)

    r_dict["progress"] = p_list
    



    return JsonResponse(r_dict, safe=True)

def newmember(request, pid):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data["nm"])
        try:
            User.objects.get(username = data["nm"])
        except User.DoesNotExist:
            messages.success(request, "User Doesn't exist")
            return JsonResponse({"m":"u"}, status = 200)
        p = Projects.objects.get(project_id = pid)
        try:
            members.objects.get(project_id = p, user = data["nm"])
            return JsonResponse({"m":"a"}, status = 200)
        except members.DoesNotExist:
            members.objects.create(
                project_id = p,
                user = data["nm"],
            )
            return JsonResponse({"m":"s"}, status = 200)

        
        

def newtask(request,pid):
    if request.method == "POST":
        
        data = json.loads(request.body)
        
        user = data["taskUser"]
        try:
            User.objects.get(username = user)
        except User.DoesNotExist:
            messages.success(request, "User Doesn't exist")
            return JsonResponse({"m":"u"}, status = 200)
           
        date, time = data["lastDate"].split("T")
        date_str = f"{date} {time}"
        dt = datetime.now().strftime("%Y-%m-%d %H:%M")
        if date_str < dt :
            return JsonResponse({"m":"d"}, status = 200)
        p = Projects.objects.get(project_id = pid)   
        
        
        aware_datetime = timezone.make_aware(datetime.strptime(date_str, "%Y-%m-%d %H:%M"), timezone=timezone.get_current_timezone())
        
        Tasks.objects.create(
            task = data["taskName"],
            task_info = data["taskDesc"],
            last_date = aware_datetime,
            user = data["taskUser"],
            priority = data["priority"],
            project_id = p

        )
        return JsonResponse({"m":"s"}, status = 200)

    
      


def taskfetch(request):
    m_tasklist = Tasks.objects.filter(user = str(request.user))
    p_list  = Projects.objects.filter(team_leader = str(request.user))
    t_list = []
    
    for i in p_list:
         temp = Tasks.objects.filter(project_id = i)
         for a in temp:
            t_list.append(a)
    r_dict={}
    d_list =[]
    for s in t_list:
       
        d_list.append({
            "task_id":s.task_id,
            "task":s.task,
            "task_info":s.task_info,
            "last_date":s.last_date,
            "user":s.user,
            "priority":s.priority,
            "status":s.status
        })
    r_dict["team_tasks"] = d_list
    q_list= []
    for a in m_tasklist:
        q_list.append({
            "task_id":a.task_id,
            "task":a.task,
            "task_info":a.task_info,
            "last_date":a.last_date,
            "user":a.user,
            "priority":a.priority,
            "status":a.status,
        })
    r_dict["user_tasks"] = q_list



    return JsonResponse(r_dict, status = 200)


def taskapi(request, id):
    project = Projects.objects.get(project_id = id)
    if project.team_leader == str(request.user):
        tasks = Tasks.objects.filter(project_id = project)
    else :
        tasks = Tasks.objects.filter(project_id = project, user = str(request.user))
    r_dict={}
    r_dict["tmleader"] = project.team_leader
    r_dict["tasks"] = [task.serialize() for task in tasks]
    return JsonResponse(r_dict, status= 200)
    
    
def taskstatus(request,id,stat):
    
    if request.method== "PUT":
       
        task = Tasks.objects.get(task_id = id)
        
        
        nstat = ''
        if stat == "tasks":
            nstat = "active"
            task.status = nstat
        elif stat == "active":
            nstat = "completed"
            task.status =  nstat
        elif stat == "backlog":
            nstat = "completed"
            task.status =  nstat 
            task.sub_late = True
        task.save()

        
        return JsonResponse({"m":"s", "nstat":nstat}, status = 200)
    
def removemember(request, id, username):
    if request.method == "PUT":
        p = Projects.objects.get(project_id = id)
        member = members.objects.get(project_id = p, user = username)
        member.delete()
        return JsonResponse({"m":"s"}, status = 200)