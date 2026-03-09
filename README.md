# TaskMaster Pro - Full-Stack Task Manager

A professional-grade personal task management application built with a modern Express backend and a clean, responsive Vanilla JavaScript frontend.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Priority Management**: Color-coded priority levels (Low, Medium, High).
- **Status Persistence**: Mark tasks as complete or pending.
- **Filtering System**: Quickly view all, pending, or completed tasks.
- **Responsive Design**: Mobile-first UI using Tailwind CSS.
- **JSON File Database**: No external database setup required.
- **Real-time UI Updates**: Immediate feedback upon actions.

## 🛠️ Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Usually comes with Node.js

## 📦 Installation

1. **Clone or Extract the project files.**
2. **Navigate to the project directory**:
    - `cd fullstack-task-manager`
3. **Install Dependencies**:
    - `npm install`

## 🚦 How to Run

1. **Start the server**:
    - `npm start`
    - Alternatively, for development (auto-restart): `npm run dev`
2. **Access the application**:
    - Open your browser and go to: `http://localhost:3000`

## 🏗️ Project Structure

- `server.js`: Entry point. Express server logic, API routing, and file-based DB handling.
- `public/`: Assets served statically.
  - `index.html`: Main application skeleton.
  - `js/app.js`: Frontend logic, state management, and Fetch API integration.
- `tasks.json`: Local database file (auto-generated on first run).
- `package.json`: Project metadata and dependencies.

## 🔧 Technical Details

- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla JS (ES6+), HTML5, Tailwind CSS
- **Icons**: Font Awesome 6
- **Storage**: JSON File System (I/O)
- **ID Generation**: UUID v4

## ⚠️ Troubleshooting

- **Server won't start**: Ensure no other application is using port 3000 or change the port in `.env`.
- **Changes not reflecting**: Refresh the browser. If using `npm start`, restart the server.
- **Permissions**: Ensure the application has write permissions to create `tasks.json` in the root folder.
