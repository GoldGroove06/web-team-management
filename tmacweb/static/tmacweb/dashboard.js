document.addEventListener('DOMContentLoaded', function() {
    calendar_render();
    project_list();
   
  });

function calendar_render() {
  var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: [
        { title: 'Event 1', start: '2024-08-10' },
        { title: 'Event 2', start: '2024-08-15', end: '2024-08-17' }
      ]
    });
    calendar.render();
};

function project_list() {
fetch("/projectlistapi",{
  method:'GET'
})
.then(response => response.json())
.then(data => {
  console.log(data);
  for (let i = 0; i < Object.keys(data).length; i++) {
    console.log(data[i].project_name)
    const childdiv = document.createElement("div");
    childdiv.setAttribute("data-key", data[i].project_id);
    childdiv.className = "listdiv"
    childdiv.innerHTML = `${data[i].project_name} <br>${data[i].project_info}`;

    document.querySelector("#projects").append(childdiv);
    console.log(document.querySelector("#projects"));
    
  }
  project_listner();

  
} );


};

function project_listner() {
  var div_list = document.getElementsByClassName("listdiv");
  console.log(div_list);
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
    console.log(data.tasks)
    document.querySelector(".taskContainer").innerHTML = " "
    document.querySelector(".membersContainer").innerHTML = " "

    for (let i = 0; i < data.tasks.length; i++){
      
      const el = document.createElement("div").innerHTML=` ${data.tasks[i].task}   ${data.tasks[i].task_info}`
      document.querySelector(".taskContainer").append(el);
    }
    for (let i = 0; i < data.members.length; i++){
      document.querySelector(".membersContainer").append(data.members[i])
    }
    
    document.querySelector("#btn-sds").click();
});
  


}