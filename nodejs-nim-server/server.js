const port = process.env.PORT || 8000;
const app = require("express")();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const DEFAULT_GAME_BOARD = [3, 5, 7];

const state = new Map();
// : Map(roomName: string, { messages: { message: string, from: string, date: Date }[], game: number[] })

io.on("connection", (socket) => {
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  console.log(socket.id + " connected");

  socket.on("disconnecting", () => {
    console.log(socket.id + " is disconnecting");

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
        const from =
          message.from === "Server"
            ? "Server"
            : client === message.from
            ? "You"
            : "Foe";

        return {
          from,
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
      messages: state.get(roomName) ? state.get(roomName).messages : [],
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

    addServerMessageToRoom("Player joined the room", roomName);
    socket.join(roomName);
    emitRooms();
    emitMessagesToRoom(roomName);
    emitGameToRoom(roomName);
    emitStatusToRoom(roomName);
  }

  function leaveRoom(roomName) {
    socket.leave(roomName);

    const numberOfClients = getClientsFromRoom(roomName).length;

    if (!numberOfClients) {
      state.delete(roomName);
    } else if (numberOfClients < 2) {
      addServerMessageToRoom("Player left the room", roomName);
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

  function addServerMessageToRoom(message, roomName) {
    const newMessageData = { from: "Server", text: message, date: new Date() };

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

server.listen(port, () => {
  console.log("Listening on port " + port);
});
