
const taskInput = document.getElementById('task-input');
const taskType = document.getElementById('task-type');
const addTaskButton = document.getElementById('add-task');
const dailyTasksList = document.getElementById('daily-tasks');
const weeklyTasksList = document.getElementById('weekly-tasks');
const completedTasksList = document.getElementById('completed-tasks');
const taskErrorMessage = document.getElementById('task-error-message');
const noCompletedTasksMessage = document.getElementById('no-completed-tasks');
const completedTasksSection = document.getElementById('completed-tasks-section');
const showCompletedButton = document.getElementById('show-completed');
const moodMessage = document.getElementById('mood-message');
const emojis = document.querySelectorAll('.emoji');
function getTime() {
    const now = new Date();
    return now.toLocaleString();
}
function createTask(taskText, taskCategory) {
    const task = {
        text: taskText,
        category: taskCategory, 
        createdAt: getTime(),
        completedAt: null
    };
    return task;
}
function addTaskToList(task, isCompleted = false) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    if (isCompleted) taskItem.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => {
        taskItem.remove();
        updateNoTaskMessage();
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit');
    editButton.addEventListener('click', () => {
        taskInput.value = task.text;
        addTaskButton.disabled = true;
        addTaskButton.textContent = 'Update Task';
        addTaskButton.removeEventListener('click', addNewTask);
        addTaskButton.addEventListener('click', () => updateTask(task, taskItem));
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);
    taskItem.appendChild(editButton);
    if (task.category === 'daily') {
        dailyTasksList.appendChild(taskItem);
    } else {
        weeklyTasksList.appendChild(taskItem);
    }

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            task.completedAt = getTime();
            taskItem.classList.add('completed');
            addTaskToCompletedList(task);
        }
    });

    updateNoTaskMessage();
}

function addTaskToCompletedList(task) {
    const taskRow = document.createElement('tr');

    const taskCell = document.createElement('td');
    taskCell.textContent = task.text;

    const categoryCell = document.createElement('td');
    categoryCell.textContent = task.category;

    const completedAtCell = document.createElement('td');
    completedAtCell.textContent = task.completedAt;

    taskRow.appendChild(taskCell);
    taskRow.appendChild(categoryCell);
    taskRow.appendChild(completedAtCell);

    completedTasksList.querySelector('tbody').appendChild(taskRow);
    updateNoTaskMessage();
}
function addNewTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        taskErrorMessage.textContent = 'No task to add';
        return;
    }

    const taskCategory = taskType.value;
    const newTask = createTask(taskText, taskCategory);
    addTaskToList(newTask);

    taskInput.value = ''; 
    taskErrorMessage.textContent = ''; 
}

function updateTask(originalTask, taskItem) {
    const newTaskText = taskInput.value.trim();
    if (newTaskText === '') return;

    originalTask.text = newTaskText;
    taskItem.querySelector('span').textContent = newTaskText;

    taskInput.value = '';
    addTaskButton.disabled = false;
    addTaskButton.textContent = 'Add Task';
    addTaskButton.removeEventListener('click', updateTask);
    addTaskButton.addEventListener('click', addNewTask);
}

function updateNoTaskMessage() {
    if (completedTasksList.children.length === 1) {  
        noCompletedTasksMessage.style.display = 'block';
    } else {
        noCompletedTasksMessage.style.display = 'none';
    }
}

showCompletedButton.addEventListener('click', () => {
    completedTasksSection.style.display = completedTasksSection.style.display === 'block' ? 'none' : 'block';
    showCompletedButton.textContent = completedTasksSection.style.display === 'block' ? 'Hide Completed Tasks' : 'Show Completed Tasks';
});
emojis.forEach((emoji) => {
    emoji.addEventListener('click', () => {
        emojis.forEach((emoji) => emoji.classList.remove('highlighted'));
        emoji.classList.add('highlighted');

        const mood = emoji.getAttribute('data-mood');
        switch (mood) {
            case 'happy':
                moodMessage.textContent = "Love to hear that! It sounds like today’s been a great one. Keep enjoying the good vibes!"
                break;
            case 'sad':
                moodMessage.textContent = "It sounds like today has been really challenging. Sometimes everything just feels like it's too much, but it's okay to have those days. Better moments are just around the corner, and things will look up soon."
                break;
                case 'neutral':
                moodMessage.textContent = "Sounds like it was just one of those average days. Hopefully, tomorrow brings something a little more exciting!"
                break;
        }
    });
});
addTaskButton.addEventListener('click', addNewTask);