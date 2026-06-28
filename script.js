const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let nextId =
    tasks.length > 0
        ? Math.max(...tasks.map(task => task.id)) + 1
        : 1;

let currentFilter = "all";

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

const allFilterBtn = document.getElementById("all-filter");
const activeFilterBtn = document.getElementById("active-filter");
const completedFilterBtn = document.getElementById("completed-filter");

addBtn.addEventListener("click", handleAddTask);
taskList.addEventListener("click", handleToggleComplete);

allFilterBtn.addEventListener("click", () => handleFilterChange("all"));
activeFilterBtn.addEventListener("click", () => handleFilterChange("active"));
completedFilterBtn.addEventListener("click", () => handleFilterChange("completed"));


handleFilterChange("all");

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        renderTask(task);
    });
}

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

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

function handleFilterChange(filter) {
    currentFilter = filter;

    allFilterBtn.classList.remove("active");
    activeFilterBtn.classList.remove("active");
    completedFilterBtn.classList.remove("active");

    if (filter === "all") {
        allFilterBtn.classList.add("active");
    } else if (filter === "active") {
        activeFilterBtn.classList.add("active");
    } else {
        completedFilterBtn.classList.add("active");
    }

    renderTasks();
}

function handleToggleComplete(event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains("delete-btn")) {
        const li = clickedElement.closest("li");
        const taskId = Number(li.dataset.id);

        handleDeleteTask(taskId);
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
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function handleDeleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return;
    }

    tasks.splice(taskIndex, 1);

    saveTasks();
    renderTasks();
}