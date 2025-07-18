const container = document.querySelector(".container");
const ul = document.createElement("ul");
container.appendChild(ul);

const title = document.querySelector(".title");
title.textContent = "To-Do List";

const form = document.querySelector(".todo-form");
const input = document.querySelector(".todo-input");
const counter = document.getElementById("todo-count");
const searchInput = document.getElementById("search");

//---------------------------------//

// Fetching Mission:
let todos = [];
const savedTodos = localStorage.getItem("todos");
// load todos from local storage if they exist
if (savedTodos && savedTodos !== "[]") {
  todos = JSON.parse(savedTodos);
}
// check if all 5 api todos already exist in local todos
function areApiTodosInLocal(apiTodos, localTodos) {
  return apiTodos.every((apiTodo) =>
    localTodos.some((localTodo) => localTodo.text === apiTodo.title)
  );
}
// promise to fetch 5 todos from the api
const fetchTodosPromise = new Promise((resolve, reject) => {
  fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => reject(error));
});
// the result of the promise
fetchTodosPromise
  .then((apiTodos) => {
    if (savedTodos && savedTodos !== "[]") {
      // print todos from local storage before checking api todos
      console.log("todos from local:", todos);

      // if all 5 api todos already exist in local, it doesn’t add them again
      console.log("todos from api:", apiTodos);
      if (areApiTodosInLocal(apiTodos, todos)) {
        renderTodos();
      } else {
        // if some or all api todos are missing, it adds them to local todos
        const newTodos = apiTodos.map((item) => ({
          text: item.title,
          completed: item.completed,
        }));
        // combine old and new todos
        todos = [...todos, ...newTodos];
        console.log("todos combined from both local and api:", todos);
        saveTodos();
        renderTodos();
      }
    } else {
      // if local storage is empty, use api todos as the first todos
      console.log("todos from local:", todos);
      console.log("todos from api:", apiTodos);
      const newTodos = apiTodos.map((item) => ({
        text: item.title,
        completed: item.completed,
      }));
      todos = newTodos;
      console.log("todos combined from both local and api:", todos);
      saveTodos();
      renderTodos();
    }
  })
  .catch((error) => {
    console.error("Error fetching todos:", error);
    renderTodos();
  });

//---------------------------------//

// Level 3: Persistent Storage
// let todos = JSON.parse(localStorage.getItem("todos")) || []; --->(i made it a comment because i added the code above for the fetching mission)

// Render todos based on current state and optional search filter
function renderTodos(filter = "") {
  ul.innerHTML = "";

  // Level 3: Search Functionality
  todos
    .filter((todo) => todo.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach((todo, index) => {
      const li = document.createElement("li");
      li.classList.add("todo-item");

      // Level 1: Rendering Todo List with checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todos[index].completed = checkbox.checked;
        saveTodos();
      });

      const span = document.createElement("span");
      span.textContent = todo.text;

      // Level 1: Deleting a Todo
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos(searchInput.value);
      });

      // Level 2: Editing a Todo
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-btn");
      editBtn.addEventListener("click", () => {
        const newText = prompt("Edit todo:", todo.text);
        if (newText) {
          todos[index].text = newText;
          saveTodos();
          renderTodos(searchInput.value);
        }
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      ul.appendChild(li);
    });

  // Level 2: Todo Counter
  counter.textContent = todos.length;
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Level 1: Adding a Todo
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTodoText = input.value.trim();
  if (newTodoText) {
    todos.push({ text: newTodoText, completed: false });
    saveTodos();
    renderTodos(searchInput.value);
    input.value = "";
  }
});

// Level 3: Search input handler
searchInput.addEventListener("input", () => {
  renderTodos(searchInput.value);
});

// Initial rendering
// renderTodos(); --->(i made it a comment because renderTodos() is already being called inside the fetch above for the fetching mission)
