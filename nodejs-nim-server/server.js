const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

const messages = {};
const rooms = [];

io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  socket.on("REQUEST_ROOMS", () => {
    emitRooms();
  });

  socket.on("CREATE_ROOM", (roomName) => {
    if (!rooms.includes(roomName)) {
      rooms.push(roomName);
    }

    socket.join(roomName);
    emitRooms();
  });

  socket.on("JOIN_ROOM", (roomName) => {
    socket.join(roomName);
    emitRooms();
    emitMessagesToRoom(roomName);
  });

  socket.on("NEW_MESSAGE", (message, roomName) => {
    addMessageToRoom(message, roomName);
    emitMessagesToRoom(roomName);
  });

  function emitRooms() {
    io.emit("ROOMS", rooms);
  }

  function emitMessagesToRoom(roomName) {
    io.to(roomName).emit("MESSAGES", messages[roomName]);
  }

  function addMessageToRoom(message, roomName) {
    if (messages[roomName]) {
      messages[roomName].push(message);
    } else {
      messages[roomName] = [message];
    }
  }
});

http.listen(8000, () => {
  console.log("Listening on port 8000");
});
