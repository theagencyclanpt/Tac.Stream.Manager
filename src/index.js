const Express = require("express");
const Services = require("./services")(Express);
const Client = require("./client")(Express);

const Startup = Express();

Startup.use("/api", Services.Provider);
Startup.use("/", Client.Provider);

Startup.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
