import { exec } from "child_process";
import fs from "fs";
import { v4 as uuid } from "uuid";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
app.use(express.json());


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  let currentRoom = null;
  let currentUser = null;

  socket.on("join", ({ roomId, userName }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
    }

    currentRoom = roomId;
    currentUser = userName;

    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    rooms.get(roomId).add(userName);

    io.to(roomId).emit("userJoined", Array.from(rooms.get(currentRoom)));
  });

  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));

      socket.leave(currentRoom);

      currentRoom = null;
      currentUser = null;
    }
  });

  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

  socket.on("disconnect", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
    }
    console.log("user Disconnected");
  });
});



app.post("/execute", (req, res) => {
  const { language, code } = req.body;
//  Block programs waiting for user input
 if (
  code.includes("input(") ||
  code.includes("Scanner") ||
  code.includes("cin") ||
  code.includes("prompt")
  ) {
  return res.json({
    output: " User input is not supported yet. Please remove input statements."
  });
  }

  const jobId = uuid();

  let filePath, command;

  switch (language) {
    case "javascript":
      filePath = `./backend/temp/${jobId}.js`;
      fs.writeFileSync(filePath, code);
      command = `node ${filePath}`;
      break;

    case "python":
      filePath = `./backend/temp/${jobId}.py`;
      fs.writeFileSync(filePath, code);
      command = `python ${filePath}`;
      break;

    case "java":
      filePath = `./backend/temp/Main.java`;
      fs.writeFileSync(filePath, code);
      command = `javac ${filePath} && java -cp ./backend/temp Main`;
      break;

    case "cpp":
      filePath = `./backend/temp/${jobId}.cpp`;
      fs.writeFileSync(filePath, code);
      command = `g++ ${filePath} -o ./backend/temp/${jobId} && ./backend/temp/${jobId}`;
      break;

    default:
      return res.json({ output: "Language not supported" });
  }

  exec(command, { timeout: 3000 }, (err, stdout, stderr) => {
  if (err) {
    if (err.killed) {
      return res.json({
        output: " Program took too long or is waiting for input"
      });
    }
    return res.json({ output: stderr || err.message });
  }

  res.json({
    output: stdout.trim() || " Program ran successfully (no output)"
  });
});

});


const port = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(
  express.static(
    path.join(__dirname, "frontend", "code-editor", "dist")
  )
);

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend", "code-editor", "dist", "index.html")
  );
});

server.listen(port, () => {
  console.log("server is working on port 5000");
});
