class HomeController {
  constructor(provider) {
    if (!provider)
      throw new Error(
        "Argument provider is missing on HomeController constructor."
      );

    this.Provider = provider;
  }

  Mount() {
    this.Provider.get("/", (request, response) => {
      response.render("index", {});
    });
  }
}

module.exports = HomeController;
