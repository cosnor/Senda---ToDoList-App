// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

// Elementos para el panel de temas
const openBtn = document.getElementById("open-toggle");
const closeBtn = document.getElementById("close-theme");
const panel = document.getElementById("theme-panel");
const overlay = document.getElementById("overlay");
const themeOptions = document.querySelectorAll(".theme-list li");

// Elementos para el formulario de tareas
const addTaskBtn = document.getElementById("add-task");
const taskFormSection = document.querySelector(".task-form");
const taskForm = document.getElementById("taskForm");
const taskList = document.querySelector(".task-list");

// Array global para las tareas (no se usa actualmente)
const todos =  [];

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

/**
 * Obtiene todas las tareas almacenadas en localStorage
 * @returns {Array} Array de tareas o array vacío si no hay datos
 */
function getToDos() {
    const todos = localStorage.getItem("todos");
    console.log(todos);
    return todos ? JSON.parse(todos) : [];
}

// ==========================================
// EVENT LISTENERS PARA EL PANEL DE TEMAS
// ==========================================

// Abrir panel de temas
openBtn.addEventListener("click", () => {
    panel.classList.add("show");
    overlay.classList.remove("hidden");
});

// Cerrar panel de temas con botón close
closeBtn.addEventListener("click", () => {
    panel.classList.remove("show");
    overlay.classList.add("hidden");
});

// Cerrar panel de temas haciendo clic en el overlay
overlay.addEventListener("click", () => {
    panel.classList.remove("show");
    overlay.classList.add("hidden");
});

// Manejar selección de temas
themeOptions.forEach(option => {    
    option.addEventListener("click", () => {
        const selectedTheme = option.getAttribute("data-theme");
        // Aplicar tema al body
        document.body.className = "theme-"+selectedTheme;
        // Guardar tema seleccionado en localStorage
        localStorage.setItem("selectedTheme", selectedTheme);
        // Cerrar panel
        panel.classList.remove("show");
        overlay.classList.add("hidden");
    });
});

// Cargar tema guardado al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
        document.body.className = "theme-"+savedTheme;
    }
});

// ==========================================
// EVENT LISTENER PARA MOSTRAR/OCULTAR FORMULARIO
// ==========================================

// Manejar clic en botón "Add Task" / "Cancel"
addTaskBtn.addEventListener("click", () => {
    taskFormSection.classList.toggle("hidden");
    addTaskBtn.classList.toggle("active");
    
    if (!taskFormSection.classList.contains("hidden")) {
        // Si se muestra el formulario, cambiar texto a "Cancel"
        addTaskBtn.innerHTML = 'Cancel';
    } else {
        // Si se oculta el formulario, resetear todo
        addTaskBtn.innerHTML = '<i class="bi bi-patch-plus"></i> Add New Task';
        taskForm.reset(); // Limpiar campos del formulario
        delete taskForm.dataset.editing; // Eliminar modo edición si existía
    }
});

// ==========================================
// FUNCIONES DE VALIDACIÓN
// ==========================================

/**
 * Valida el texto de una tarea (título o descripción)
 * @param {string} text - Texto a validar
 * @param {boolean} isEditing - Si está en modo edición
 * @param {string|null} editingId - ID de la tarea siendo editada
 * @returns {Array<string>} Array con mensajes de error
 */
const validateTaskText = (text, isEditing = false, editingId = null) => {
    const errors = [];
    
    // Verificar que no sea nulo, vacío o solo espacios
    if (!text || text.trim() === '') {
        errors.push('The text cannot be empty');
        return errors;
    }
    
    const trimmedText = text.trim();
    
    // Verificar que no contenga solo números
    if (/^\d+$/.test(trimmedText)) {
        errors.push('The text cannot contain only numbers');
    }
    
    // Verificar longitud mínima
    if (trimmedText.length < 10) {
        errors.push('The text must be at least 10 characters long');
    }
    
    // Verificar que no sea repetido
    const todos = getToDos();
    const isDuplicate = todos.some(todo => {
        // Si estamos editando, excluir la tarea actual de la verificación
        if (isEditing && todo.id === parseInt(editingId)) {
            return false;
        }
        return todo.title.toLowerCase().trim() === trimmedText.toLowerCase();
    });
    
    if (isDuplicate) {
        errors.push('A task with this text already exists');
    }
    
    return errors;
};

// ==========================================
// FUNCIONES PARA MANEJO DE TAREAS
// ==========================================

/**
 * Crea un objeto de nueva tarea con los datos del formulario
 * @returns {Object} Objeto con la estructura de una tarea
 */
const newTask = () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const createdAt = new Date().getTime();
    const id = createdAt; // Usar timestamp como ID único
    return { id, title, description, done: false, createdAt, updatedAt: null };
}

/**
 * Maneja el cambio de estado del checkbox de una tarea
 * @param {Event} event - Evento del checkbox
 */
