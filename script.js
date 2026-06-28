const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let nextId =
    tasks.length > 0
        ? Math.max(...tasks.map(task => task.id)) + 1
        : 1;

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

addBtn.addEventListener("click", handleAddTask);
taskList.addEventListener("click", handleToggleComplete);

tasks.forEach(task => {
    renderTask(task);
});

function renderTask(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    if (task.completed) {
        li.classList.add("completed");
    }

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    li.appendChild(taskText);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

function handleAddTask() {
    const trimmedTaskText = taskInput.value.trim();

    if (trimmedTaskText === "") {
        return;
    }

    const newTask = {
        id: nextId,
        text: trimmedTaskText,
        completed: false
    };

    tasks.push(newTask);
    nextId++;

    renderTask(newTask);
    saveTasks();

    taskInput.value = "";
    taskInput.focus();
}

function handleToggleComplete(event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains("delete-btn")) {
        const li = clickedElement.closest("li");
        const taskId = Number(li.dataset.id);

        handleDeleteTask(taskId, li);
        return;
    }

    const li = clickedElement.closest("li");

    if (!li) {
        return;
    }

    const taskId = Number(li.dataset.id);

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;
    saveTasks();

    li.classList.toggle("completed");
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function handleDeleteTask(taskId, li) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return;
    }

    tasks.splice(taskIndex, 1);
    saveTasks();

    li.remove();
}