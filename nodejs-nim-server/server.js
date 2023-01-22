const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

const DEFAULT_GAME_BOARD = [3, 5, 7];

const state = new Map();
// : Map(roomName: string, { messages: { message: string, from: string, date: Date }[], game: number[] })

io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomName) => {
      leaveRoom(roomName);
    });
  });

  emitRooms();

  socket.on("JOIN_ROOM", (roomName) => {
    joinRoom(roomName);
  });

  socket.on("LEAVE_ROOM", (roomName) => {
    leaveRoom(roomName);
  });

  socket.on("NEW_MESSAGE", (message, roomName) => {
    addMessageToRoom(message, roomName);
    emitMessagesToRoom(roomName);
  });

  socket.on("UPDATE_GAME", (gameStateUpdate, roomName) => {
    updateRoomGame(roomName, gameStateUpdate);
  });

  // FUNCTIONS
  function emitRooms() {
    io.emit(
      "ROOMS",
      Array.from(state.keys()).filter(
        (room) => getClientsFromRoom(room).length < 2
      )
    );
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
    const clients = getClientsFromRoom(roomName);
    const game = getGameFromRoom(roomName);

    clients.forEach((client) => {
      io.to(client).emit("GAME", {
        board: game.board,
        isYourTurn: client === clients[game.turn],
      });
    });
  }

  function emitStatusToRoom(roomName) {
    io.to(roomName).emit("STATUS", getRoomStatus(roomName));
  }

  function resetRoom(roomName) {
    state.set(roomName, {
      messages: [],
      game: { board: DEFAULT_GAME_BOARD.slice(), turn: 0 },
    });
  }

  function joinRoom(roomName) {
    if (!state.has(roomName)) {
      resetRoom(roomName);
    }

    if (getClientsFromRoom(roomName).length === 2) {
      emitStatusToRoom(socket.id);
      return;
    }

    socket.join(roomName);
    emitRooms();
    emitMessagesToRoom(roomName);
    emitGameToRoom(roomName);
    emitStatusToRoom(roomName);
  }

  function leaveRoom(roomName) {
    socket.leave(roomName);

    if (!getClientsFromRoom(roomName).length) {
      state.delete(roomName);
    } else {
      resetRoom(roomName);
      emitMessagesToRoom(roomName);
      emitGameToRoom(roomName);
      emitStatusToRoom(roomName);
    }

    emitRooms();
  }

  function getClientsFromRoom(roomName) {
    const clients = io.sockets.adapter.rooms.get(roomName);

    return clients ? [...clients] : [];
  }

  function getMessagesFromRoom(roomName) {
    if (!state.has(roomName)) return [];

    return state.get(roomName).messages;
  }

  function addMessageToRoom(message, roomName) {
    const newMessageData = { from: socket.id, text: message, date: new Date() };

    state.get(roomName).messages.push(newMessageData);
  }

  function getGameFromRoom(roomName) {
    if (!state.has(roomName)) return [];

    return state.get(roomName).game;
  }

  function updateRoomGame(roomName, gameUpdate) {
    const { groupIndex, itemsAmount } = gameUpdate;
    const game = state.get(roomName).game;

    game.board[groupIndex] -= itemsAmount;
    game.turn = 1 - game.turn;

    emitGameToRoom(roomName);
    emitStatusToRoom(roomName);
  }

  function getRoomStatus(roomName) {
    if (!getGameFromRoom(roomName).board) return "ROOM_FULL";

    if (
      !getGameFromRoom(roomName).board.reduce(
        (sum, itemsAmount) => sum + itemsAmount
      )
    )
      return "GAME_OVER";

    return getClientsFromRoom(roomName).length === 2 ? "PLAYING" : "WAITING";
  }
});

http.listen(8000, () => {
  console.log("Listening on port 8000");
});
