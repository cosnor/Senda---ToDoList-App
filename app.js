const openBtn = document.getElementById("theme-toggle");
const closeBtn = document.getElementById("close-theme");
const panel = document.getElementById("theme-panel");
const overlay = document.getElementById("overlay");
const themeOptions = document.querySelectorAll(".theme-list li");
const loginForm = document.getElementById("login-form");

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

const onSubmit = (event) => {
    loginForm.classList.remove("invalid");
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "admin") {
        window.location.href = "todo.html";
    } else {
        loginForm.classList.add("shake");
        setTimeout(() => {
            loginForm.classList.remove("shake");
            loginForm.classList.add("invalid");
        }, 500);
    }
}

loginForm.addEventListener("submit", onSubmit);