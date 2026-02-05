# Realtime Collaborative Code Editor

A realtime collaborative code editor where multiple users can join a room, write code together, and execute it instantly. Built using **React, Socket.IO, Node.js, and Express**.

---

##  Features

-  Join rooms using Room ID
-  Realtime multi-user collaboration
-  Live code sync with typing indicators
-  Language synchronization across users
-  Execute code directly from the editor
-  Output displayed instantly
-  Copy room ID to share with others

---

##  Supported Languages

- JavaScript (Node.js)
- Python
- Java
- C++

> ⚠️ User input via `stdin` is **not supported yet** (planned enhancement).

---

##  Tech Stack

### Frontend
- React
- Socket.IO Client
- Monaco Editor
- CSS

### Backend
- Node.js
- Express
- Socket.IO
- child_process (code execution)
- uuid

---

## Project Structure

```
REALTIME CODE/
├── backend/
│   ├── index.mjs
│   ├── temp/            # temporary files (gitignored)
│
├── frontend/
│   └── code-editor/
│       ├── dist/
│       ├── src/
│
├── .gitignore
├── README.md
```


---

##  Setup Instructions

### 1️ Install dependencies

npm install

### 2 Start backend server

npm run dev

### Backend runs on

http://localhost:5000

### Build frontend (if not built)

cd frontend/code-editor
npm install
npm run build

### How to Use

-Open the app in browser

-Enter any Room ID and User Name

-Share Room ID with others

-Start coding together in realtime

-Select a language

-Click Run to execute code

-View output below the editor

### Known Limitations

-No stdin / user input support yet

-Execution is local (not sandboxed)

-Java requires Main class name

