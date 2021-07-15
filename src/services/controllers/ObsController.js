const OBSWebSocket = require("obs-websocket-js");
const Helper = require("../helper");

class ObsController {
  constructor(provider, basePath) {
    if (!provider)
      throw new Error(
        "Argument provider is missing on ObsController constructor."
      );

    this.ObsProcessProvider = new OBSWebSocket();
    this.Provider = provider;
    this.BasePath = "/" + basePath;

    this.obsProcessName = "obs64.exe";
    this.State = {
      CurrentScene: null,
      Connected: false,
      Streaming: false,
      Scenes: [],
    };

    this.ProcessReconnect = null;
    this.HandlerProcessEvents();
    this.TryConnect();
  }

  Mount() {
    this.Provider.get(`${this.BasePath}`, async (request, response) => {
      var t = await Helper.isRunningAsync(this.obsProcessName);
      response.json(t);
    });

    this.Provider.get(
      `${this.BasePath}/startProcess`,
      async (request, response) => {
        var isRunning = await Helper.isRunningAsync(this.obsProcessName);

        if (!isRunning) {
          await Helper.startProcessAsync({
            directory: `G:\\Program Files\\obs-studio\\bin\\64bit`,
            program: this.obsProcessName,
          });

          await this.Connect();
        }

        response.json(this.State);
      }
    );

    this.Provider.get(
      `${this.BasePath}/stopProcess`,
      async (request, response) => {
        var isRunning = await Helper.isRunningAsync(this.obsProcessName);

        if (isRunning) {
          await Helper.stopProcessAsync({
            program: this.obsProcessName,
          });
        }

        response.json(this.State);
      }
    );

    this.Provider.get(
      `${this.BasePath}/changeScene/:scene`,
      async (request, response) => {
        let scene = request.params.scene;
        if (this.State.Connected && this.State.CurrentScene !== scene) {
          await this.ObsProcessProvider.send("SetCurrentScene", {
            "scene-name": scene,
          });

          this.State.CurrentScene = scene;
        }

        response.json(this.State);
      }
    );

    this.Provider.get(
      `${this.BasePath}/startStream`,
      async (request, response) => {
        if (this.State.Connected) {
          await this.ObsProcessProvider.send("StartStreaming");
          this.State.Streaming = true;
        }

        response.json(this.State);
      }
    );

    this.Provider.get(
      `${this.BasePath}/stopStream`,
      async (request, response) => {
        if (this.State.Connected) {
          await this.ObsProcessProvider.send("StopStreaming");
          this.State.Streaming = false;
        }

        response.json(this.State);
      }
    );
  }

  async Connect() {
    try {
      await this.ObsProcessProvider.connect({
        address: "localhost:4444",
        password: "1234",
      });
    } catch (error) {
      return;
    }

    if (this.ProcessReconnect) {
      clearInterval(this.ProcessReconnect);
      this.ProcessReconnect = null;
    }

    const result = await this.ObsProcessProvider.send("GetSceneList");

    this.State.Scenes = result.scenes.map((e) => e.name);
    this.State.CurrentScene = result["current-scene"];

    console.log(`${this.State.Scenes.length} Available Scenes!`);
  }

  HandlerProcessEvents() {
    this.ObsProcessProvider.on("error", (err) => {
      console.error("socket error:", err);
    });

    this.ObsProcessProvider.on("AuthenticationSuccess", () => {
      this.State.Connected = true;
      console.log("Authentication Success");
    });

    this.ObsProcessProvider.on("AuthenticationFailure", () => {
      this.State.Connected = false;
      console.log("Authentication Failure");
    });

    this.ObsProcessProvider.on("ConnectionClosed", () => {
      this.State.Connected = false;
      this.State.Streaming = false;
      this.TryConnect();
    });

    this.ObsProcessProvider.on("SwitchScenes", (data) => {
      this.State.CurrentScene = data.sceneName;
      console.log(`New Active Scene: ${data.sceneName}`);
    });

    this.ObsProcessProvider.on("StreamStarted", () => {
      this.State.Streaming = true;
      console.log(`Stream started`);
    });

    this.ObsProcessProvider.on("StreamStopped", () => {
      this.State.Streaming = false;
      console.log(`Stream ended`);
    });
  }

  TryConnect() {
    if (this.ProcessReconnect) {
      return;
    }
    var _oldThis = this;
    this.ProcessReconnect = setInterval(function () {
      _oldThis.Connect();
    }, 1000);
  }
}

module.exports = ObsController;
