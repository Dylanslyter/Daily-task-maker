let tasks = getLocalStorage("my tasks")

$(document).ready(function () {
  const today = dayjs();
  let date = today.format('MMM D, YYYY');
  $('#todays-date').html(date);
  list();

  init()
});

function init() {
  
  $("#add-task").on("click", function () {
  $("#dialog-message").dialog({
    modal: true,
    buttons: {
      Add: function () {
        add();
        $(this).dialog("close");
      }
    }
  });
  $("#dialog-message").html('<input type="text" placeholder="Enter Task" id="event"><input type="text" id="datepicker" placeholder="Enter Date">');
    $("#datepicker").datepicker();
  });


  $(".delete-button").on("click", (e) => remove(e));

  
  $(".edit-button").on("click", function (e) { 

    $("#dialog-message").dialog({ modal: true, buttons: { Edit: () => { edit(); $(this).dialog("close");} }});
    $("#dialog-message").html('<input type="text" placeholder="Enter Task" id="event"><input type="text" id="datepicker" placeholder="Enter Date">');
    $("#datepicker").datepicker();
  });

  $(".draggable").draggable({ revert: "invalid", stack: ".draggable", helper: "clone", zIndex: 1000, cursor: "move" });

  $(".droppable").droppable({
    accept: ".draggable",
    drop: function(event, ui) {
      const taskId = ui.draggable.data("task-id");
      const newCategory = $(this).closest(".lane").attr("id");
      const task = tasks.find(task => task.taskId === taskId);
      task.taskCategory = newCategory;
      ui.draggable.detach().appendTo($(this));
      ui.draggable.removeClass("to-do in-progress done").addClass(newCategory);
    
      setLocalStorage("my tasks", tasks);
    }
  });

}

function list() {
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
       <i class="fa fa-times-circle mr-2 delete-button" aria-hidden="true"></i> 
       <i class="fa fa-edit edit-button" aria-hidden="true"></i>
       ${task.taskName} - Duedate: ${task.taskDueDate}
       </div>`;
    $(laneSelector).append(taskCard);
  });

}

function remove(e) {
  const taskId = $(e.target).closest('.task-wrapper').data('task-id');
  const index = tasks.findIndex(task => task.taskId === taskId);
  if (index !== -1) {
    const removedTask = tasks.splice(index, 1)[0];
    console.log(`Task "${removedTask.taskName}" removed successfully.`);
    $(e.target).closest('.task-wrapper').remove();
  } else {
    console.log(`Task with ID "${taskId}" not found.`);
  }
  setLocalStorage("my tasks", tasks)
}

function edit() {
  let event = $("#event").val();
  let datepicker = $("#datepicker").val();
  let timeframe = compareDate(datepicker);
  const taskId = tasks.length + 1;
  const newTask = { taskId: taskId, taskName: event, taskDueDate: datepicker, taskCategory: "to-do" };

  const index = tasks.findIndex(task => task.taskName === event);

  if (index !== -1) {
    tasks.splice(index, 1);
    setLocalStorage("my tasks",tasks)
    console.log(`Task ${taskName} edited successfully.`);
    $(e.target).parent().remove();
  } else {
    console.log(`Task ${taskName} not found.`);
  }

  init()

}

function add() {
  let event = $("#event").val();
  let datepicker = $("#datepicker").val();
  let timeframe = compareDate(datepicker);
  const taskId = tasks.length + 1;
  const newTask = { taskId: taskId, taskName: event, taskDueDate: datepicker, taskCategory: "to-do" };
  tasks.push(newTask);
  setLocalStorage("my tasks", tasks);
  const laneSelector = "#todo-cards"; 
  const taskCard = `<div class="${timeframe} task-wrapper card card-body draggable" data-task-id="${taskId}">
     <i class="fa fa-times-circle delete-button mr-2" aria-hidden="true"></i> 
     <i class="fa fa-edit edit-button" aria-hidden="true"></i>
     ${event} - Duedate: ${datepicker}
     </div>`;
  $(laneSelector).append(taskCard);

  init()
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
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