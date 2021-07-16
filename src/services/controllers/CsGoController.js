class CsGoController {
  constructor(provider, basePath) {
    if (!provider)
      throw new Error(
        "Argument provider is missing on CsGoController constructor."
      );

    this.Provider = provider;
    this.BasePath = "/" + basePath;

    this.State = {};
  }

  Mount() {
    this.Provider.get(`${this.BasePath}`, async (request, response) => {
      response.json({
        status: true,
      });
    });
  }
}

module.exports = CsGoController;
