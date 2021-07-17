const ObsController = require("./controllers/ObsController");
const CsGoController = require("./controllers/CsGoController");

class Services {
  constructor(provider, webScoketProvider) {
    if (!provider)
      throw new Error("Argument provider is missing on Service constructor.");

    this.Provider = provider();
    this.WebScoketProvider = webScoketProvider;
    this.ObsController = new ObsController(
      this.Provider,
      "obs",
      this.WebScoketProvider
    );
    this.CsGoController = new CsGoController(this.Provider, "csgo");
    this.Mount();
  }

  Mount() {
    this.Provider.get("/_health", (req, res) => {
      res.json({ online: true, time: new Date() });
    });

    this.ObsController.Mount();
    this.CsGoController.Mount();

    this.Provider.on("mount", function (parent) {
      console.log("Api Service Mounted");
    });

    return this;
  }
}

module.exports = (Express, WebScoketProvider) =>
  new Services(Express, WebScoketProvider);
