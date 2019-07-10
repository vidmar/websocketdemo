const express = require("express");
const app = express();
const http = require("http").createServer(app);
const socketHandler = require("./socketHandler");

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/images", express.static(__dirname + "/public/images"));

let server = http.listen(9000, function() {
  let port = server.address().port;
  console.log("Server started at http://localhost:%s", port);
});

socketHandler.init(http);
