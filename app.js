// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

// Elementos para el panel de temas - Permiten cambiar la apariencia visual
const openBtn = document.getElementById("theme-toggle");
const closeBtn = document.getElementById("close-theme");
const panel = document.getElementById("theme-panel");
const overlay = document.getElementById("overlay");
const themeOptions = document.querySelectorAll(".theme-list li");

// Formulario principal de autenticación
const loginForm = document.getElementById("login-form");

// ==========================================
// CONFIGURACIÓN DE AUTENTICACIÓN
// ==========================================

/**
 * Base de datos estática de usuarios válidos
 * En una aplicación real, esto vendría de una API o base de datos
 * Estructura: { username: string, password: string }
 */
const users = [{ username: "admin", password: "admin" }];

// ==========================================
// FUNCIONES CORE DE AUTENTICACIÓN
// ==========================================

/**
 * Verifica si el usuario tiene una sesión activa válida
 * Consulta localStorage para determinar el estado de autenticación
 * @returns {boolean} true si está autenticado y tiene sesión válida, false en caso contrario
 */
const isAuthenticated = () => {
    const authStatus = localStorage.getItem("isAuthenticated");
    console.log("Verificando estado de autenticación:", authStatus);
    return authStatus === "true";
};

/**
 * Establece el estado de autenticación exitosa
 * Guarda tanto el estado como la información del usuario en localStorage
 * @param {string} username - Nombre de usuario que se autenticó exitosamente
 */
const setAuthenticated = (username) => {
    console.log("Estableciendo autenticación para usuario:", username);
    
    // Guardar estado de autenticación
    localStorage.setItem("isAuthenticated", "true");
    
    // Guardar información del usuario autenticado
    localStorage.setItem("currentUser", username);
    
    console.log("Estado de autenticación guardado exitosamente");
};

/**
 * Cierra la sesión del usuario actual
 * Elimina todos los datos de autenticación del localStorage
 * Redirige automáticamente a la página de login
 */
const logout = () => {
    console.log("Iniciando proceso de logout...");
    
    // Limpiar datos de autenticación
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    
    console.log("Datos de sesión eliminados, redirigiendo al login");
    
    // Redirigir a página de login
    window.location.href = "index.html";
};

/**
 * Valida las credenciales proporcionadas por el usuario
 * Compara contra la base de datos estática de usuarios válidos
 * @param {string} username - Nombre de usuario ingresado
 * @param {string} password - Contraseña ingresada
 * @returns {boolean} true si las credenciales son válidas, false en caso contrario
 */
const validateCredentials = (username, password) => {
    console.log("Validando credenciales para usuario:", username);
    
    // Buscar coincidencia exacta en la base de datos de usuarios
    const isValid = users.some(user => 
        user.username === username && user.password === password
    );
    
    console.log("Resultado de validación:", isValid ? "válido" : "inválido");
    return isValid;
};

// ==========================================
// EVENT LISTENERS PARA EL PANEL DE TEMAS
// ==========================================

/**
 * Maneja la apertura del panel de selección de temas
 * Muestra el panel con animación y activa el overlay de fondo
 */
openBtn.addEventListener("click", () => {
    console.log("Abriendo panel de temas");
    panel.classList.add("show");
    overlay.classList.remove("hidden");
});

/**
 * Maneja el cierre del panel de temas mediante el botón close
 * Oculta el panel y desactiva el overlay
 */
closeBtn.addEventListener("click", () => {
    console.log("Cerrando panel de temas (botón close)");
    panel.classList.remove("show");
    overlay.classList.add("hidden");
});

/**
 * Maneja el cierre del panel de temas mediante clic en el overlay
 * Proporciona una forma intuitiva de cerrar haciendo clic fuera del panel
 */
overlay.addEventListener("click", () => {
    console.log("Cerrando panel de temas (clic en overlay)");
    panel.classList.remove("show");
    overlay.classList.add("hidden");
});

/**
 * Maneja la selección de temas por parte del usuario
 * Aplica el tema seleccionado inmediatamente y lo persiste en localStorage
 */
themeOptions.forEach(option => {    
    option.addEventListener("click", () => {
        // Obtener el tema seleccionado del atributo data-theme
        const selectedTheme = option.getAttribute("data-theme");
        console.log("Tema seleccionado:", selectedTheme);
        
        // Aplicar tema inmediatamente al body del documento
        document.body.className = "theme-" + selectedTheme;
        
        // Persistir tema seleccionado en localStorage para futuras visitas
        localStorage.setItem("selectedTheme", selectedTheme);
        
        // Cerrar panel automáticamente después de la selección
        panel.classList.remove("show");
        overlay.classList.add("hidden");
        
        console.log("Tema aplicado y guardado exitosamente");
    });
});

// ==========================================
// INICIALIZACIÓN Y VERIFICACIÓN DE AUTENTICACIÓN
// ==========================================

/**
 * Inicializar la aplicación cuando el DOM esté completamente cargado
 * Maneja la carga del tema persistido y verificación de autenticación
 */
window.addEventListener("DOMContentLoaded", () => {
    console.log("Inicializando aplicación de login...");
    
    // Paso 1: Cargar y aplicar tema guardado previamente
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
        console.log("Aplicando tema guardado:", savedTheme);
        document.body.className = "theme-" + savedTheme;
    } else {
        console.log("No hay tema guardado, usando tema por defecto");
    }
    
    // Paso 2: Verificar si el usuario ya está autenticado
    if (isAuthenticated()) {
        console.log("Usuario ya autenticado, redirigiendo al dashboard...");
        // Si ya está autenticado, redirigir directamente al To-Do List
        window.location.href = "todo.html";
    } else {
        console.log("Usuario no autenticado, mostrando formulario de login");
    }
});

// ==========================================
// MANEJO DEL FORMULARIO DE LOGIN
// ==========================================

/**
 * Maneja el envío del formulario de login
 * Incluye validación de credenciales, manejo de errores y animaciones de feedback
 * @param {Event} event - Evento del formulario submit
 */
const onSubmit = (event) => {
    // Prevenir el comportamiento por defecto del formulario
    event.preventDefault();
    
    console.log("Procesando intento de login...");
    
    // Limpiar estados de error previos en la interfaz
    loginForm.classList.remove("invalid");
    
    // Extraer credenciales del formulario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    console.log("Intentando autenticar usuario:", username);
    
    // Validar credenciales contra la base de datos
    if (validateCredentials(username, password)) {
        console.log("Credenciales válidas - autenticación exitosa");
        
        // Credenciales válidas: establecer estado de autenticación
        setAuthenticated(username);
        
        // Redirigir al dashboard principal
        console.log("Redirigiendo a dashboard...");
        window.location.href = "todo.html";
        
    } else {
        console.log("Credenciales inválidas - mostrando error");
        
        // Credenciales inválidas: mostrar feedback visual de error
        
        // Agregar animación de "shake" (vibración) para indicar error
        loginForm.classList.add("shake");
        
        // Después de la animación, cambiar a estado visual de error
        setTimeout(() => {
            loginForm.classList.remove("shake");
            loginForm.classList.add("invalid");
        }, 500); // 500ms coincide con la duración de la animación CSS
        
        console.log("Animación de error aplicada");
    }
}

// ==========================================
// REGISTRO DE EVENT LISTENERS
// ==========================================

/**
 * Registrar el event listener principal para el formulario de login
 * Se ejecuta cuando el usuario hace submit del formulario
 */
loginForm.addEventListener("submit", onSubmit);
console.log("Event listener de formulario registrado exitosamente");