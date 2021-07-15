const Path = require("path");
const { readFile, readdirSync } = require("fs");
const Util = require("util");
const ReadFileAsycn = Util.promisify(readFile);

class HomeController {
  constructor(provider) {
    if (!provider)
      throw new Error(
        "Argument provider is missing on HomeController constructor."
      );

    this.Provider = provider;
    this.MapMappeds = Path.join(__dirname, "..", "public", "maps");
  }

  Mount() {
    this.Provider.get("/", (request, response) => {
      response.render("index", { user: "12111111111" });
    });

    this.Provider.get("/options", async (req, res) => {
      let directorys = readdirSync(this.MapMappeds, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      let result = [];

      for (var element of directorys) {
        let data = JSON.parse(
          await ReadFileAsycn(Path.join(this.MapMappeds, element, "map.json"))
        );

        result.push({
          value: element,
          title: data["title"],
        });
      }

      res.json(result);
    });

    this.Provider.get("/map/:mapName", async (req, res) => {
      let dir = req.params.mapName;
      let data = JSON.parse(
        await ReadFileAsycn(Path.join(this.MapMappeds, dir, "map.json"))
      );

      data["file"] = "/public/maps/" + dir + "/background.png";
      console.log(data);
      res.json(data);
    });
  }
}

module.exports = HomeController;
