let socket;
let currentState;

let app = new Vue({
  el: "#remote",
  data: {
    state: "{}",
    playButtonLabel: "Play",
    duration: 0,
    currentTime: 0
  },
  methods: {
    playPause: function(evt) {
      if (currentState.playing) {
        currentState.playing = false;
        this.playButtonLabel = "Play";
      } else {
        currentState.playing = true;
        this.playButtonLabel = "Pause";
      }
      socket.emit("updateState", currentState);
    },
    sliderChange: function(evt) {      
      currentState.seekTo = event.target.value;
      socket.emit("updateState", currentState);
    }
  },
  created: function() {
    socketInit();
  }
});

function socketInit() {
  socket = io();

  socket.on("stateUpdated", async state => {
    app.state = JSON.stringify(state, null, 2);
    app.duration = state.duration;
    app.currentTime = state.currentTime;
    currentState = state;
  });
}
