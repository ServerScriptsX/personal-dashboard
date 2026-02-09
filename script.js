document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      themeIcon.setAttribute('name', 'moon');
    } else {
      themeIcon.setAttribute('name', 'sun');
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');

      themeIcon.setAttribute('name', isDark ? 'moon' : 'sun');
      lucide.createIcons({
        attrs: {
          class: 'theme-icon'
        },
        nameAttr: 'name',
      }, [themeIcon]);

      showToast('Theme changed', `Changed to ${isDark ? 'dark' : 'light'} mode`);
    });

    function updateDateTime() {
      const now = new Date();

      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;

      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      const formattedDate = now.toLocaleDateString('en-US', options);

      document.getElementById('current-time').textContent = `${hours}:${minutes} ${ampm}`;
      document.getElementById('current-date').textContent = formattedDate;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    const weatherTypes = [
      { type: 'sunny', icon: 'sun', temp: '22°C', description: 'Sunny' },
      { type: 'cloudy', icon: 'cloud', temp: '18°C', description: 'Partly Cloudy' },
      { type: 'rainy', icon: 'cloud-rain', temp: '14°C', description: 'Light Rain' },
      { type: 'snowy', icon: 'cloud-snow', temp: '1°C', description: 'Light Snow' },
      { type: 'windy', icon: 'wind', temp: '16°C', description: 'Windy' }
    ];

  function updateWeather() {
    const apiKey = '779135c117c86a40265c65f4e35dce57'; 
    const city = 'Nilambur'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        return response.json();
      })
      .then(data => {
        const temp = `${data.main.temp}°C`;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        document.getElementById('weather-temp').textContent = temp;
        document.getElementById('weather-desc').textContent = description;

        const weatherIconContainer = document.getElementById('weather-icon');
        weatherIconContainer.innerHTML = '';
        const imgElement = document.createElement('img');
        imgElement.src = iconUrl;
        imgElement.alt = description;
        weatherIconContainer.appendChild(imgElement);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-temp').textContent = 'N/A';
        document.getElementById('weather-desc').textContent = 'Unable to fetch weather data';
      });
  }

    updateWeather();
    setInterval(updateWeather, 60000);

    const todoForm = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const addTodoButton = document.getElementById('add-todo-button');

    let todos = JSON.parse(localStorage.getItem('todos')) || [
      { id: '1', text: 'Complete dashboard design', completed: false },
      { id: '2', text: 'Schedule team meeting', completed: true },
      { id: '3', text: 'Update project documentation', completed: false }
    ];

    function renderTodos() {
      todoList.innerHTML = '';
      todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
          <div class="todo-checkbox-label">
            <input type="checkbox" class="todo-checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
          </div>
          <button class="todo-delete" data-id="${todo.id}">
            <i data-lucide="trash-2" class="small-icon"></i>
          </button>
        `;

        todoList.appendChild(todoItem);

        const checkbox = todoItem.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const deleteButton = todoItem.querySelector('.todo-delete');
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));
      });

      lucide.createIcons();
    }

    function addTodo() {
      const todoText = todoForm.value.trim();
      if (todoText) {
        const newTodo = {
          id: Date.now().toString(),
          text: todoText,
          completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoForm.value = '';
        showToast('Task added', 'New task added to your list');
      }
    }

    function toggleTodo(id) {
      todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos();
      renderTodos();
    }

    function deleteTodo(id) {
      todos = todos.filter(todo => todo.id !== id);
      saveTodos();
      renderTodos();
      showToast('Task deleted', 'Task has been removed');
    }

    function saveTodos() {
      localStorage.setItem('todos', JSON.stringify(todos));
    }

    addTodoButton.addEventListener('click', addTodo);
    todoForm.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); 
        addTodo();
      }
    });

    renderTodos();

    const bookmarksGrid = document.getElementById('bookmarks-grid');
    const addBookmarkButton = document.getElementById('add-bookmark-button');
    const bookmarkModal = document.getElementById('bookmark-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const saveBookmarkButton = document.getElementById('save-bookmark-button');
    const bookmarkTitleInput = document.getElementById('bookmark-title');
    const bookmarkUrlInput = document.getElementById('bookmark-url');

    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [
      { id: '1', title: 'Google', url: 'https://google.com' },
      { id: '2', title: 'Gmail', url: 'https://mail.google.com' },
      { id: '3', title: 'GitHub', url: 'https://github.com' },
      { id: '4', title: 'YouTube', url: 'https://youtube.com' }
    ];

    function renderBookmarks() {
      bookmarksGrid.innerHTML = '';
      bookmarks.forEach(bookmark => {
        const bookmarkItem = document.createElement('div');
        bookmarkItem.className = 'bookmark-item';
        bookmarkItem.innerHTML = `
          <a href="${bookmark.url}" class="bookmark-link" target="_blank" rel="noopener noreferrer">
            <i data-lucide="external-link" class="small-icon"></i>
            <span class="bookmark-title">${bookmark.title}</span>
          </a>
          <button class="bookmark-delete" data-id="${bookmark.id}">
            <i data-lucide="trash-2" class="small-icon"></i>
          </button>
        `;

        bookmarksGrid.appendChild(bookmarkItem);

        const deleteButton = bookmarkItem.querySelector('.bookmark-delete');
        deleteButton.addEventListener('click', (e) => {
          e.preventDefault(); 
          deleteBookmark(bookmark.id);
        });
      });

      lucide.createIcons();
    }

    function addBookmark() {
      const title = bookmarkTitleInput.value.trim();
      let url = bookmarkUrlInput.value.trim();

      if (title && url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        const newBookmark = {
          id: Date.now().toString(),
          title,
          url
        };

        bookmarks.push(newBookmark);
        saveBookmarks();
        renderBookmarks();
        closeModal();
        showToast('Bookmark added', `Added ${title} to your bookmarks`);
      }
    }

    function deleteBookmark(id) {
      const bookmark = bookmarks.find(b => b.id === id);
      bookmarks = bookmarks.filter(b => b.id !== id);
      saveBookmarks();
      renderBookmarks();
      showToast('Bookmark deleted', `Removed ${bookmark.title} from your bookmarks`);
    }

    function saveBookmarks() {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    function openModal() {
      bookmarkModal.classList.add('active');
      bookmarkTitleInput.value = '';
      bookmarkUrlInput.value = '';
      bookmarkTitleInput.focus();
    }

    function closeModal() {
      bookmarkModal.classList.remove('active');
    }

    addBookmarkButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);
    saveBookmarkButton.addEventListener('click', addBookmark);

    bookmarkModal.addEventListener('click', (e) => {
      if (e.target === bookmarkModal) {
        closeModal();
      }
    });

    renderBookmarks();

    const notesTextarea = document.getElementById('notes-textarea');
    const saveNotesButton = document.getElementById('save-notes-button');

    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      notesTextarea.value = savedNotes;
    }

    function saveNotes() {
      localStorage.setItem('notes', notesTextarea.value);
      showToast('Notes saved', 'Your notes have been saved successfully');
    }

    let savedNotesValue = notesTextarea.value;
    notesTextarea.addEventListener('input', () => {
      saveNotesButton.disabled = notesTextarea.value === savedNotesValue;
    });

    saveNotesButton.addEventListener('click', () => {
      saveNotes();
      savedNotesValue = notesTextarea.value;
      saveNotesButton.disabled = true;
    });

    saveNotesButton.disabled = true;

    const notificationButton = document.getElementById('notification-button');
    notificationButton.addEventListener('click', () => {
      showToast('Notifications', 'You have no new notifications');
    });

    function showToast(title, description) {
      const toastContainer = document.getElementById('toast-container');

      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-description">${description}</div>
        </div>
      `;

      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          toastContainer.removeChild(toast);
        }, 300);
      }, 3000);
    }
});
