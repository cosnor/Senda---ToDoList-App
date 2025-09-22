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

// Elemento para logout
const logoutBtn = document.getElementById("sign-out");

// Arrays globales para las tareas
const todos = []; // Array para tareas locales (no se usa actualmente)
let apiTodos = []; // Array para almacenar tareas obtenidas de la API externa

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

/**
 * Verifica si el usuario está autenticado consultando localStorage
 * @returns {boolean} true si está autenticado, false si no
 */
const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
};

/**
 * Elimina el estado de autenticación y todos los datos relacionados
 * Redirige automáticamente a la página de login
 */
const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
};

/**
 * Protege la página verificando la autenticación del usuario
 * Si no está autenticado, redirige automáticamente al login
 */
const protectPage = () => {
    if (!isAuthenticated()) {
        window.location.href = "index.html";
    }
};

// ==========================================
// FUNCIONES AUXILIARES PARA DATOS LOCALES
// ==========================================
// PANEL DE ERRORES ESTÉTICO
// ==========================================
function showErrorPanel(message) {
    let panel = document.getElementById('error-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'error-panel';
        panel.style.position = 'fixed';
        panel.style.top = '2rem';
        panel.style.right = '2rem';
        panel.style.zIndex = '1000';
        panel.style.background = 'var(--notebook-pink, #f2d5d0)';
        panel.style.color = 'var(--text, #3d3832)';
        panel.style.border = '2px solid var(--primary, #d4a574)';
        panel.style.borderRadius = '1rem';
        panel.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        panel.style.padding = '1.2rem 2rem';
        panel.style.fontFamily = 'var(--font-primary, sans-serif)';
        panel.style.fontSize = '1.4rem';
        panel.style.display = 'flex';
        panel.style.alignItems = 'center';
        panel.style.gap = '1rem';
        panel.innerHTML = `<i class=\"bi bi-exclamation-triangle\" style=\"font-size:2rem;color:var(--notebook-pink-strong,#d07f79);\"></i><span id=\"error-panel-message\"></span><button id=\"error-panel-close\" style=\"margin-left:1rem;background:none;border:none;font-size:1.5rem;cursor:pointer;\">&times;</button>`;
        document.body.appendChild(panel);
        panel.querySelector('#error-panel-close').onclick = () => panel.remove();
    }
    panel.querySelector('#error-panel-message').textContent = message;
    panel.style.display = 'flex';
    setTimeout(() => {
        if (panel) panel.style.display = 'none';
    }, 4000);
}
// ==========================================

/**
 * Obtiene todas las tareas locales almacenadas en localStorage
 * @returns {Array} Array de tareas locales o array vacío si no hay datos
 */
function getToDos() {
    const todos = localStorage.getItem("todos");
    console.log("Tareas locales obtenidas:", todos);
    return todos ? JSON.parse(todos) : [];
}

// ==========================================
// FUNCIONES PARA API EXTERNA
// ==========================================

/**
 * Realiza una petición fetch a la API externa para obtener tareas predefinidas
 * Maneja errores de red y parsing JSON
 * @returns {Promise<Array>} Promise que resuelve con array de tareas o array vacío en caso de error
 */
/**
 * Datos de prueba simulando la respuesta de la API
 * Puedes usar estos datos para testear la funcionalidad
 */
const mockApiData = [
    {
        "id": 1,
        "text": "Do something nice for someone I care about",
        "done": true,
        "createdAt": 1232131000,
        "updatedAt": 1232131000
    },
    {
        "id": 2,
        "text": "Memorize the fifty states and their capitals",
        "done": false,
        "createdAt": 1232132000,
        "updatedAt": 1232132000
    },
    {
        "id": 3,
        "text": "Watch a classic movie I've never seen before",
        "done": false,
        "createdAt": 1232133000,
        "updatedAt": null
    },
    {
        "id": 4,
        "text": "Contribute code or a monetary donation to an open-source software project",
        "done": true,
        "createdAt": 1232134000,
        "updatedAt": 1232135000
    },
    {
        "id": 5,
        "text": "Learn a new programming language or framework",
        "done": false,
        "createdAt": 1232136000,
        "updatedAt": null
    }
];

// ==========================================
// fetchApiTodos PARA TESTING
// ==========================================

/**
 * Versión de prueba que usa datos locales en lugar de fetch real
 * Cambiar entre esta versión y la real para testear (Línea 726)
 */

