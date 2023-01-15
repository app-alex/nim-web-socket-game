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
    if (getNumberOfClientsInRoom(roomName) > 1) return;

    socket.join(roomName);
    emitRooms();
    emitMessagesToRoom(roomName);
  });

  socket.on("LEAVE_ROOM", (roomName) => {
    socket.leave(roomName);
    if (!getNumberOfClientsInRoom(roomName)) {
      removeRoom(roomName);
    }
  });

  socket.on("NEW_MESSAGE", (message, roomName) => {
    addMessageToRoom(message, roomName);
    emitMessagesToRoom(roomName);
  });

  function emitRooms() {
    io.emit(
      "ROOMS",
      rooms.filter((room) => getNumberOfClientsInRoom(room) < 2)
    );
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

  function getNumberOfClientsInRoom(roomName) {
    const clients = io.sockets.adapter.rooms.get(roomName);
    return clients ? clients.size : 0;
  }

  function removeRoom(roomName) {
    const index = rooms.indexOf(roomName);
    rooms.splice(index, 1);
    console.log(rooms);
  }
});

http.listen(8000, () => {
  console.log("Listening on port 8000");
});
