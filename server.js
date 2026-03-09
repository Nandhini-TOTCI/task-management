const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read/write JSON database
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ tasks: [] }));
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// API Routes

// GET: Fetch all tasks
app.get('/api/tasks', (req, res) => {
    try {
        const db = readDB();
        res.json(db.tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST: Create a new task
app.post('/api/tasks', (req, res) => {
    try {
        const { title, description, priority } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const db = readDB();
        const newTask = {
            id: uuidv4(),
            title,
            description: description || '',
            priority: priority || 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        };

        db.tasks.push(newTask);
        writeDB(db);

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT: Update task status or details
app.put('/api/tasks/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, completed } = req.body;
        
        const db = readDB();
        const taskIndex = db.tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        db.tasks[taskIndex] = {
            ...db.tasks[taskIndex],
            title: title !== undefined ? title : db.tasks[taskIndex].title,
            description: description !== undefined ? description : db.tasks[taskIndex].description,
            priority: priority !== undefined ? priority : db.tasks[taskIndex].priority,
            completed: completed !== undefined ? completed : db.tasks[taskIndex].completed
        };

        writeDB(db);
        res.json(db.tasks[taskIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE: Remove a task
app.delete('/api/tasks/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = readDB();
        const filteredTasks = db.tasks.filter(t => t.id !== id);
        
        if (filteredTasks.length === db.tasks.length) {
            return res.status(404).json({ error: 'Task not found' });
        }

        writeDB({ tasks: filteredTasks });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Basic Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
