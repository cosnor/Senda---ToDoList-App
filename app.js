// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

// Elementos para el panel de temas
const openBtn = document.getElementById("theme-toggle");
const closeBtn = document.getElementById("close-theme");
const panel = document.getElementById("theme-panel");
const overlay = document.getElementById("overlay");
const themeOptions = document.querySelectorAll(".theme-list li");

// Formulario de login
const loginForm = document.getElementById("login-form");

// ==========================================
// CONFIGURACIÓN DE AUTENTICACIÓN
// ==========================================

// Credenciales estáticas válidas
const users = [{ username: "admin", password: "admin" }];

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si está autenticado, false si no
 */
const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
};

/**
 * Guarda el estado de autenticación en localStorage
 * @param {string} username - Nombre de usuario autenticado
 */
const setAuthenticated = (username) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", username);
};

/**
 * Elimina el estado de autenticación del localStorage
 */
const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
};

/**
 * Valida las credenciales del usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {boolean} true si las credenciales son válidas
 */
const validateCredentials = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

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

// ==========================================
// INICIALIZACIÓN Y VERIFICACIÓN DE AUTENTICACIÓN
// ==========================================

/**
 * Inicializar la aplicación cuando el DOM esté completamente cargado
 */
window.addEventListener("DOMContentLoaded", () => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
        document.body.className = "theme-"+savedTheme;
    }
    
    // Verificar si el usuario ya está autenticado
    if (isAuthenticated()) {
        // Si ya está autenticado, redirigir directamente al To-Do List
        window.location.href = "todo.html";
    }
});

// ==========================================
// MANEJO DEL FORMULARIO DE LOGIN
// ==========================================

/**
 * Maneja el envío del formulario de login
 * @param {Event} event - Evento del formulario
 */
const onSubmit = (event) => {
    // Limpiar estados de error previos
    loginForm.classList.remove("invalid");
    event.preventDefault();
    
    // Obtener credenciales del formulario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // Validar credenciales
    if (validateCredentials(username, password)) {
        // Credenciales válidas: guardar estado y redirigir
        setAuthenticated(username);
        window.location.href = "todo.html";
    } else {
        // Credenciales inválidas: mostrar animación de error
        loginForm.classList.add("shake");
        setTimeout(() => {
            loginForm.classList.remove("shake");
            loginForm.classList.add("invalid");
        }, 500);
    }
}

// Agregar event listener al formulario
loginForm.addEventListener("submit", onSubmit);