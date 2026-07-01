const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let nextId =
    tasks.length > 0
        ? Math.max(...tasks.map(task => task.id)) + 1
        : 1;

let currentFilter = "all";

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const totalTasks = document.getElementById("total-tasks");
const taskSummary = document.getElementById("task-summary");

const allFilterBtn = document.getElementById("all-filter");
const activeFilterBtn = document.getElementById("active-filter");
const completedFilterBtn = document.getElementById("completed-filter");

addBtn.addEventListener("click", handleAddTask);
taskList.addEventListener("click", handleToggleComplete);
taskInput.addEventListener("keydown", handleEnterKey);

allFilterBtn.addEventListener("click", () => handleFilterChange("all"));
activeFilterBtn.addEventListener("click", () => handleFilterChange("active"));
completedFilterBtn.addEventListener("click", () => handleFilterChange("completed"));

// Initial app setup
handleFilterChange("all");

function renderTasks() {
    taskList.innerHTML = "";

    updateCounter();

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        renderTask(task);
    });

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}

function renderTask(task) {
    const li = document.createElement("li");
    li.style.animation = "fadeIn 0.2s ease";
    li.dataset.id = task.id;

    if (task.completed) {
        li.classList.add("completed");
    }

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("task-actions");

    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);

    li.appendChild(taskText);
    li.appendChild(buttonGroup);

    taskList.appendChild(li);
}

function updateCounter() {
    const total = tasks.length;
    const active = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;

    totalTasks.textContent = `${total} Task${total === 1 ? "" : "s"}`;
    taskSummary.textContent = `${active} Active • ${completed} Completed`;
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

function handleEnterKey(event) {
    if (event.key === "Enter") {
        handleAddTask();
    }
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

    if (clickedElement.classList.contains("edit-btn")) {
        const li = clickedElement.closest("li");
        const taskId = Number(li.dataset.id);

        handleEditTask(taskId);
        return;
    }

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

function handleEditTask(taskId) {
    const task = tasks.find(taskItem => taskItem.id === taskId);

    if (!task) {
        return;
    }

    const li = taskList.querySelector(`li[data-id="${taskId}"]`);

    if (!li) {
        return;
    }

    const taskText = li.querySelector("span");

    if (!taskText) {
        return;
    }

    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.classList.add("edit-input");

    let isFinished = false;

    const replaceInputWithTaskText = () => {
        input.replaceWith(taskText);
    };

    const finishEdit = () => {
        if (isFinished) {
            return;
        }

        isFinished = true;

        const trimmedText = input.value.trim();

        if (trimmedText === "") {
            replaceInputWithTaskText();
            return;
        }

        task.text = trimmedText;
        saveTasks();
        renderTasks();
    };

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            finishEdit();
        } else if (event.key === "Escape") {
            event.preventDefault();
            isFinished = true;
            replaceInputWithTaskText();
        }
    });

    input.addEventListener("blur", finishEdit);

    taskText.replaceWith(input);
    input.focus();
    input.select();
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

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}