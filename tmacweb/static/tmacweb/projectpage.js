document.addEventListener("DOMContentLoaded", function(){
    page_render();
    taskfetch();
    document.querySelector("#nm_submit").addEventListener("click", function(){nmsubmit()})
    const form = document.getElementById("task_form");

    form.addEventListener("submit",function(event) {ntsubmit(event)})
    let toastEl = document.querySelector('.toast');
    let toast = new bootstrap.Toast(toastEl);
    

   
})

function page_render(){
    
    
    fetch(`/projectfetch/${passing}`,{
        method:'GET'
    })
    .then(response => response.json())
    .then(data => {
        
        document.querySelector(".project_name").innerHTML=`<b>${data.project.project_name}</b>`
        document.querySelector(".project_desc").innerHTML=`${data.project.project_info}`
        
        document.querySelector(".project_deadline").innerHTML=`<div class="btn btn-info pd_info">${data.project.project_deadline}</div>`
        if (data.project.project_user == user_id){
            document.querySelector(".am-btn-div").innerHTML ='<button type="button"  onclick="member_add()" class = "member-add-btn">Edit members</button>'
            document.querySelector(".btn-div").innerHTML = '<button type="button"  onclick="task_add()" class = "task-btn">Add Task</button>'
        }
        
        for (let i = 0; i < data.members.length; i++){
            member_div = document.createElement("div")
            member_div.className = "member-div"
            member_div.innerHTML = `<b>${data.members[i]}</b>
            <button class = "member-btn" onclick="member_remove('${data.members[i]}')"><i class="bi bi-person-dash"></i></button>
            `
            document.querySelector(".members").append(member_div)
            }
       })
       
       

   
}

function member_add(){
    document.querySelector(".modal-title").innerHTML="Edit members"
    
    document.querySelector("#member_form").className="active"
    document.querySelector("#task_form").className="inactive"
    document.querySelector("#btn-sds").click();
}

function task_add() {
    document.querySelector(".modal-title").innerHTML="Add new Task"
    document.querySelector("#member_form").className="inactive"
    document.querySelector("#task_form").className="active"
    document.querySelector("#btn-sds").click();
}

function taskfetch(){
    fetch(`/taskapi/${passing}`,{
        method:"GET"
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.tasks.length)
        for (let i = 0; i < data.tasks.length; i++){
             const el = document.createElement("div")
            el.className = "taskDiv"
            let icon = document.createElement("i");
            let [ldate, ltime] = data.tasks[i].last_date.split("T")
            let lastdate= ''
            if (data.tasks[i].status == "tasks"){
                icon.className = "bi bi-arrow-right-circle taskicon";
                icon.id = `${data.tasks[i].task_id}`;
                
            }
            else if (data.tasks[i].status == "active"){
                icon.className = "bi bi-check-square taskicon";
                icon.id = `${data.tasks[i].task_id}`;
                
            }
            else if (data.tasks[i].status == "completed"){
                icon.className = "bi bi-check-square-fill taskicon";
                
            }
            else if (data.tasks[i].status == "backlog") {
                icon.className = "bi bi-check-square taskicon";
                icon.id = `${data.tasks[i].task_id}`;
                icon.style.color = "red";
                
            }
            p_icon_innner=""
           
            if (data.tasks[i].priority == "low"){
                p_icon_innner = '<span class="badge badge-secondary"><i class="bi bi-flag"></i> LOW</span>'
            }
            else if (data.tasks[i].priority == "normal"){
                p_icon_innner = '<span class="badge badge-success"><i class="bi bi-flag"></i> NORMAL</span>'
            }
            else if (data.tasks[i].priority == "high"){
                p_icon_innner = '<span class="badge badge-danger"><i class="bi bi-flag"></i> HIGH</span>'
            }
            lastdate= ` ${ldate}`
            let stat = data.tasks[i].status
            let id = data.tasks[i].task_id
            
            icon.setAttribute("onclick", `taskChange('${stat}', ${id})`);
            
            let taskbody = document.createElement("div")
            taskbody.className = "taskbody"
            taskbody.appendChild(icon)
            taskbody.innerHTML += ` <b>${data.tasks[i].task}</b>  <div class = "taskdata"> ${data.tasks[i].task_info} </div> `
            el.append(taskbody)
            if (data.tmleader == user_id){
                el.innerHTML += `<hr class= "taskhr" >  <div class = "taskuser"><div class = "lastdate"><span class="badge badge-info">${data.tasks[i].user}</span></div>   ${p_icon_innner} <span class="badge badge-warning">${lastdate}</span> </div> `
               
            } 
            else  {
                el.innerHTML += `<hr class= "taskhr" >  <div class = "taskuser">  ${p_icon_innner} <span class="badge badge-warning">${lastdate}</span></div> `
            }
           
            
            document.querySelector(`.${data.tasks[i].status}-scroll`).append(el);    

        }
    })
}