const fetchApiTodos_TEST = async () => {
    try {
        console.log("🧪 MODO TESTING: Usando datos de prueba locales...");
        
        // Simular delay de red para testing realista
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Usar datos de prueba en lugar de fetch real
        const data = mockApiData;
        console.log("📦 Datos de prueba cargados:", data);
        
        // Aplicar la misma transformación que la función real
        const transformedTodos = data.map(todo => ({
            id: todo.id,
            title: todo.text, // Mapear 'text' a 'title'
            description: `Tarea importada desde API (ID: ${todo.id})`,
            done: todo.done,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt,
            isFromApi: true
        }));
        
        console.log("✅ Tareas transformadas exitosamente:", transformedTodos);
        return transformedTodos;
        
    } catch (error) {
        console.error("❌ Error en función de testing:", error);
        return [];
    }
};

const fetchApiTodos = async () => {
    try {
        console.log("Iniciando fetch de tareas desde API externa...");
        
        // Realizar petición HTTP GET a la API de DummyJSON
        const response = await fetch("https://dummyjson.com/c/d816-bf35-4c84-9d60");
        
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parsear respuesta JSON
        const data = await response.json();
        console.log("Datos recibidos de API:", data);
        
        // Validar que la respuesta sea un array
        if (!Array.isArray(data)) {
            console.warn("La respuesta de la API no es un array:", data);
            return [];
        }
        
        // Transformar datos de la API al formato interno de la aplicación
        const transformedTodos = data.map(todo => ({
            id: todo.id,
            title: todo.text, // Mapear 'text' a 'title'
            description: `Tarea importada desde API (ID: ${todo.id})`, // Descripción por defecto
            done: todo.done,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt,
            isFromApi: true // Marca para identificar tareas de la API
        }));
        
        console.log("Tareas transformadas:", transformedTodos);
        return transformedTodos;
        
    } catch (error) {
        // Manejar errores de red, parsing o cualquier otro problema
        console.error("Error al obtener tareas de la API:", error);
        return []; // Retornar array vacío en caso de error
    }
};

/**
 * Combina las tareas locales con las tareas de la API
 * Ordena todas las tareas cronológicamente por fecha de creación
 * @returns {Array} Array combinado y ordenado de todas las tareas
 */
const getCombinedTodos = () => {
    // Obtener tareas locales
    const localTodos = getToDos();
    
    // Combinar tareas locales con tareas de la API
    const allTodos = [...localTodos, ...apiTodos];
    
    // Ordenar cronológicamente por fecha de creación (más recientes primero)
    const sortedTodos = allTodos.sort((a, b) => b.createdAt - a.createdAt);
    
    console.log("Tareas combinadas y ordenadas:", sortedTodos);
    return sortedTodos;
};

// ==========================================
// EVENT LISTENERS PARA EL PANEL DE TEMAS
// ==========================================

// Abrir panel de temas con animación
openBtn.addEventListener("click", () => {
    panel.classList.add("show");
    overlay.classList.remove("hidden");
});

// Cerrar panel de temas con botón close
closeBtn.addEventListener("click", () => {
    panel.classList.remove("show");
    overlay.classList.add("hidden");
});

// Cerrar panel de temas haciendo clic en el overlay (área sombreada)
overlay.addEventListener("click", () => {
    panel.classList.remove("show");
    overlay.classList.add("hidden");
});

// Manejar selección de temas y persistencia en localStorage
themeOptions.forEach(option => {    
    option.addEventListener("click", () => {
        const selectedTheme = option.getAttribute("data-theme");
        
        // Aplicar tema seleccionado al body del documento
        document.body.className = "theme-" + selectedTheme;
        
        // Persistir tema seleccionado en localStorage para futuras visitas
        localStorage.setItem("selectedTheme", selectedTheme);
        
        // Cerrar panel automáticamente después de selección
        panel.classList.remove("show");
        overlay.classList.add("hidden");
    });
});

// ==========================================
// EVENT LISTENER PARA MOSTRAR/OCULTAR FORMULARIO
// ==========================================

// Manejar clic en botón "Add Task" / "Cancel" con toggle de estados
addTaskBtn.addEventListener("click", () => {
    // Alternar visibilidad del formulario
    taskFormSection.classList.toggle("hidden");
    addTaskBtn.classList.toggle("active");
    
    if (!taskFormSection.classList.contains("hidden")) {
        // Estado: Formulario visible - cambiar botón a modo "Cancel"
        addTaskBtn.innerHTML = 'Cancel';
    } else {
        // Estado: Formulario oculto - resetear todo al estado inicial
        addTaskBtn.innerHTML = '<i class="bi bi-patch-plus"></i> Add New Task';
        taskForm.reset(); // Limpiar todos los campos del formulario
        delete taskForm.dataset.editing; // Eliminar modo edición si existía
    }
});

