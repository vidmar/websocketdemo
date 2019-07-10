let socket;
let player;
let currentState = {};
let delayTimeUpdate = 0;
let delaySeek;

function init() {
  console.log("init");
  playerInit();
}

function socketInit() {
  socket = io();

  socket.on("stateUpdated", state => {
    console.log("stateUpdated:" + JSON.stringify(state));
    updateState(state);
    currentState = state;
  });
}

function playerInit() {
  player = videojs("player");

  player.ready(() => {
    console.log("Player is Ready");
    socketInit();
    player.src({
      src:
        "http://pvbps-sambavideos.akamaized.net/account/1759/1/2019-04-02/video/78c13c9b1edaa240b6430fd8c1639733/78c13c9b1edaa240b6430fd8c1639733_360p.mp4",
      type: "video/mp4"
    });
  });

  player.on("loadedmetadata", function() {
    console.log("loaded");
    currentState.duration = player.duration();
    socket.emit("updateState", currentState);
  });

  player.on("pause", function() {
    console.log("Player paused");
    currentState.playing = false;
    socket.emit("updateState", currentState);
  });

  player.on("play", function() {
    console.log("Player resume");
    currentState.playing = true;
    socket.emit("updateState", currentState);
  });

  player.on("timeupdate", function(evt) {
    if (delayTimeUpdate > 3) {
      currentState.currentTime = player.currentTime();
      socket.emit("updateState", currentState);
      delayTimeUpdate = 0;
    } else {
      delayTimeUpdate += 1;
    }
  });

  player.on("seeked", function(evt) {
    console.log("Player Seeked");
    clearTimeout(delaySeek);
    delaySeek = setTimeout(function() {
      currentState.currentTime = player.currentTime();
      socket.emit("updateState", currentState);
    }, 500);
  });
}

async function updateState(state) {
  try {
    if (state.playing) {
      await player.play();
    } else {
      await player.pause();
    }

    // Veio do controle remoto.
    if (state.seekTo) {
      console.log("test " + state.seekTo);
      player.currentTime(state.seekTo);
      state.seekTo = null;
      socket.emit("updateState", { seekTo: null });
    }
  } catch (error) {
    console.log(error);
  }
}
