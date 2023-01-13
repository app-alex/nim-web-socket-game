const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

const messages = [];

io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  socket.on("GET_MESSAGE", (message) => {
    messages.push(message);

    io.emit("MESSAGE", messages);
  });
});

http.listen(8000, () => {
  console.log("Listening on port 4444");
});
