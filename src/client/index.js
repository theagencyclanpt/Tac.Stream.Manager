const Path = require("path");
const HomeController = require("./controllers/HomeController");

class Client {
  constructor(provider) {
    if (!provider)
      throw new Error("Argument provider is missing on Client constructor.");

    this.Provider = provider();
    this.PublicDir = provider.static(Path.join(__dirname, "public"));
    this.ViewPath = Path.join(__dirname, "views");
    this.HomeController = new HomeController(this.Provider);
    this.Mount();
  }

  Mount() {
    this.Configuration();

    this.Provider.get("/_health", (req, res) => {
      res.json({ online: true, time: new Date() });
    });

    this.Provider.use("/public", this.PublicDir);

    this.HomeController.Mount();

    this.Provider.on("mount", function (parent) {
      console.log("Client Mounted");
    });

    return this;
  }

  Configuration() {
    this.Provider.set("view engine", "ejs");
    this.Provider.set("views", this.ViewPath);
  }
}

module.exports = (Express) => new Client(Express);
