const API_URL = '/api/tasks';
let allTasks = [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');
const loadingSpinner = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');

// Fetch tasks from server
async function fetchTasks() {
    showLoading(true);
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch');
        allTasks = await response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        renderTasks();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error fetching tasks. Check server status.', 'bg-red-500');
    } finally {
        showLoading(false);
    }
}

// Add New Task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;

    const newTask = { title, description, priority };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            const result = await response.json();
            allTasks.unshift(result);
            taskForm.reset();
            renderTasks();
            showNotification('Task created successfully!', 'bg-green-500');
        }
    } catch (error) {
        showNotification('Failed to save task.', 'bg-red-500');
    }
});

// Delete Task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            allTasks = allTasks.filter(t => t.id !== id);
            renderTasks();
            showNotification('Task removed.', 'bg-gray-700');
        }
    } catch (error) {
        showNotification('Delete failed.', 'bg-red-500');
    }
}

// Toggle Complete
async function toggleTask(id) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !task.completed })
        });

        if (response.ok) {
            const updated = await response.json();
            allTasks = allTasks.map(t => t.id === id ? updated : t);
            renderTasks();
        }
    } catch (error) {
        showNotification('Update failed.', 'bg-red-500');
    }
}

// Render UI Components
function renderTasks() {
    let filtered = allTasks;
    if (currentFilter === 'pending') filtered = allTasks.filter(t => !t.completed);
    if (currentFilter === 'completed') filtered = allTasks.filter(t => t.completed);

    taskList.innerHTML = '';
    
    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filtered.forEach(task => {
            const taskEl = createTaskCard(task);
            taskList.appendChild(taskEl);
        });
    }

    updateCounter();
}

function createTaskCard(task) {
    const priorityColors = {
        low: 'bg-blue-100 text-blue-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800'
    };

    const div = document.createElement('div');
    div.className = `task-card bg-white border border-gray-200 p-4 rounded-xl flex items-start justify-between shadow-sm ${task.completed ? 'opacity-75' : ''}`;
    
    div.innerHTML = `
        <div class="flex items-start space-x-4">
            <button onclick="toggleTask('${task.id}')" class="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'}">
                ${task.completed ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
            </button>
            <div>
                <h3 class="font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}">${escapeHtml(task.title)}</h3>
                <p class="text-sm text-gray-500 mt-1">${escapeHtml(task.description)}</p>
                <div class="flex items-center space-x-3 mt-3">
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${priorityColors[task.priority]}">${task.priority}</span>
                    <span class="text-xs text-gray-400 font-medium"><i class="far fa-clock mr-1"></i>${new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
        <button onclick="deleteTask('${task.id}')" class="text-gray-300 hover:text-red-500 transition-colors p-2">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    return div;
}

// Utility Functions
function filterTasks(type) {
    currentFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-blue-100', 'text-blue-700', 'active');
        btn.classList.add('bg-gray-100', 'text-gray-600');
    });
    
    const activeBtn = event.currentTarget;
    activeBtn.classList.remove('bg-gray-100', 'text-gray-600');
    activeBtn.classList.add('bg-blue-100', 'text-blue-700', 'active');
    
    renderTasks();
}

function updateCounter() {
    const active = allTasks.filter(t => !t.completed).length;
    taskCounter.innerText = `${active} active task${active !== 1 ? 's' : ''} remaining`;
}

function showLoading(show) {
    if (show) loadingSpinner.classList.remove('hidden');
    else loadingSpinner.classList.add('hidden');
}

function showNotification(msg, colorClass) {
    const notify = document.createElement('div');
    notify.className = `fixed bottom-4 right-4 ${colorClass} text-white px-6 py-3 rounded-lg shadow-xl z-50 transform transition-all translate-y-0 opacity-100`;
    notify.innerText = msg;
    document.body.appendChild(notify);
    
    setTimeout(() => {
        notify.style.opacity = '0';
        notify.style.transform = 'translateY(20px)';
        setTimeout(() => notify.remove(), 500);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
fetchTasks();
