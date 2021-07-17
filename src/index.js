const Express = require("express");
const Http = require("http");
const Websocket = require("ws");

const Services = require("./services");
const Client = require("./client");

const Startup = Express();

const ServerProvider = Http.createServer(Startup);
const WebScoketProvider = new Websocket.Server({ server: ServerProvider });

Startup.use("/api", Services(Express, WebScoketProvider).Provider);
Startup.use("/", Client(Express).Provider);

WebScoketProvider.on("connection", (ws) => {
  console.log("Client connected.");
});

ServerProvider.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
