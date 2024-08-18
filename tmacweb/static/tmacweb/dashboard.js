document.addEventListener('DOMContentLoaded', function() {
    calendar_render();
    project_list();
    
   
  });

function calendar_render() {
  fetch("/calendarfetch",{
    method:"GET"
  })
  .then(response => response.json())
.then(data => {
  
  events_list =[]
  for (let i = 0; i < data.team_tasks.length; i++) {
    console.log(data.team_tasks[i])
    let [date, time] = data.team_tasks[i].last_date.split("T")
    
    events_list.push(
      { id : data.team_tasks[i].task_id,
        title : data.team_tasks[i].task,
        start:date,
        end : date,
        extendedProps:{
          desc: data.team_tasks[i].task_info
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
              desc: data.user_tasks[i].task_info
            }
          }
        )
          }
    
  console.log(events_list)
  let calendarEl = document.getElementById('calendar');
  let calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: events_list,
      
      eventClick: function (info) {
        document.querySelector(".modal-title").innerHTML = `${info.event.title}`
        document.querySelector("#calendarTask").innerHTML = `${info.event.extendedProps.desc}`
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
    childdiv.innerHTML = `${data[i].project_name} <br>${data[i].project_info}`;

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
    document.querySelector(".modal-title").innerHTML = `<a href="project/${t}">${data.project.project_name}</a>`
    
    document.querySelector(".taskContainer").innerHTML = " "
    document.querySelector(".membersContainer").innerHTML = " "

    for (let i = 0; i < data.tasks.length; i++){
      
      const el = document.createElement("div").innerHTML=` ${data.tasks[i].task}   ${data.tasks[i].task_info}`
      document.querySelector(".taskContainer").append(el);
    }
    for (let i = 0; i < data.members.length; i++){
      document.querySelector(".membersContainer").append(data.members[i])
    }
    document.querySelector("#calendarTask").className = "inactive"
    document.querySelector("#ProjectContainer").className = "active"
    document.querySelector("#btn-sds").click();
});
  


}

function redirect() {
   window.location.href = "/project/1"
   member_add()
}