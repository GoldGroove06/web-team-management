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

priority_choices=(
    ("L", "Low"),
    ("N", "Normal"),
    ("H", "High")
)

class new_task_form(forms.Form):
    task = forms.CharField(max_length=64)
    task_info = forms.CharField(max_length=200)
    last_date = forms.DateTimeField( input_formats=['%Y-%m-%d %H:%M:%S'], 
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    user = forms.CharField(max_length=64)
    priority = forms.ChoiceField(choices=priority_choices)

    def clean_user(self):
        user = self.cleaned_data.get("user")
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
            return HttpResponseRedirect(reverse("homepage"))
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
        return HttpResponseRedirect(reverse("homepage"))
    else:
        return render(request, "tmacweb/register.html")
    
def createproject(request):
    if request.method == "POST":
        Projects.objects.create(
            project_name = request.POST["projectname"],
            project_info = request.POST["projectdesc"],
            team_leader = str(request.user)
        )
      
        
        return HttpResponseRedirect(reverse("homepage"))
    return render(request, "tmacweb/createproject.html")

def projectpage(request, id):
    return render(request, "tmacweb/projectpage.html",{
        "id":id, "task_form":new_task_form, "error" : error_message
    })


def dashboard(request):
    return render(request, "tmacweb/dashboard.html")

def apipl(request):
    p_list = Projects.objects.filter(team_leader = str(request.user))
    
    r_dict={}
    p= 0
    for i in p_list:
        temp_dict ={
            "project_id"   : i.project_id,
            "project_name" : i.project_name,
            "project_info" : i.project_info, 
        }
        r_dict[p] = temp_dict 
        p = p + 1


    

    return JsonResponse(r_dict, status=200)

def apiproject(request, id):
    project = Projects.objects.get(project_id = id)
    members_list = members.objects.filter(project_id = project)
    task_list = Tasks.objects.filter(project_id = project)
    print(members_list, task_list)
    r_dict= {}
    temp_dict ={
            "project_id"   : project.project_id,
            "project_name" : project.project_name,
            "project_info" : project.project_info, 
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
        



    return JsonResponse(r_dict, safe=True)

def newmember(request, pid):
    if request.method == "POST":
        print(request.body)
        try:
            User.objects.get(username = request.POST["new_user"])
        except User.DoesNotExist:
            messages.success(request, "User Doesn't exist")
            return HttpResponseRedirect(reverse("projectpage", kwargs={'id': pid}))

        p = Projects.objects.get(project_id = pid)
        members.objects.create(
            project_id = p,
            user = request.POST["new_user"],
        )
        return HttpResponseRedirect(reverse("projectpage", kwargs={'id': pid}))

        
        
def newtask(request,pid):
    if request.method == "POST":
       form = new_task_form(request.POST)
       if form.is_valid():
        return HttpResponseRedirect(reverse("projectpage", kwargs={'id': pid}))
       else :
           error_message = "User Doesn't exist"
           return HttpResponseRedirect(reverse("projectpage", kwargs={'id': pid}))
       


def calendarfetch(request):
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
        })
    r_dict["user_tasks"] = q_list



    return JsonResponse(r_dict, status = 200)