// ==========================================
// FUNCIONES DE VALIDACIÓN AVANZADAS
// ==========================================

/**
 * Valida el texto de una tarea (título o descripción) con múltiples reglas
 * @param {string} text - Texto a validar
 * @param {boolean} isEditing - Si está en modo edición (afecta validación de duplicados)
 * @param {string|null} editingId - ID de la tarea siendo editada (para excluir de duplicados)
 * @returns {Array<string>} Array con mensajes de error encontrados
 */
const validateTaskText = (text, isEditing = false, editingId = null) => {
    const errors = [];
    
    // Regla 1: Verificar que no sea nulo, vacío o solo espacios en blanco
    if (!text || text.trim() === '') {
        errors.push('The text cannot be empty');
        return errors; // Retornar inmediatamente si está vacío
    }
    
    const trimmedText = text.trim();
    
    // Regla 2: Verificar que no contenga solo números
    if (/^\d+$/.test(trimmedText)) {
        errors.push('The text cannot contain only numbers');
    }
    
    // Regla 3: Verificar longitud mínima (10 caracteres)
    if (trimmedText.length < 10) {
        errors.push('The text must be at least 10 characters long');
    }
    
    // Regla 4: Verificar que no sea repetido (solo en tareas locales)
    const localTodos = getToDos();
    const isDuplicate = localTodos.some(todo => {
        // Si estamos editando, excluir la tarea actual de la verificación
        if (isEditing && todo.id === parseInt(editingId)) {
            return false;
        }
        // Comparación case-insensitive del título
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
 * Incluye timestamp como ID único y metadatos de fechas
 * @returns {Object} Objeto con la estructura completa de una tarea
 */
const newTask = () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const createdAt = new Date().getTime(); // Timestamp actual
    const id = createdAt; // Usar timestamp como ID único
    
    return { 
        id, 
        title, 
        description, 
        done: false, 
        createdAt, 
        updatedAt: null,
        isFromApi: false // Marcar como tarea local
    };
}

/**
 * Maneja el cambio de estado del checkbox de una tarea
 * Actualiza el estado visual y persiste cambios solo para tareas locales
 * @param {Event} event - Evento del checkbox
 */
const handleTaskCheck = (event) => {
    const id = parseInt(event.target.getAttribute("data-id"));
    const isFromApi = event.target.getAttribute("data-from-api") === "true";
    // Solo permitir modificaciones en tareas locales
    if (isFromApi) {
        event.target.checked = !event.target.checked;
        showErrorPanel("You cannot modify tasks imported from the API.");
        return;
    }
    // Procesar cambio en tarea local
    const localTodos = getToDos();
    const todo = localTodos.find(t => t.id === id);
    if (todo) {
        // Actualizar estado de la tarea
        todo.done = event.target.checked;
        todo.updatedAt = new Date().getTime();
        
        // Actualizar el estilo visual (texto tachado)
        const taskText = event.target.closest('.task-item').querySelector('.task-text');
        if (todo.done) {
            taskText.classList.add('done');
        } else {
            taskText.classList.remove('done');
        }
        
        // Persistir cambios en localStorage
        localStorage.setItem("todos", JSON.stringify(localTodos));
        
        // Actualizar estadísticas en tiempo real
        updateStatsDisplay();
    }
}

/**
 * Elimina una tarea del localStorage y actualiza la vista
 * Solo permite eliminar tareas locales (no las de la API)
 * @param {number} id - ID de la tarea a eliminar
 * @param {boolean} isFromApi - Si la tarea proviene de la API
 */
const deleteTask = (id, isFromApi = false) => {
    // Verificar si es una tarea de la API
    if (isFromApi) {
        showErrorPanel("You cannot delete tasks imported from the API.");
        return;
    }
    // Eliminar solo tareas locales
    let localTodos = getToDos();
    localTodos = localTodos.filter(t => t.id !== id);
    localStorage.setItem("todos", JSON.stringify(localTodos));
    
    // Actualizar vista y estadísticas
    drawTasks();
    updateStatsDisplay();
}

/**
 * Prepara el formulario para editar una tarea existente
 * Solo permite editar tareas locales (no las de la API)
 * @param {number} id - ID de la tarea a editar
 * @param {boolean} isFromApi - Si la tarea proviene de la API
 */
const handleEdit = (id, isFromApi = false) => {
    // Verificar si es una tarea de la API
    if (isFromApi) {
        showErrorPanel("You cannot edit tasks imported from the API.");
        return;
    }
    
    // Editar solo tareas locales
    const localTodos = getToDos();
    const todo = localTodos.find(t => t.id === parseInt(id));
    
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
 * Renderiza todas las tareas (locales + API) en el DOM
 * Muestra un mensaje vacío si no hay tareas, o la lista completa si las hay
 * Incluye indicadores visuales para diferenciar tareas locales de las de la API
 */
const drawTasks = () => {
    // Obtener tareas combinadas y ordenadas
    const allTodos = getCombinedTodos();
    
    // Si no hay tareas, mostrar mensaje de lista vacía
    if (allTodos.length === 0) {
        taskList.innerHTML = `
            <article class="empty">
                <p class="icon"><i class="bi bi-book"></i></p>
                <h2>Your notebook is empty</h2>
                <p>Start by adding your first beautiful task above</p>
            </article>
        `;
    } else {
        // Limpiar lista existente
        taskList.innerHTML = "";
        
        // Crear elemento HTML para cada tarea
        allTodos.forEach(todo => {
            const li = document.createElement("li");
            li.className = `task-item ${todo.isFromApi ? 'api-task' : 'local-task'}`;
            
            // Crear HTML con indicadores visuales diferentes
            li.innerHTML = `
                <input type="checkbox" 
                       ${todo.done ? "checked" : ""} 
                       data-id="${todo.id}" 
                       data-from-api="${todo.isFromApi || false}"
                       class="task-checkbox">
                <div class="task-text ${todo.done ? "done" : ""}">
                    <h3>
                        ${todo.title}
                        ${todo.isFromApi ? '<span class="api-badge" title="Tarea importada desde API">📡</span>' : ''}
                    </h3>
                    <p>${todo.description}</p>
                    ${todo.isFromApi ? '<small class="api-info">Importada desde API externa</small>' : ''}
                </div>
                <div class="task-actions-item">
                    <button class="edit-btn" 
                            data-id="${todo.id}" 
                            data-from-api="${todo.isFromApi || false}"
                            ${todo.isFromApi ? 'disabled title="No se pueden editar tareas de la API"' : ''}>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="delete-btn" 
                            data-id="${todo.id}" 
                            data-from-api="${todo.isFromApi || false}"
                            ${todo.isFromApi ? 'disabled title="No se pueden eliminar tareas de la API"' : ''}>
                        <i class="bi bi-trash"></i>
                    </button>
                </div>        
            `;
            taskList.appendChild(li);
        });

        // Agregar event listeners a los elementos creados dinámicamente
        
        // Event listeners para checkboxes (con validación de API)
        document.querySelectorAll(".task-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", handleTaskCheck);
        });
        
        // Event listeners para botones de eliminar (con validación de API)
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const button = event.target.closest('.delete-btn');
                const id = parseInt(button.getAttribute("data-id"));
                const isFromApi = button.getAttribute("data-from-api") === "true";
                deleteTask(id, isFromApi);
            });
        });
        
        // Event listeners para botones de editar (con validación de API)
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const button = event.target.closest('.edit-btn');
                const id = button.getAttribute("data-id");
                const isFromApi = button.getAttribute("data-from-api") === "true";
                handleEdit(id, isFromApi);
            });
        });
    }
    
    // Actualizar estadísticas después de renderizar
    updateStatsDisplay();
}

