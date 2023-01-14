const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

const messages = [];
const rooms = [];

io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  io.emit("ROOMS", rooms);

  socket.on("CREATE_ROOM", (roomName) => {
    socket.join(roomName);
    rooms.push(roomName);

    io.emit("ROOMS", rooms);
  });

  socket.on("NEW_MESSAGE", (message) => {
    messages.push(message);

    io.emit("MESSAGES", messages);
  });
});

http.listen(8000, () => {
  console.log("Listening on port 8000");
});
