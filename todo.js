const openBtn = document.getElementById("open-toggle");
const closeBtn = document.getElementById("close-theme");
const panel = document.getElementById("theme-panel");
const overlay = document.getElementById("overlay");
const themeOptions = document.querySelectorAll(".theme-list li");
const addTaskBtn = document.getElementById("add-task");
const taskFormSection = document.querySelector(".task-form");
const taskForm = document.getElementById("taskForm");
const taskList = document.querySelector(".task-list");
const todos =  [];

function getToDos() {
    const todos = localStorage.getItem("todos");
    console.log(todos);
    return todos ? JSON.parse(todos) : [];

}

openBtn.addEventListener("click", () => {
    panel.classList.add("show");
    overlay.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
    panel.classList.remove("show");
    overlay.classList.add("hidden");
});

overlay.addEventListener("click", () => {
    panel.classList.remove("show");
    overlay.classList.add("hidden");
});

themeOptions.forEach(option => {    
    option.addEventListener("click", () => {
        const selectedTheme = option.getAttribute("data-theme");
        document.body.className = "theme-"+selectedTheme;
        localStorage.setItem("selectedTheme", selectedTheme);
        panel.classList.remove("show");
        overlay.classList.add("hidden");
    });
});

window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
        document.body.className = "theme-"+savedTheme;
    }
});

addTaskBtn.addEventListener("click", () => {
    taskFormSection.classList.toggle("hidden");
    addTaskBtn.classList.toggle("active");
    
    if (!taskFormSection.classList.contains("hidden")) {
        addTaskBtn.innerHTML = 'Cancel';
    } else {
        // Si estamos cancelando, limpiamos todo
        addTaskBtn.innerHTML = '<i class="bi bi-patch-plus"></i> Add New Task';
        taskForm.reset();
        delete taskForm.dataset.editing;
    }
});

const newTask = () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const createdAt = new Date().getTime();
    const id = createdAt; 
    return { id, title, description, done: false, createdAt, updatedAt: null };
}

const handleTaskCheck = (event) => {
    const id = parseInt(event.target.getAttribute("data-id"));
    const todos = getToDos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.done = event.target.checked;
        todo.updatedAt = new Date().getTime();
        
        // Actualizar el estilo de tachado
        const taskText = event.target.closest('.task-item').querySelector('.task-text');
        if (todo.done) {
            taskText.classList.add('done');
        } else {
            taskText.classList.remove('done');
        }
        
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

const deleteTask = (id) => {
    let todos = getToDos();
    todos = todos.filter(t => t.id !== id);
    localStorage.setItem("todos", JSON.stringify(todos));
    drawTasks();
}

const handleEdit = (id) => {
    const todos = getToDos();
    const todo = todos.find(t => t.id === parseInt(id));
    if (todo) {
        // Rellenar el formulario con los datos existentes
        document.getElementById("title").value = todo.title;
        document.getElementById("description").value = todo.description;
        
        // Mostrar el formulario
        taskFormSection.classList.remove("hidden");
        addTaskBtn.classList.add("active");
        addTaskBtn.innerHTML = 'Cancel';
        
        // Cambiar el comportamiento del formulario para edición
        taskForm.dataset.editing = id;
    }
}

const drawTasks = () => {
    const todos = getToDos();
    if (todos.length === 0) {
        taskList.innerHTML = `
            <article class="empty">
                        <p class="icon"><i class="bi bi-book"></i></p>
                        <h2>Your notebook is empty</h2>
                        <p>Start by adding your first beautiful task above</p>
                    </article>
            `;
        return;
    } else {
        taskList.innerHTML = "";
        todos.forEach(todo => {
            const li = document.createElement("li");
            li.className = "task-item";
            li.innerHTML = `
                <input type="checkbox" ${todo.done ? "checked" : ""} data-id="${todo.id}" class="task-checkbox">
                <div class="task-text ${todo.done ? "done" : ""}">
                    <h3>${todo.title}</h3>
                    <p>${todo.description}</p>
                </div>
                <div class="task-actions-item">
                    <button class="edit-btn" data-id="${todo.id}"><i class="bi bi-pencil"></i></button>
                    <button class="delete-btn" data-id="${todo.id}"><i class="bi bi-trash"></i></button>
                </div>        
                    `;
            taskList.appendChild(li);
        });

        document.querySelectorAll(".task-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", handleTaskCheck);
        });
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const button = event.target.closest('.delete-btn');
                const id = parseInt(button.getAttribute("data-id"));
                deleteTask(id);
            });
        });
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const button = event.target.closest('.edit-btn');
                const id = button.getAttribute("data-id");
                handleEdit(id);
            });
        });
    }
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const editingId = taskForm.dataset.editing;
    
    if (editingId) {
        // Modo edición
        const todos = getToDos();
        const todo = todos.find(t => t.id === parseInt(editingId));
        if (todo) {
            todo.title = document.getElementById("title").value;
            todo.description = document.getElementById("description").value;
            todo.updatedAt = new Date().getTime();
            localStorage.setItem("todos", JSON.stringify(todos));
        }
        delete taskForm.dataset.editing;
    } else {
        // Modo creación
        const task = newTask();
        const currentTodos = getToDos();
        currentTodos.push(task);
        localStorage.setItem("todos", JSON.stringify(currentTodos));
    }
    
    taskForm.reset();
    taskFormSection.classList.add("hidden");
    addTaskBtn.classList.remove("active");
    addTaskBtn.innerHTML = '<i class="bi bi-patch-plus"></i> Add New Task';
    drawTasks();
});

window.addEventListener("DOMContentLoaded", () => {

    drawTasks();
});
    

deleteBtns.forEach(button => {
    button.addEventListener("click", (event) => {
        const id = parseInt(event.target.getAttribute("data-id"));
        deleteTask(id);
    });
});
