function taskCard(args) {

  let str = `<div class="${timeframe} task-wrapper card card-body draggable" data-task-id="${taskId}">
                        <i class="fa fa-times-circle delete-button" aria-hidden="true"></i> 
                        <i class="fa fa-pencil edit-button" aria-hidden="true"></i> 
                        ${args.event} - Duedate: ${args.date}
                      </div>`;
  $(".delete-button").on("click", function (e) {
    const taskName = $(this).parent().text().trim().split('-')[0].trim();
    removeTaskByName(taskName);
    $(this).parent().remove();
  });
  $(".draggable").draggable({
    revert: "invalid",
    stack: ".draggable",
    helper: "clone",
    zIndex: 1000,
    cursor: "move"
  });
  return str
}

function handleEditTask() {
  let event = $("#event").val();
  let datepicker = $("#datepicker").val();
  let timeframe = compareDate(datepicker);
  const taskId = tasks.length + 1;
  const newTask = { taskId, taskName: event, taskDueDate: datepicker, taskCategory: "to-do" };
  tasks.push(newTask);
  setLocalStorage("my tasks", tasks);
  const laneSelector = "#todo-cards";
  const taskCard = `<div class="${timeframe} task-wrapper card card-body draggable" data-task-id="${taskId}">
                        <i class="fa fa-times-circle delete-button" aria-hidden="true"></i> 
                        <i class="fa fa-pencil edit-button" aria-hidden="true"></i> 
                        ${event} - Duedate: ${datepicker}
                      </div>`;

  $(laneSelector).append(taskCard);
  $(".delete-button").on("click", function (e) {
    const taskName = $(this).parent().text().trim().split('-')[0].trim();
    removeTaskByName(taskName);
    $(this).parent().remove();
  });
  $(".draggable").draggable({
    revert: "invalid",
    stack: ".draggable",
    helper: "clone",
    zIndex: 1000,
    cursor: "move"
  });
}

function handleAddTask() {
  let event = $("#event").val();
  let datepicker = $("#datepicker").val();
  let timeframe = compareDate(datepicker);
  const taskId = tasks.length + 1;
  const newTask = { taskId, taskName: event, taskDueDate: datepicker, taskCategory: "to-do" };
  tasks.push(newTask);
  setLocalStorage("my tasks", tasks);
  const laneSelector = "#todo-cards";
  const taskCard = `<div class="${timeframe} task-wrapper card card-body draggable" data-task-id="${taskId}">
                        <i class="fa fa-times-circle delete-button" aria-hidden="true"></i> 
                        <i class="fa fa-pencil edit-button" aria-hidden="true"></i> 
                        ${event} - Duedate: ${datepicker}
                      </div>`;
  $(laneSelector).append(taskCard);
  $(".delete-button").on("click", function (e) {
    const taskName = $(this).parent().text().trim().split('-')[0].trim();
    removeTaskByName(taskName);
    $(this).parent().remove();
  });
  $(".edit-button").on("click", function (e) {
    const taskName = $(this).parent().text().trim().split('-')[0].trim();
    removeTaskByName(taskName);
    $(this).parent().remove();
  });
  $(".draggable").draggable({
    revert: "invalid",
    stack: ".draggable",
    helper: "clone",
    zIndex: 1000,
    cursor: "move"
  });
}

function renderTaskList() {
  const lanes = {
    "to-do": "#todo-cards",
    "in-progress": "#in-progress-cards",
    "done": "#done-cards"
  };

  tasks.forEach(task => {
    const laneId = task.taskCategory;
    const laneSelector = lanes[laneId];
    const timeframe = compareDate(task.taskDueDate);
    const taskCard = `<div class="${timeframe} task-wrapper card card-body draggable" data-task-id="${task.taskId}">
                                    <i class="fa fa-times-circle delete-button" aria-hidden="true"></i> 
                                    <i class="fa fa-pencil edit-button" aria-hidden="true"></i> 
                                    ${task.taskName} - Duedate: ${task.taskDueDate}
                                  </div>`;
    $(laneSelector).append(taskCard);
  });

  $(".delete-button").on("click", function (e) {
    const taskName = $(this).parent().text().trim().split('-')[0].trim();
    removeTaskByName(taskName);
    $(this).parent().remove();
  });
  $(".edit-button").on("click", function (e) {
    const taskName = $(this).parent().text().trim().split('-')[0].trim();
    removeTaskByName(taskName);
    $(this).parent().remove();
  });
}



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

function createTaskCard(task) {
  $("#dialog-message").dialog({
    modal: true,
    buttons: {
      Add: function () {
        handleAddTask();
        $(this).dialog("close");
      }
    }
  });
  $("#dialog-message").html('<input type="text" placeholder="Enter Task" id="event"><input type="text" id="datepicker" placeholder="Enter Date">');
}

function editTaskCard() {
  $("#dialog-message").dialog({
    modal: true,
    buttons: {
      Add: function () {
        handleEditTask();
        $(this).dialog("close");
      }
    }
  });
  $("#dialog-message").html('<input type="text" placeholder="Enter Task" id="event"><input type="text" id="datepicker" placeholder="Enter Date">');
}

$(document).ready(function () {
  tasks = getLocalStorage("my tasks")
  renderTaskList();

  const today = dayjs();
  let date = today.format('MMM D, YYYY');
  $('#todays-date').html(date);

  $(".delete-button").on("click", (e) => handleDeleteTask(e));

  $("#add-task").on("click", function () {
    createTaskCard("task");
    $("#datepicker").datepicker();
  });

  $(".edit-button").on("click", function () {
    editTaskCard("task");
    $("#datepicker").datepicker();

  });

  $(".draggable").draggable({
    revert: "invalid",
    stack: ".draggable",
    helper: "clone",
    zIndex: 1000,
    cursor: "move"
  });

  $(".droppable").droppable({
    accept: ".draggable",
    drop: function (event, ui) {
      const taskId = ui.draggable.data('task-id');
      const newCategory = $(this).closest('.lane').attr('id');
      const task = tasks.find(task => task.taskId === taskId);
      task.taskCategory = newCategory;
      ui.draggable.detach().appendTo($(this));

    }
  });
});