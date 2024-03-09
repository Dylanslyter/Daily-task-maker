let tasks = []
function removeTaskByName(taskName) {
  const index = tasks.findIndex(task => task.taskName === taskName);
  if (index !== -1) {
      tasks.splice(index, 1);
      console.log(`Task ${taskName} removed successfully.`);
  } else {
      console.log(`Task ${taskName} not found.`);
  }
}
function compareDate(inputDate) {
  const date = new Date(inputDate);
  const currentDate = new Date();
  const inputDateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  if (inputDateWithoutTime.toDateString() === currentDateWithoutTime.toDateString()) {
      return 'present';
  } else if (inputDateWithoutTime < currentDateWithoutTime) {
      return 'past';
  } else {
      return 'future';
  }
}
function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function createTaskCard(task) {
    $( "#dialog-message" ).dialog({
        modal: true,
        buttons: {
          Add: function() {
            handleAddTask()
            $( this ).dialog( "close" );
          }
        }
      });
      $("#dialog-message").html('<input type="text" placeholder="Enter Task" id="event"><input type="text" id="datepicker" placeholder="Enter Date">')
}
function renderTaskList() {
  if (tasks && tasks.length)
tasks.forEach((t) => {
  let timeframe =compareDate(t.taskDueDate)
$("#todo-cards").append(`<div class="${timeframe} task-wrapper card card-body"><i class="fa fa-times-circle delete-button" aria-hidden="true"></i> ${t.taskName} - Duedate: ${t.taskDueDate}</div>`)
})
}
function handleAddTask(){
let event = $("#event").val()
let datepicker = $("#datepicker").val()
let timeframe =compareDate(datepicker)
$("#todo-cards").append(`<div class="${timeframe} task-wrapper card card-body"><i class="fa fa-times-circle delete-button" aria-hidden="true"></i> ${event} - Duedate: ${datepicker}</div>`)
$(".delete-button") .on("click", (e) => handleDeleteTask (e));
tasks.push({taskName:event,taskDueDate:datepicker})
setLocalStorage("my tasks",tasks)
}
function handleDeleteTask(event){
console.log(event) 
var parentElement = event.target.parentElement;
var parentText = parentElement.textContent.trim();
console.log(parentText)
let parts = parentText.split ("-")
let taskname = parts[0] .trim()
removeTaskByName(taskname)
console.log(taskname)
event.target.parentElement.remove()
setLocalStorage("my tasks",tasks)
}
function handleDrop(event, ui) {
}
$(document).ready(function () {
  tasks = getLocalStorage("my tasks")
  renderTaskList()
  const today = dayjs();
  let date=today.format('MMM D, YYYY')
  console.log(date)
  $('#todays-date').html(date);

  $(".delete-button") .on("click", (e) => handleDeleteTask (e));

$("#add-task") .on("click", function(){
   createTaskCard("task")
   $( "#datepicker" ).datepicker();

})
});
