// Retrieve tasks from local storage
let tasks = getLocalStorage("my tasks");

// When the document is ready
$(document).ready(function () {
  // Get today's date and format it
  const today = dayjs();
  let date = today.format('MMM D, YYYY');
  // Display today's date
  $('#todays-date').html(date);
  // List the tasks
  list();
  // Initialize event handlers
  init();
});

// Initialize event handlers
function init() {
  // Add task button click event
  $("#add-task").on("click", function () {
    // Open dialog for adding task
    $("#dialog-message").dialog({
      modal: true,
      buttons: {
        Add: function () {
          add(); // Add task
          $(this).dialog("close"); // Close dialog
        }
      }
    });
    // Set dialog content (input fields)
    $("#dialog-message").html('<input type="text" placeholder="Enter Task" id="event"><input type="text" id="datepicker" placeholder="Enter Date">');
    $("#datepicker").datepicker(); // Add datepicker to date input
  });

  // Delete task button click event
  $(".delete-button").on("click", (e) => remove(e));

  // Edit task button click event
  $(".edit-button").on("click", function (e) {
    $("#dialog-message").dialog({ // Open dialog for editing task
      modal: true,
      buttons: {
        Edit: () => {
          edit(); // Edit task
          $(this).dialog("close"); // Close dialog
        }
      }
    });
    // Set dialog content (input fields)
    $("#dialog-message").html('<input type="text" placeholder="Enter Task" id="event"><input type="text" id="datepicker" placeholder="Enter Date">');
    $("#datepicker").datepicker(); // Add datepicker to date input
  });

  // Make tasks draggable
  $(".draggable").draggable({ revert: "invalid", stack: ".draggable", helper: "clone", zIndex: 1000, cursor: "move" });

  // Make lanes droppable
  $(".droppable").droppable({
    accept: ".draggable",
    drop: function (event, ui) {
      // Move task to new category
      const taskId = ui.draggable.data("task-id");
      const newCategory = $(this).closest(".lane").attr("id");
      const task = tasks.find(task => task.taskId === taskId);
      task.taskCategory = newCategory;
      ui.draggable.detach().appendTo($(this));
      ui.draggable.removeClass("to-do in-progress done").addClass(newCategory);

      setLocalStorage("my tasks", tasks); // Update local storage
    }
  });
}

// List tasks in respective lanes
function list() {
  const lanes = {
    "to-do": "#todo-cards",
    "in-progress": "#in-progress-cards",
    "done": "#done-cards"
  };

  // Append tasks to respective lanes
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

// Remove task
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
  setLocalStorage("my tasks", tasks); // Update local storage
}

// Edit task
function edit() {
  let event = $("#event").val();
  let datepicker = $("#datepicker").val();
  let timeframe = compareDate(datepicker);
  const taskId = tasks.length + 1;
  const newTask = { taskId: taskId, taskName: event, taskDueDate: datepicker, taskCategory: "to-do" };

  const index = tasks.findIndex(task => task.taskName === event);

  if (index !== -1) {
    tasks.splice(index, 1);
    setLocalStorage("my tasks", tasks);
    console.log(`Task ${taskName} edited successfully.`);
    $(e.target).parent().remove();
  } else {
    console.log(`Task ${taskName} not found.`);
  }

  init(); // Reinitialize event handlers
}

// Add task
function add() {
  let event = $("#event").val();
  let datepicker = $("#datepicker").val();
  let timeframe = compareDate(datepicker);
  const taskId = tasks.length + 1;
  const newTask = { taskId: taskId, taskName: event, taskDueDate: datepicker, taskCategory: "to-do" };
  tasks.push(newTask);
  setLocalStorage("my tasks", tasks); // Update local storage
  const laneSelector = "#todo-cards";
  const taskCard = `<div class="${timeframe} task-wrapper card card-body draggable" data-task-id="${taskId}">
     <i class="fa fa-times-circle delete-button mr-2" aria-hidden="true"></i> 
     <i class="fa fa-edit edit-button" aria-hidden="true"></i>
     ${event} - Duedate: ${datepicker}
     </div>`;
  $(laneSelector).append(taskCard);

  init(); // Reinitialize event handlers
}

// Set item in local storage
function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Get item from local storage
function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// Compare task due date with today's date
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