// ==========================================
// EVENT LISTENER PARA EL FORMULARIO
// ==========================================

/**
 * Maneja el envío del formulario de tareas
 * Incluye validación completa y manejo de errores
 * Soporta tanto creación como edición de tareas
 */
taskForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevenir envío por defecto del formulario
    
    // Obtener valores del formulario
    const titleValue = document.getElementById("title").value;
    const descriptionValue = document.getElementById("description").value;
    const editingId = taskForm.dataset.editing;
    
    // Validar solo el título (la descripción es opcional)
    const titleErrors = validateTaskText(titleValue, !!editingId, editingId);
    // Mostrar errores si existen
    if (titleErrors.length > 0) {
        let errorMessage = titleErrors.map(error => "• " + error).join("<br>");
        showErrorPanel(errorMessage);
        return; // No continuar con el guardado
    }
    
    // Guardar o actualizar la tarea
    if (editingId) {
        // MODO EDICIÓN: Actualizar tarea existente
        const localTodos = getToDos();
        const todo = localTodos.find(t => t.id === parseInt(editingId));
        if (todo) {
            todo.title = titleValue.trim();
            todo.description = descriptionValue.trim();
            todo.updatedAt = new Date().getTime();
            localStorage.setItem("todos", JSON.stringify(localTodos));
        }
        delete taskForm.dataset.editing; // Salir del modo edición
    } else {
        // MODO CREACIÓN: Crear nueva tarea
        const task = newTask();
        task.title = titleValue.trim();
        task.description = descriptionValue.trim();
        
        const currentTodos = getToDos();
        currentTodos.push(task);
        localStorage.setItem("todos", JSON.stringify(currentTodos));
    }
    
    // Limpiar y ocultar formulario
    taskForm.reset();
    taskFormSection.classList.add("hidden");
    addTaskBtn.classList.remove("active");
    addTaskBtn.innerHTML = '<i class="bi bi-patch-plus"></i> Add New Task';
    
    // Actualizar la vista y estadísticas
    drawTasks();
});

