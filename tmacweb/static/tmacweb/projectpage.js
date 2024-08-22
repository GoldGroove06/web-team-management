document.addEventListener("DOMContentLoaded", function(){
    page_render();
   taskfetch();
   
})

function page_render(){
    
    
    fetch(`/projectfetch/${passing}`,{
        method:'GET'
    })
    .then(response => response.json())
    .then(data => {
        
        document.querySelector(".project_name").innerHTML=`<b>${data.project.project_name}</b>`
        document.querySelector(".project_desc").innerHTML=`${data.project.project_info}`
        if (data.project.project_user == user_id){
            document.querySelector(".am-btn-div").innerHTML ='<button type="button"  onclick="member_add()">Edit members</button>'
            document.querySelector(".btn-div").innerHTML = '<button type="button"  onclick="task_add()" class = "task-btn">Add Task</button>'
        }
        
        for (let i = 0; i < data.members.length; i++){
            document.querySelector(".members").append(data.members[i])
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
        for (let i = 0; i < data.tasks.length; i++){
             const el = document.createElement("div")
            el.className = "taskDiv"
            let icon = document.createElement("i");;
             
            if (data.tasks[i].status == "tasks"){
                icon.className = "bi bi-arrow-right-circle";
                icon.id = `${data.tasks[i].task_id}`;
            }
            else if (data.tasks[i].status == "active"){
                icon.className = "bi bi-check-square";
                icon.id = `${data.tasks[i].task_id}`;
            }
            else if (data.tasks[i].status == "completed"){
                icon.className = "bi bi-check-square-fill";
                icon.id = `${data.tasks[i].task_id}`;
            }
            else if (data.tasks[i].status == "backlog") {
                icon.className = "bi bi-check-square";
                icon.id = `${data.tasks[i].task_id}`;
                icon.style.color = "red";
            }
            let stat = data.tasks[i].status
            let id = data.tasks[i].task_id
            
            icon.setAttribute("onclick", `taskChange('${stat}', ${id})`);
            
            el.appendChild(icon)
            el.innerHTML +=` <b>${data.tasks[i].task}</b>  <br> ${data.tasks[i].task_info} `
            if (data.tmleader == user_id){
                el.innerHTML += `task of ${data.tasks[i].user}`
            }

            document.querySelector(`.${data.tasks[i].status}`).append(el);    

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
