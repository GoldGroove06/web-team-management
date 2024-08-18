document.addEventListener("DOMContentLoaded", function(){
    page_render();
   
})

function page_render(){
    
    
    fetch(`/projectfetch/${passing}`,{
        method:'GET'
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector(".project_name").innerHTML=`${data.project.project_name}`
        document.querySelector(".project_desc").innerHTML=`${data.project.project_info}`
        for (let i = 0; i < data.tasks.length; i++){
        
            const el = document.createElement("div").innerHTML=` ${data.tasks[i].task}   ${data.tasks[i].task_info}`
            document.querySelector(".project_tasks").append(el);
            }
        for (let i = 0; i < data.members.length; i++){
            document.querySelector(".members").append(data.members[i])
            }
       })

   
}

function member_add(){
    document.querySelector(".modal-title").innerHTML="Add new member"
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


