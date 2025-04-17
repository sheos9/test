document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

    // Todo List Functionality
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.draggable = true;

        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle material-icons';
        dragHandle.textContent = 'drag_indicator';

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';

        li.appendChild(dragHandle);
        li.appendChild(taskText);
        li.appendChild(deleteBtn);

        return li;
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
    }

    addTaskButton.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text });
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const li = e.target.parentElement;
            const index = Array.from(taskList.children).indexOf(li);
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    });

    // Drag and Drop Functionality
    let draggedItem = null;

    taskList.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('task-item')) {
            draggedItem = e.target;
            e.target.classList.add('dragging');
        }
    });

    taskList.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('task-item')) {
            e.target.classList.remove('dragging');
            draggedItem = null;
            saveTasks();
        }
    });

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!draggedItem) return;

        const targetItem = e.target.closest('.task-item');
        if (!targetItem || targetItem === draggedItem) return;

        const targetRect = targetItem.getBoundingClientRect();
        const targetMiddle = targetRect.top + targetRect.height / 2;

        if (e.clientY < targetMiddle) {
            targetItem.classList.add('drag-above');
            targetItem.classList.remove('drag-below');
        } else {
            targetItem.classList.add('drag-below');
            targetItem.classList.remove('drag-above');
        }
    });

    taskList.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedItem) return;

        const targetItem = e.target.closest('.task-item');
        if (!targetItem || targetItem === draggedItem) return;

        const items = Array.from(taskList.children);
        const draggedIndex = items.indexOf(draggedItem);
        const targetIndex = items.indexOf(targetItem);

        if (draggedIndex < targetIndex) {
            targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling);
        } else {
            targetItem.parentNode.insertBefore(draggedItem, targetItem);
        }

        // Update tasks array
        const task = tasks[draggedIndex];
        tasks.splice(draggedIndex, 1);
        tasks.splice(targetIndex, 0, task);

        // Remove drag indicators
        items.forEach(item => {
            item.classList.remove('drag-above', 'drag-below');
        });
    });

    // Chatbot Functionality
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotBox = document.getElementById('chatbotBox');
    const closeBtn = document.querySelector('.close-btn');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    chatbotToggle.addEventListener('click', () => {
        chatbotBox.classList.toggle('active');
        if (chatbotBox.classList.contains('active') && chatMessages.children.length === 0) {
            addMessage("Hi, my name is Chimbo. How can I help you? 😊");
        }
    });

    closeBtn.addEventListener('click', () => {
        chatbotBox.classList.remove('active');
    });

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage(text) {
        addMessage(text, true);
        
        // Simple responses
        setTimeout(() => {
            let response;
            const lowerText = text.toLowerCase();
            
            if (lowerText.includes('chimfunshi') || lowerText.includes('was macht chimfunsi')) {
                response = "Chimfunshi takes care of rescued chimpanzees and gives them a new home. 😊";
            } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
                response = "Hi, my name is Chimbo. How can I help you? 😊";
            } else if (lowerText.includes('help')) {
                response = "I can help you manage your tasks! You can add, delete, and reorder tasks in your todo list. What would you like to do?";
            } else if (lowerText.includes('thank')) {
                response = "You're welcome! Let me know if you need anything else! 🍌";
            } else {
                response = "I'm here to help with your tasks! Feel free to ask me anything about managing your todo list. 🐒";
            }
            
            addMessage(response);
        }, 1000);
    }

    sendButton.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (text) {
            handleUserMessage(text);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // Initial render
    renderTasks();
}); 