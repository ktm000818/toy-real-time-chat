import express from "express";
import socket from "socket.io";
import http from "http";

import fs from "fs";
import path from "path";

// express 객체 생성
const app = express();

const server = http.createServer(app);

const io = socket(server);

app.use(express.static(path.resolve(__dirname, "..", "chat-ui-react", "dist")));

app.get("/", (req, res) => {
  fs.readFile("../chat-ui-react/dist/index.html", (err, data) => {
    if (err) {
      console.error("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
      console.log("유저가 / 으로 접속했습니다.");
    }
  });
});

io.sockets.on("connection", (socket) => {
  socket.on("newUser", (name) => {
    console.log(name + " is connected.");

    socket.name = name;

    io.sockets.emit("update", {
      type: "connect",
      name: "SERVER",
      message: name + " is connected",
    });
  });

  socket.on("message", (data) => {
    data.name = socket.name;

    console.log(data);

    socket.broadcast.emit("update", data);
  });

  socket.on("disconnect", () => {
    console.log(socket.name + " is disconnected");
    socket.broadcast.emit("update", {
      type: "disconnect",
      name: "SERVER",
      message: socket.name + " is disconnected",
    });
  });
});

server.listen(1234, () => {
  console.log("서버 실행 중");
});