const handleTaskCheck = (event) => {
    const id = parseInt(event.target.getAttribute("data-id"));
    const todos = getToDos();
    const todo = todos.find(t => t.id === id);
    
    if (todo) {
        // Actualizar estado de la tarea
        todo.done = event.target.checked;
        todo.updatedAt = new Date().getTime();
        
        // Actualizar el estilo visual (tachado)
        const taskText = event.target.closest('.task-item').querySelector('.task-text');
        if (todo.done) {
            taskText.classList.add('done');
        } else {
            taskText.classList.remove('done');
        }
        
        // Guardar cambios en localStorage
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

/**
 * Elimina una tarea del localStorage y actualiza la vista
 * @param {number} id - ID de la tarea a eliminar
 */
const deleteTask = (id) => {
    let todos = getToDos();
    // Filtrar todas las tareas excepto la que se va a eliminar
    todos = todos.filter(t => t.id !== id);
    localStorage.setItem("todos", JSON.stringify(todos));
    drawTasks(); // Actualizar la vista
}

/**
 * Prepara el formulario para editar una tarea existente
 * @param {number} id - ID de la tarea a editar
 */
const handleEdit = (id) => {
    const todos = getToDos();
    const todo = todos.find(t => t.id === parseInt(id));
    
    if (todo) {
        // Rellenar el formulario con los datos existentes
        document.getElementById("title").value = todo.title;
        document.getElementById("description").value = todo.description;
        
        // Mostrar el formulario en modo edición
        taskFormSection.classList.remove("hidden");
        addTaskBtn.classList.add("active");
        addTaskBtn.innerHTML = 'Cancel';
        
        // Marcar el formulario como en modo edición
        taskForm.dataset.editing = id;
    }
}

// ==========================================
// FUNCIÓN PARA RENDERIZAR TAREAS
// ==========================================

/**
 * Renderiza todas las tareas en el DOM
 * Muestra un mensaje vacío si no hay tareas, o la lista completa si las hay
 */
const drawTasks = () => {
    const todos = getToDos();
    
    // Si no hay tareas, mostrar mensaje de lista vacía
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
        // Limpiar lista existente
        taskList.innerHTML = "";
        
        // Crear elemento HTML para cada tarea
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

        // Agregar event listeners a los elementos creados dinámicamente
        
        // Event listeners para checkboxes
        document.querySelectorAll(".task-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", handleTaskCheck);
        });
        
        // Event listeners para botones de eliminar
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const button = event.target.closest('.delete-btn');
                const id = parseInt(button.getAttribute("data-id"));
                deleteTask(id);
            });
        });
        
        // Event listeners para botones de editar
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const button = event.target.closest('.edit-btn');
                const id = button.getAttribute("data-id");
                handleEdit(id);
            });
        });
    }
}

// ==========================================
// EVENT LISTENER PARA EL FORMULARIO
// ==========================================

/**
 * Maneja el envío del formulario de tareas
 * Valida los datos y los guarda en localStorage
 */
taskForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevenir envío por defecto del formulario
    
    // Obtener valores del formulario
    const titleValue = document.getElementById("title").value;
    const descriptionValue = document.getElementById("description").value;
    const editingId = taskForm.dataset.editing;
    
    // Validar solo el título
    // La descripción no tiene validaciones
    const titleErrors = validateTaskText(titleValue, !!editingId, editingId);
    
    // Mostrar errores si existen
    if (titleErrors.length > 0) {
        let errorMessage = "Validation errors:\n";
        errorMessage += "\nTask Title:\n" + titleErrors.map(error => "• " + error).join("\n");
        
        alert(errorMessage);
        return; // No continuar con el guardado
    }
    
    // Guardar o actualizar la tarea
    if (editingId) {
        // MODO EDICIÓN: Actualizar tarea existente
        const todos = getToDos();
        const todo = todos.find(t => t.id === parseInt(editingId));
        if (todo) {
            todo.title = titleValue.trim();
            todo.description = descriptionValue.trim(); // Puede estar vacío
            todo.updatedAt = new Date().getTime();
            localStorage.setItem("todos", JSON.stringify(todos));
        }
        delete taskForm.dataset.editing; // Salir del modo edición
    } else {
        // MODO CREACIÓN: Crear nueva tarea
        const task = newTask();
        task.title = titleValue.trim(); // Aplicar trim al título
        task.description = descriptionValue.trim(); // Aplicar trim a la descripción (puede estar vacío)
        const currentTodos = getToDos();
        currentTodos.push(task);
        localStorage.setItem("todos", JSON.stringify(currentTodos));
    }
    
    // Limpiar y ocultar formulario
    taskForm.reset();
    taskFormSection.classList.add("hidden");
    addTaskBtn.classList.remove("active");
    addTaskBtn.innerHTML = '<i class="bi bi-patch-plus"></i> Add New Task';
    
    // Actualizar la vista
    drawTasks();
});

// ==========================================
// INICIALIZACIÓN
// ==========================================

/**
 * Inicializar la aplicación cuando el DOM esté completamente cargado
 */
window.addEventListener("DOMContentLoaded", () => {
    drawTasks(); // Cargar y mostrar las tareas existentes
});
