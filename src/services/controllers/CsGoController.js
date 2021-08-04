const {
  startProcessAsync,
  stopProcessAsync,
  isRunningAsync,
} = require("../helper");

const { GsiAuthToken, GsiPort } = require("../../config");

const CSGOGSI = require("node-csgo-gsi");

class CsGoController {
  constructor(provider, basePath, webScoketProvider) {
    if (!provider)
      throw new Error(
        "Argument provider is missing on CsGoController constructor."
      );

    if (!webScoketProvider)
      throw new Error(
        "Argument webScoketProvider is missing on ObsController constructor."
      );

    this.GSI = new CSGOGSI({
      port: GsiPort,
      authToken: [GsiAuthToken], // this must match the cfg auth token
    });
    this.WebScoketProvider = webScoketProvider;
    this.Provider = provider;
    this.BasePath = "/" + basePath;
    this.CsGoProcessName = "csgo.exe";
    this.State = {
      Type: "CSGO_STATE",
      Ip: null,
      Connected: false,
    };
  }

  Mount() {
    this.Provider.get(`${this.BasePath}`, async (request, response) => {
      response.json({
        status: true,
      });
    });

    this.Provider.get(
      `${this.BasePath}/startProcess/:ip`,
      async (request, response, next) => {
        var isRunning = await isRunningAsync(this.CsGoProcessName);
        let ip = request.params.ip;

        if (!this.isValidIp(ip)) {
          response.status(500).json({
            message: "Invalid Ip.",
          });
          this.HandlerNotificationService();

          return;
        }

        if (!isRunning) {
          await startProcessAsync({
            program: `steam://connect/${ip}/`,
          });
          this.State.Ip = ip;
        }

        response.json(this.State);
      }
    );

    this.Provider.get(
      `${this.BasePath}/stopProcess`,
      async (request, response, next) => {
        var isRunning = await isRunningAsync(this.CsGoProcessName);

        if (isRunning) {
          await stopProcessAsync({
            program: this.CsGoProcessName,
          });

          this.State.Connected = false;
        }

        this.HandlerNotificationService();

        response.json(this.State);
      }
    );

    let _oldThis = this;
    this.GSI.on("all", (data) => {
      if (data.provider.appid === 730) {
        this.State.Connected = true;
        this.HandlerNotificationService();
      }
    });
  }

  OnClientConnected(ws) {
    ws.send(JSON.stringify({ ...this.State }));
  }

  HandlerNotificationService() {
    let _oldThis = this;
    this.WebScoketProvider.clients.forEach((client) =>
      client.send(JSON.stringify({ ..._oldThis.State }))
    );
  }

  isValidIp(input) {
    function validateNum(input, min, max) {
      var num = +input;
      return num >= min && num <= max && input === num.toString();
    }
    if (!input) return false;
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return (
      validateNum(port, 1, 65535) &&
      ip.length == 4 &&
      ip.every(function (segment) {
        return validateNum(segment, 0, 255);
      })
    );
  }
}

module.exports = CsGoController;
