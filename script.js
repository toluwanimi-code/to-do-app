const tasks = [];
let nextId = 1;

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

addBtn.addEventListener("click", handleAddTask);
taskList.addEventListener("click", handleToggleComplete);

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

    const li = document.createElement("li");
    li.dataset.id = newTask.id;
    li.textContent = trimmedTaskText;

    taskList.appendChild(li);

    taskInput.value = "";
    taskInput.focus();
}

function handleToggleComplete(event) {
    const clickedElement = event.target;

    if (clickedElement.tagName !== "LI") {
        return;
    }

    const taskId = Number(clickedElement.dataset.id);

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;
    clickedElement.classList.toggle("completed");
}