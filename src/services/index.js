const ObsController = require("./controllers/ObsController");
const CsGoController = require("./controllers/CsGoController");
const Ts3Controller = require("./controllers/Ts3Controller");

class Services {
  constructor(provider, webScoketProvider) {
    if (!provider)
      throw new Error("Argument provider is missing on Service constructor.");

    this.Provider = provider();
    this.ObsController = new ObsController(
      this.Provider,
      "obs",
      webScoketProvider
    );
    this.CsGoController = new CsGoController(
      this.Provider,
      "csgo",
      webScoketProvider
    );

    this.Ts3Controller = new Ts3Controller(
      this.Provider,
      "ts3",
      webScoketProvider
    );

    this.Mount();
  }

  Mount() {
    this.Provider.get("/_health", (req, res) => {
      res.json({ online: true, time: new Date() });
    });

    this.ObsController.Mount();
    this.CsGoController.Mount();
    this.Ts3Controller.Mount();

    this.Provider.on("mount", function (parent) {
      console.log("Api Service Mounted");
    });

    return this;
  }

  OnClientConnected(ws) {
    this.ObsController.OnClientConnected(ws);
    this.CsGoController.OnClientConnected(ws);
    this.Ts3Controller.OnClientConnected(ws);
  }
}

module.exports = (Express, WebScoketProvider) =>
  new Services(Express, WebScoketProvider);
