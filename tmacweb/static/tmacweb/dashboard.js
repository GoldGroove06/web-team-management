document.addEventListener('DOMContentLoaded', function() {
    calendar_render();
    project_list();
    
   
  });

function calendar_render() {
  fetch("/taskfetch",{
    method:"GET"
  })
  .then(response => response.json())
.then(data => {
  
  events_list =[]
  for (let i = 0; i < data.team_tasks.length; i++) {
  
    let [date, time] = data.team_tasks[i].last_date.split("T")
    
    events_list.push(
      { id : data.team_tasks[i].task_id,
        title : data.team_tasks[i].task,
        start:date,
        end : date,
        extendedProps:{
          desc: data.team_tasks[i].task_info,
          ldate:date,
          priority:data.team_tasks[i].priority,

        }
      }
    )
      }
    for (let i = 0; i < data.user_tasks.length; i++) {
        
        let [date, time] = data.user_tasks[i].last_date.split("T")
        
        events_list.push(
          { id : data.user_tasks[i].task_id,
            title : data.user_tasks[i].task,
            start:date,
            end : date,
            extendedProps:{
              desc: data.user_tasks[i].task_info,
              ldate:date,
              priority:data.team_tasks[i].priority,
            }
          }
        )
          }
    

  let calendarEl = document.getElementById('calendar');
  let calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: events_list,
      
      
      eventClick: function (info) {
        console.log(info.event.extendedProps.desc)
        document.querySelector(".modal-title").innerHTML = `${info.event.title} <br><span class="project-deadline" style="font-size: 13px">Last date: ${info.event.extendedProps.ldate}</span>`
        document.querySelector("#calendarTask").innerHTML = `${info.event.extendedProps.desc}<br> <span class="project-deadline" style="font-size: 13px">Priority: ${info.event.extendedProps.priority}</span>`
        document.querySelector("#calendarTask").className = "active"
        document.querySelector("#ProjectContainer").className = "inactive"
        document.querySelector("#btn-sds").click();
       
      },
    });
  calendar.render();
  

  })


};



function project_list() {
fetch("/projectlistapi",{
  method:'GET'
})
.then(response => response.json())
.then(data => {
  
  for (let i = 0; i < Object.keys(data).length; i++) {
   
    const childdiv = document.createElement("div");
    childdiv.setAttribute("data-key", data[i].project_id);
    childdiv.className = "listdiv"
    childdiv.innerHTML = `${data[i].project_name}  <span class="project-deadline" style="float:right">Project Deadline:<br> ${data[i].project_deadline}</span>`;

    document.querySelector("#projects").append(childdiv);
    
    
  }
  project_listner();

  
} );


};

function project_listner() {
  var div_list = document.getElementsByClassName("listdiv");
  
  for (let i = 0; i < div_list.length; i++){
    div_list[i].addEventListener("click", function() {project_modal(div_list[i])});
    
  }
  
};


function project_modal(element) {
  const t = element.getAttribute("data-key")
  fetch(`projectfetch/${t}`,{
    method:'GET'
  })
  .then(response => response.json())
  .then(data => {
    document.querySelector("#calendarTask").innerHTML = ``
    document.querySelector(".task_info").innerHTML=''
    document.querySelector(".modal-title").innerHTML = `<a href="project/${t}">${data.project.project_name} <i class="bi bi-box-arrow-up-right" ></i></a><br><div class="project-deadline">Project Deadline:${data.project.project_deadline}</div> `
  
    document.querySelector(".members").innerHTML = '<label style="margin: 8px;"> Members</label>'
    document.querySelector(".task_info").innerHTML=`${data.project.project_info} `

    document.querySelector(".progress-bar").innerHTML=`${data.progress.percentage}%`
    document.querySelector(".progress-bar").style.width=`${data.progress.percentage}%`

    document.querySelector(".stats").innerHTML = `<div ><span> In Progress: ${data.progress.active}</span>  <span style="float:right" > To Do Backlog: ${data.progress.backlog}</span> </div>
   <div><span> Done: ${data.progress.completed}</span> <span style="float:right" >  To Do: ${data.progress.tasks}</span></div>
             `;
    for (let i = 0; i < data.members.length; i++){
      member_div = document.createElement("div")
      member_div.className = "member-div"
      member_div.innerHTML = `<b>${data.members[i]}</b>`
      document.querySelector(".members").append(member_div)
      }
   
    document.querySelector("#ProjectContainer").className = "active"
    document.querySelector("#btn-sds").click();
});
  


}

