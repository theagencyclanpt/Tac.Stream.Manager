const ObsController = require("./controllers/ObsController");
const CsGoController = require("./controllers/CsGoController");

class Services {
  constructor(provider) {
    if (!provider)
      throw new Error("Argument provider is missing on Service constructor.");

    this.Provider = provider();
    this.ObsController = new ObsController(this.Provider, "obs");
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

module.exports = (Express) => new Services(Express);
