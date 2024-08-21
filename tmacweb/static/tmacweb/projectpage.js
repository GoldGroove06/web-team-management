document.addEventListener("DOMContentLoaded", function(){
    page_render();
   taskfetch();
   console.log(user_id)
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
            }
            else if (data.tasks[i].status == "active"){
                icon.className = "bi bi-check-square";
            }
            else if (data.tasks[i].status == "completed"){
                icon.className = "bi bi-check-square-fill";
            }
            else if (data.tasks[i].status == "backlog") {
                icon.className = "bi bi-check-square";
                icon.style.color = "red";
            }

            icon.setAttribute("data_id",`${data.tasks[i].task_id}`)
            icon.setAttribute("data-status",`${data.tasks[i].status}` )
            icon.setAttribute("onclick", "taskChange()")
            el.appendChild(icon)
            el.innerHTML +=` <b>${data.tasks[i].task}</b>  <br> ${data.tasks[i].task_info} `
            document.querySelector(`.${data.tasks[i].status}`).append(el);    

        }
    })
}

function taskChange(){
    console.log("Arsh")
}
