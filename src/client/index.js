const Path = require("path");
const HomeController = require("./controllers/HomeController");
const WebScoketProvider = require("ws");

class Client {
  constructor(provider, webScoketProvider) {
    if (!provider)
      throw new Error("Argument provider is missing on Client constructor.");

    if (!webScoketProvider)
      throw new Error(
        "Argument webScoketProvider is missing on Client constructor."
      );

    this.ServiceNotifications = new WebScoketProvider("ws://localhost:3001");
    this.ClientNotifications = webScoketProvider;

    this.Provider = provider();
    this.PublicDir = provider.static(Path.join(__dirname, "public"));
    this.ViewPath = Path.join(__dirname, "views");
    this.HomeController = new HomeController(
      this.Provider,
      this.ClientNotifications,
      this.ServiceNotifications
    );
    this.Mount();
  }

  Mount() {
    this.Configuration();

    this.Provider.get("/_health", (req, res) => {
      res.json({ online: true, time: new Date() });
    });

    this.HomeController.Mount();

    this.Provider.on("mount", function (parent) {
      console.log("Client Mounted");
    });

    return this;
  }

  OnClientConnected(ws) {
    this.HomeController.OnClientConnected(ws);
  }

  Configuration() {
    this.Provider.use("/public", this.PublicDir);
    this.Provider.set("view engine", "ejs");
    this.Provider.set("views", this.ViewPath);
  }
}

module.exports = (Express, WebScoketProvider) =>
  new Client(Express, WebScoketProvider);