// ==========================================
// FUNCIONES PARA ESTADÍSTICAS
// ==========================================

/**
 * Calcula las estadísticas de todas las tareas (locales + API)
 * @returns {Object} Objeto con estadísticas calculadas
 */
const calculateStats = () => {
    const allTodos = getCombinedTodos();
    const totalTasks = allTodos.length;
    const completedTasks = allTodos.filter(todo => todo.done).length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Estadísticas adicionales
    const localTasks = allTodos.filter(todo => !todo.isFromApi).length;
    const apiTasks = allTodos.filter(todo => todo.isFromApi).length;
    
    return {
        total: totalTasks,
        completed: completedTasks,
        pending: totalTasks - completedTasks,
        progress: progressPercentage,
        local: localTasks,
        api: apiTasks
    };
};

/**
 * Actualiza la interfaz con las estadísticas actuales
 * Incluye animaciones visuales para mejorar la experiencia de usuario
 */
const updateStatsDisplay = () => {
    const stats = calculateStats();
    
    // Actualizar elementos del DOM
    const totalCard = document.querySelector('.stat-card.total .value');
    const completedCard = document.querySelector('.stat-card.completed .value');
    const progressCard = document.querySelector('.stat-card.progress .value');
    
    if (totalCard) totalCard.textContent = stats.total;
    if (completedCard) completedCard.textContent = stats.completed;
    if (progressCard) progressCard.textContent = `${stats.progress}%`;
    
    // Agregar animación visual a las tarjetas cuando se actualizan
    [totalCard, completedCard, progressCard].forEach(card => {
        if (card) {
            card.closest('.stat-card').classList.add('updated');
            setTimeout(() => {
                card.closest('.stat-card').classList.remove('updated');
            }, 300);
        }
    });
    
    // Log para debugging
    console.log("Estadísticas actualizadas:", stats);
};

// ==========================================
// EVENT LISTENERS ADICIONALES
// ==========================================

/**
 * Event listener para el botón de logout con confirmación
 */
if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        
        // Confirmar logout antes de proceder
        if (confirm("¿Estás seguro que quieres cerrar sesión?")) {
            logout();
        }
    });
}

// ==========================================
// INICIALIZACIÓN COMPLETA DE LA APLICACIÓN
// ==========================================

/**
 * Inicializar la aplicación cuando el DOM esté completamente cargado
 * Incluye carga de datos de la API y configuración inicial
 */
window.addEventListener("DOMContentLoaded", async () => {
    // Paso 1: Proteger la página verificando autenticación primero
    protectPage();
    
    // Si llegamos aquí, el usuario está autenticado
    console.log("Usuario autenticado, iniciando aplicación...");
    
    // Paso 2: Cargar tema guardado del usuario
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
        document.body.className = "theme-" + savedTheme;
        console.log("Tema cargado:", savedTheme);
    }
    
    // Paso 3: Mostrar nombre del usuario autenticado en la interfaz
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        const usernameSpan = document.getElementById("username");
        const currentUserSpan = document.getElementById("current-user");
        if (usernameSpan) usernameSpan.textContent = currentUser;
        if (currentUserSpan) currentUserSpan.textContent = currentUser;
        console.log("Usuario actual mostrado:", currentUser);
    }
    
    // Paso 4: Cargar tareas desde API externa de forma asíncrona
    try {
        console.log("Cargando tareas desde API externa...");
        apiTodos = await fetchApiTodos(); // o apiTodos = await fetchApiTodos_TEST(); para testing
        console.log(`${apiTodos.length} tareas cargadas desde la API`);
    } catch (error) {
        console.error("Error al cargar tareas de la API:", error);
        // Continuar sin las tareas de la API en caso de error
        apiTodos = [];
    }
    
    // Paso 5: Renderizar todas las tareas (locales + API) y actualizar estadísticas
    drawTasks();
    updateStatsDisplay();
    
    console.log("Inicialización completa de la aplicación terminada");
});