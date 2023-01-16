const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

const DEFAULT_GAME_STATE = [3, 5, 7];

const state = new Map(); //{ room: { messages, game }}

io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  socket.on("REQUEST_ROOMS", () => {
    emitRooms();
  });

  socket.on("REQUEST_GAME", (roomName) => {
    emitGameToRoom(roomName);
  });

  socket.on("CREATE_ROOM", (roomName) => {
    createRoom(roomName);
    socket.join(roomName);
    emitRooms();
    emitGameToRoom(roomName);
  });

  socket.on("JOIN_ROOM", (roomName) => {
    if (getNumberOfClientsInRoom(roomName) > 1) return;

    socket.join(roomName);
    emitRooms();
    emitMessagesToRoom(roomName);
    emitGameToRoom(roomName);
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

  // FUNCTIONS
  function createRoom(roomName) {
    if (!state.has(roomName)) {
      state.set(roomName, { messages: [], game: DEFAULT_GAME_STATE });
    }
  }

  function emitRooms() {
    io.emit(
      "ROOMS",
      Array.from(state.keys()).filter(
        (room) => getNumberOfClientsInRoom(room) < 2
      )
    );
  }

  function emitMessagesToRoom(roomName) {
    io.to(roomName).emit("MESSAGES", getMessagesFromRoom(roomName));
  }

  function emitGameToRoom(roomName) {
    io.to(roomName).emit("GAME", getGameFromRoom(roomName));
  }

  function addMessageToRoom(message, roomName) {
    state.set(roomName, {
      messages: [...getMessagesFromRoom(roomName), message],
      game: getGameFromRoom(roomName),
    });
  }

  function getNumberOfClientsInRoom(roomName) {
    const clients = io.sockets.adapter.rooms.get(roomName);
    return clients ? clients.size : 0;
  }

  function getMessagesFromRoom(roomName) {
    if (!state.has(roomName)) return [];

    return state.get(roomName).messages;
  }

  function getGameFromRoom(roomName) {
    if (!state.has(roomName)) return [];

    return state.get(roomName).game;
  }

  function removeRoom(roomName) {
    state.delete(roomName);
  }
});

http.listen(8000, () => {
  console.log("Listening on port 8000");
});
