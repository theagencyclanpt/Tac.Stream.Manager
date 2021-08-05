const Axios = require("axios");

class HomeController {
  constructor(provider, webScoketProvider, serviceNotifications) {
    if (!provider)
      throw new Error(
        "Argument provider is missing on HomeController constructor."
      );

    if (!webScoketProvider)
      throw new Error(
        "Argument webScoketProvider is missing on HomeController constructor."
      );

    if (!serviceNotifications)
      throw new Error(
        "Argument serviceNotifications is missing on HomeController constructor."
      );

    this.Provider = provider;
    this.WebScoketProvider = webScoketProvider;
    this.ServiceNotifications = serviceNotifications;
    this.Processing = false;
  }

  Mount() {
    this.Provider.get("/", (request, response) => {
      response.render("index", {});
    });

    this.Provider.get("/process/*", (request, response) => {
      let originaRequestUrl = request.originalUrl.replace("/process", "");
      let processId = Date.now();
      this.HandlerNotificationService();
      response.redirect(originaRequestUrl + "?processId=" + processId);
    });

    let _oldThis = this;

    this.ServiceNotifications.on("message", function (event) {
      let state = JSON.parse(event);

      if (state.Type == "OBS_STATE") {
        let processTemp = Object.values(state.ProcessMap);

        _oldThis.Processing =
          processTemp.filter((process) => {
            return process != null;
          }).length > 0;

        _oldThis.HandlerNotificationService();
      }
    });
  }

  HandlerNotificationService() {
    let _oldThis = this;
    this.WebScoketProvider.clients.forEach((client) =>
      client.send(
        JSON.stringify({
          Type: "PROCESS_MANAGER",
          Processing: _oldThis.Processing,
        })
      )
    );
  }

  OnClientConnected(ws) {
    ws.send(JSON.stringify({ Type: "PROCESS_MANAGER", Process: this.Process }));
  }
}

module.exports = HomeController;
