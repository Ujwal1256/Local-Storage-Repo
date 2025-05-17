 const firebaseConfig = {
        apiKey: "AIzaSyDeIKYNedmsMI3pkwYXOxipIulhJkSRQnI",
        authDomain: "to-do-list-app-23f56.firebaseapp.com",
        databaseURL: "https://to-do-list-app-23f56-default-rtdb.firebaseio.com",
        projectId: "to-do-list-app-23f56",
        storageBucket: "to-do-list-app-23f56.firebasestorage.app",
        messagingSenderId: "814193884846",
        appId: "1:814193884846:web:5ad75ed3ca81c9c5f6f73f",
        measurementId: "G-32KPY82Z1Y",
      };
      firebase.initializeApp(firebaseConfig);
      const db = firebase.database();
      const todosRef = db.ref("todos");

      // --- UI Elements ---
      const todoForm = document.getElementById("todo-form");
      const todoInput = document.getElementById("todo-input");
      const todoList = document.getElementById("todo-list");
      const statusDiv = document.getElementById("status");
      const filterBtns = document.querySelectorAll(".filters button");

      // --- State ---
      let todos = {};
      let filter = "all";
      let syncing = false;
      let syncedTimeout = null;

      // --- Helpers ---
      function setStatus(text, loading = false) {
        if (loading) {
          statusDiv.innerHTML = `<span class="loader"></span> ${text}`;
        } else {
          statusDiv.textContent = text;
        }
      }
      function showSynced() {
        setStatus("Synced!");
        clearTimeout(syncedTimeout);
        syncedTimeout = setTimeout(() => setStatus(""), 1000);
      }
      function showSaving() {
        setStatus("Saving...", true);
      }
      function renderTodos() {
        todoList.innerHTML = "";
        const filtered = Object.entries(todos).filter(([id, todo]) => {
          if (filter === "all") return true;
          if (filter === "completed") return todo.completed;
          if (filter === "incomplete") return !todo.completed;
        });
        if (filtered.length === 0) {
          todoList.innerHTML =
            '<li style="color:#888;text-align:center;">No todos</li>';
          return;
        }
        filtered.forEach(([id, todo]) => {
          const li = document.createElement("li");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = !!todo.completed;
          checkbox.addEventListener("change", () =>
            toggleTodo(id, checkbox.checked)
          );
          const span = document.createElement("span");
          span.textContent = todo.text;
          span.className = "todo-text" + (todo.completed ? " completed" : "");
          li.appendChild(checkbox);
          li.appendChild(span);
          todoList.appendChild(li);
        });
      }

      // --- Firebase Sync ---
      function fetchTodos() {
        setStatus("Loading todos...", true);
        todosRef.on(
          "value",
          (snapshot) => {
            todos = snapshot.val() || {};
            renderTodos();
            showSynced();
          },
          (err) => {
            setStatus("Failed to load todos", false);
          }
        );
      }
      function addTodo(text) {
        showSaving();
        const newRef = todosRef.push();
        newRef.set({ text, completed: false }, (err) => {
          if (!err) showSynced();
        });
      }
      function toggleTodo(id, completed) {
        showSaving();
        todosRef.child(id).update({ completed }, (err) => {
          if (!err) showSynced();
        });
      }

      // --- Event Listeners ---
      todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
          addTodo(text);
          todoInput.value = "";
        }
      });
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          filter = btn.dataset.filter;
          renderTodos();
        });
      });

      fetchTodos();