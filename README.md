# Senda - To Do List App

This project is a simple web application that simulates an authentication system and a To-Do List manager, built only with semantic HTML, basic CSS (Grid/Flexbox), and pure JavaScript (vanilla JS).

## 🚀 Features

### 1. Authentication

Login form with username and password.

Static valid credentials:

```const users = [{ username: "admin", password: "admin" }];```

On successful login:

Authentication state is saved in localStorage.

User is redirected automatically to the To-Do List page.

If the user is already authenticated and refreshes the page, they are redirected directly to the To-Do List.

### 2. To-Do List Page

Accessible only if the user is authenticated.

Includes a Logout button that clears the authentication state from localStorage and redirects back to login.

Implements a CRUD system for tasks with the following structure:

```js
{
  id: number,
  text: string,
  done: boolean,
  createdAt: number,
  updatedAt: number
}
```

Available operations:

- Create new tasks.

- Read all tasks.

Update task text or status (done).

- Delete tasks.

### 3. Task Validations

- Task text cannot be null, empty, or only numbers.

- Must contain at least 10 characters.

- Duplicate texts are not allowed.

### 4. External API Integration

On accessing the To-Do List, a fetch request is made to:

https://dummyjson.com/c/28e8-a101-22-11


Retrieved todos are displayed below the user-created ones, keeping chronological order.

### 5. HTML & CSS

- Semantic HTML for structure.

- CSS Grid for the main layout.

- Flexbox for the task list.

## 📦 Dependencies

This project uses [Bootstrap Icons](https://icons.getbootstrap.com/).

To install, run:

```npm install bootstrap-icons```


## ▶️ How to Run

Clone this repository:

```git clone <repository-url>```

Open index.html in your browser.

Log in with:

Username: admin

Password: admin