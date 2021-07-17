const Express = require("express");
const Http = require("http");
const Websocket = require("ws");

const Startup = Express();

const ServerProvider = Http.createServer(Startup);
const WebScoketProvider = new Websocket.Server({ server: ServerProvider });

const Services = require("./services")(Express, WebScoketProvider);
const Client = require("./client");

Startup.use("/api", Services.Provider);
Startup.use("/", Client(Express).Provider);

WebScoketProvider.on("connection", (ws) => {
  console.log("Client connected.");
  Services.OnClientConnected(ws);
});

ServerProvider.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
