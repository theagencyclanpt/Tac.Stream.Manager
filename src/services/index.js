// const DatabaseProvider = require("./database");
const ObsController = require("./controllers/ObsController");

class Services {
  constructor(provider) {
    if (!provider)
      throw new Error("Argument provider is missing on Service constructor.");

    this.Provider = provider();
    this.ObsController = new ObsController(this.Provider, "obs");
    this.Mount();
  }

  Mount() {
    this.Provider.get("/_health", (req, res) => {
      res.json({ online: true, time: new Date() });
    });

    this.ObsController.Mount();

    this.Provider.on("mount", function (parent) {
      console.log("Api Service Mounted");
    });

    return this;
  }
}

module.exports = (Express) => new Services(Express);
