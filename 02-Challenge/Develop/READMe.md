const today = dayjs();
$('#1a').text(today.format('MMM D, YYYY'));

// 2. What is the day of the week today?
const dayWeek = today.format('[Today is] dddd');
$('#2a').text(dayWeek);

// 3. Parse the following date, 11/3/2020, and convert it into the following format: Sunday, February 14 2010, 3:25:50 pm.
const reformatDate = dayjs('2020-11-03').format('dddd, MMMM D YYYY, h:mm:ss a');
$('#3a').text(reformatDate);

// 4. I need to place my recycling bin on the curb on every odd week of the year for collection. Do I need to put out my recycling bin out this week?
// Dayjs' .diff() method does NOT include partial weeks in its calculation.
const beginningOfYear = dayjs('2022-01-01');
const weekNum = today.diff(beginningOfYear, 'week');

// Check for odd week, then assign boolean to variable
let  takeOut = weekNum % 2 === 1;
$('#4a').text(`${takeOut}, because it's currently week  ${weekNum}`);

GIVEN I am using a daily planner to create a schedule
WHEN I open the planner
THEN the current day is displayed at the top of the calendar
WHEN I scroll down
THEN I am presented with time blocks for standard business hours of 9am to 5pm
WHEN I view the time blocks for that day
THEN each time block is color-coded to indicate whether it is in the past, present, or future
WHEN I click into a time block
THEN I can enter an event
WHEN I click the save button for that time block
THEN the text for that event is saved in local storage
WHEN I refresh the page
THEN the saved events persist

function generateTaskId() {
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    let maxId = 0;
    taskList.forEach(task => {
        if (task.id > maxId) {
            maxId = task.id;
        }
    });
    const uniqueId = maxId + 1;
    return uniqueId;
}
