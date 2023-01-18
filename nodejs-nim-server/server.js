const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

const DEFAULT_GAME_STATE = [3, 5, 7];

const state = new Map();
// : { roomName: string, { messages: { message: string, from: string, date: Date }[], game: number[] }}[]

io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomName) => {
      leaveRoom(roomName);
    });
  });

  emitRooms();

  socket.on("JOIN_ROOM", (roomName) => {
    if (!state.has(roomName)) {
      createRoom(roomName);
    }

    if (getClientsFromRoom(roomName).length > 1) return;

    socket.join(roomName);
    emitRooms();
    emitMessagesToRoom(roomName);
    emitGameToRoom(roomName);
  });

  socket.on("LEAVE_ROOM", (roomName) => {
    leaveRoom(roomName);
  });

  socket.on("NEW_MESSAGE", (message, roomName) => {
    addMessageToRoom(message, roomName);
    emitMessagesToRoom(roomName);
  });

  // FUNCTIONS
  function createRoom(roomName) {
    state.set(roomName, { messages: [], game: DEFAULT_GAME_STATE });
  }

  function emitRooms() {
    io.emit(
      "ROOMS",
      Array.from(state.keys()).filter(
        (room) => getClientsFromRoom(room).length < 2
      )
    );
  }

  function leaveRoom(roomName) {
    socket.leave(roomName);

    if (!getClientsFromRoom(roomName).length) {
      state.delete(roomName);
    }

    emitRooms();
  }

  function emitMessagesToRoom(roomName) {
    getClientsFromRoom(roomName).forEach((client) => {
      const messagesData = getMessagesFromRoom(roomName).map((message) => {
        return {
          from: client == message.from ? "You" : "Foe",
          text: message.text,
          date: message.date,
        };
      });

      io.to(client).emit("MESSAGES", messagesData);
    });
  }

  function emitGameToRoom(roomName) {
    io.to(roomName).emit("GAME", getGameFromRoom(roomName));
  }

  function addMessageToRoom(message, roomName) {
    const newMessageData = { from: socket.id, text: message, date: new Date() };

    state.set(roomName, {
      messages: [...getMessagesFromRoom(roomName), newMessageData],
      game: getGameFromRoom(roomName),
    });
  }

  function getClientsFromRoom(roomName) {
    const clients = io.sockets.adapter.rooms.get(roomName);

    return clients ? [...clients] : [];
  }

  function getMessagesFromRoom(roomName) {
    if (!state.has(roomName)) return [];

    return state.get(roomName).messages;
  }

  function getGameFromRoom(roomName) {
    if (!state.has(roomName)) return [];

    return state.get(roomName).game;
  }
});

http.listen(8000, () => {
  console.log("Listening on port 8000");
});