function taskChange(stat,id){
    
    console.log(stat)
    console.log(id)
    fetch(`/taskstatus/${id}/${stat}`,{
        method:"PUT",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token 
        },
        
    })
    .then(response => response.json())
    .then(data => {
        if (data['m'] == 's'){
            const el = document.querySelector(`#${id}`);
            document.querySelector(`.${stat}`).removeChild(el);
            document.querySelector(`${data["nstat"]}`).appendChild(el);
            
            
        }
        
        })
        location.reload();
        
}

function nmsubmit(){
    let nm = document.querySelector("#nm_user").value
    fetch(`/newmember/${passing}`,{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token 
        },
        body:JSON.stringify({
            "nm":nm
        })

    })
    .then(response => response.json())
    .then(data => {
        let toastEl = document.querySelector('.toast');
        let toast = new bootstrap.Toast(toastEl);
        
        if (data["m"] == "s"){
            document.querySelector(".toast-body").innerHTML = "Added new member"
            document.querySelector("#modalclose-btn").click()
            toast.show();
            internal_refresh()

            

        }
        else if (data["m"] == "u"){
            document.querySelector(".toast-body").innerHTML = "Enter a valid user"
            toast.show();
            
        }
        else if (data["m"] == "a"){
            document.querySelector(".toast-body").innerHTML = "User already added"
            toast.show();
            
        }

    })
    
}


function ntsubmit(event){
    const form = document.getElementById("task_form");
    event.preventDefault();
    const formData = new FormData(form);
    fetch(`/newtask/${passing}`,{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token 
        },
        body:JSON.stringify({
            "taskName":formData.get("taskName"),
            "taskDesc":formData.get("taskDesc"),
            "lastDate":formData.get("lastDate"),
            "taskUser":formData.get("taskUser"),
            "priority":formData.get("priority"),
        })
        })
    .then(response => response.json())
    .then(data => {
        let toastEl = document.querySelector('.toast');
        let toast = new bootstrap.Toast(toastEl);
        if (data["m"] == "s"){
            document.querySelector(".toast-body").innerHTML = "Task added successfully"
            document.querySelector("#modalclose-btn").click()
            toast.show();
            internal_refresh()

        }
        else if (data["m"] == "u"){
            document.querySelector(".toast-body").innerHTML = "User does not exist"
            toast.show();
            
        }
        else if (data["m"] == "d"){
            document.querySelector(".toast-body").innerHTML = "Enter a future date"
            toast.show();
           
        }
    })
}


function member_remove(username){
    console.log("remove")
    fetch(`/removemember/${passing}/${username}`,{
        method:"PUT",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token 
        },
        
    })
    .then( () => {document.querySelector(".toast-body").innerHTML = "User removed successfully";
        let toastEl = document.querySelector('.toast');
        let toast = new bootstrap.Toast(toastEl);
        document.querySelector("#modalclose-btn").click();
        toast.show();
        internal_refresh();}
    )
}


function internal_refresh(){

    document.querySelector(".members").innerHTML = '<label style="color: grey;margin: 8px;"> Members</label>'
    document.querySelector(`.active-scroll`).innerHTML=''
    document.querySelector(`.completed-scroll`).innerHTML=''
    document.querySelector(`.backlog-scroll`).innerHTML=''
    document.querySelector(`.tasks-scroll`).innerHTML=''
    page_render();
    taskfetch();
}