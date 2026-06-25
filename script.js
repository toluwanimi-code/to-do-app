const tasks =[];
let nextId = 1;

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
console.log(taskInput);
console.log(addBtn);
console.log(taskList);

function handleAddTask() {
    console.log(taskInput.value);
}

addBtn.addEventListener("click", handleAddTask);

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
    li.textContent = trimmedTaskText;
    taskList.appendChild(li);

    taskInput.value = "";
    taskInput.focus();
}
