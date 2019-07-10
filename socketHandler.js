const socketIO = require("socket.io");

let state = {
  playing: false,
  currentTime: 0,
  fullscreen: false
};

function init(http) {
  // Instancia o socket.io server na mesma porta do express.
  let socketServer = socketIO(http);

  socketServer.on("connection", function(socket) {
    console.log("User Connected");

    //Conectou envia o status do player para o client
    socket.emit("stateUpdated", state);

    // Altera o state e faz um broadcast para todos os outros sockets
    socket.on("updateState", data => {
      //Atualiza o state.
      state = { ...state, ...data };
      //Emite para todos exceto para o proprio socket.
      socket.broadcast.emit("stateUpdated", state);
    });

    socket.on("disconnect", function() {
      console.log("User disconnected");
    });
  });
}

module.exports = {
  init
};
