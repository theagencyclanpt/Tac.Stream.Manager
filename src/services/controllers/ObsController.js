const OBSWebSocket = require("obs-websocket-js");
const Helper = require("../helper");
const {
  ObsPath,
  ObsWebSocketHost,
  ObsWebSocketPort,
  ObsWebSocketPassword,
} = require("../../config");

class ObsController {
  constructor(provider, basePath, webScoketProvider) {
    if (!provider)
      throw new Error(
        "Argument provider is missing on ObsController constructor."
      );

    if (!webScoketProvider)
      throw new Error(
        "Argument webScoketProvider is missing on ObsController constructor."
      );

    this.WebScoketProvider = webScoketProvider;
    this.ObsProcessProvider = new OBSWebSocket();
    this.Provider = provider;
    this.BasePath = "/" + basePath;

    this.CurrentSceneScreenShotAction = null;
    this.obsProcessName = "obs64.exe";
    this.State = {
      Type: "OBS_STATE",
      CurrentScene: null,
      CurrentSceneImage: null,
      PreviewScene: null,
      PreviewSceneImage: null,
      Connected: false,
      Streaming: false,
      Scenes: [],
      ProcessMap: {
        StartAndConnect: null,
        Stop: null,
      },
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
        this.State.ProcessMap.StartAndConnect = true;
        this.HandlerNotificationService();

        var isRunning = await Helper.isRunningAsync(this.obsProcessName);

        if (!isRunning) {
          await Helper.startProcessAsync({
            directory: ObsPath,
            program: this.obsProcessName,
          });

          try {
            await this.Connect();
          } catch (error) {}
        }

        response.json(this.State);
      }
    );

    this.Provider.get(
      `${this.BasePath}/stopProcess`,
      async (request, response) => {
        this.State.ProcessMap.Stop = true;
        this.HandlerNotificationService();
        var isRunning = await Helper.isRunningAsync(this.obsProcessName);

        if (isRunning) {
          await Helper.stopProcessAsync({
            program: this.obsProcessName,
          });
        }
        this.State.ProcessMap.Stop = null;
        this.HandlerNotificationService();

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
      `${this.BasePath}/changePreviewScene/:scene`,
      async (request, response) => {
        let scene = request.params.scene;
        if (this.State.Connected && this.State.PreviewScene !== scene) {
          await this.ObsProcessProvider.send("SetPreviewScene", {
            "scene-name": scene,
          });
          this.State.PreviewScene = scene;
          this.GetScreenshot();
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

    this.Provider.get(
      `${this.BasePath}/transationScene`,
      async (request, response) => {
        if (this.State.Connected) {
          await this.ObsProcessProvider.send("SetCurrentScene", {
            "scene-name": this.State.PreviewScene,
          });

          this.State.CurrentScene = this.State.PreviewScene;
        }

        response.json(this.State);
      }
    );
  }

  async Connect() {
    await this.ObsProcessProvider.connect({
      address: ObsWebSocketHost + ":" + ObsWebSocketPort,
      password: ObsWebSocketPassword,
    });

    if (this.ProcessReconnect) {
      clearInterval(this.ProcessReconnect);
      this.ProcessReconnect = null;
    }

    const result = await this.ObsProcessProvider.send("GetSceneList");

    this.State.Scenes = result.scenes.map((e) => e.name);
    this.State.CurrentScene = result["current-scene"];

    const preview = await this.ObsProcessProvider.send("GetPreviewScene");

    this.State.PreviewScene = preview.name;

    console.log(`${this.State.Scenes.length} Available Scenes!`);
  }

  async GetScreenshot() {
    if (!this.State.Connected) return;
    let data = await this.ObsProcessProvider.send("TakeSourceScreenshot", {
      sourceName: this.State.CurrentScene,
      embedPictureFormat: "png",
      width: 960,
      height: 540,
    });

    if (data && data.img) {
      this.State.CurrentSceneImage = data.img;
    }

    data = await this.ObsProcessProvider.send("TakeSourceScreenshot", {
      sourceName: this.State.PreviewScene,
      embedPictureFormat: "png",
      width: 960,
      height: 540,
    });

    if (data && data.img) {
      this.State.PreviewSceneImage = data.img;
      this.HandlerNotificationService();
    }
  }

  OnClientConnected(ws) {
    ws.send(JSON.stringify({ ...this.State }));
  }

  HandlerProcessEvents() {
    this.ObsProcessProvider.on("error", (err) => {
      console.error("socket error:", err);
    });

    this.ObsProcessProvider.on("AuthenticationSuccess", async () => {
      this.State.Connected = true;
      console.log("Authentication Success");

      this.State.ProcessMap.StartAndConnect = null;

      this.CurrentSceneScreenShotAction = setInterval(
        async () => await this.GetScreenshot(),
        2000
      );

      this.HandlerNotificationService();
    });

    this.ObsProcessProvider.on("AuthenticationFailure", () => {
      this.State.Connected = false;
      console.log("Authentication Failure");
      this.State.ProcessMap.StartAndConnect = null;

      this.HandlerNotificationService();
    });

    this.ObsProcessProvider.on("ConnectionClosed", () => {
      this.State.Connected = false;
      this.State.Streaming = false;
      this.TryConnect();
      clearInterval(this.CurrentSceneScreenShotAction);
    });

    this.ObsProcessProvider.on("SwitchScenes", (data) => {
      this.State.CurrentScene = data.sceneName;
      console.log(`New Active Scene: ${data.sceneName}`);
      this.HandlerNotificationService();
    });

    this.ObsProcessProvider.on("StreamStarted", () => {
      this.State.Streaming = true;
      console.log(`Stream started`);
      this.HandlerNotificationService();
    });

    this.ObsProcessProvider.on("StreamStopped", () => {
      this.State.Streaming = false;
      console.log(`Stream ended`);
      this.HandlerNotificationService();
    });
  }

  HandlerNotificationService() {
    let _oldThis = this;
    this.WebScoketProvider.clients.forEach((client) =>
      client.send(JSON.stringify({ ..._oldThis.State }))
    );
  }

  TryConnect() {
    if (this.ProcessReconnect) {
      return;
    }
    var _oldThis = this;
    this.HandlerNotificationService();
    this.ProcessReconnect = setInterval(async function () {
      try {
        await _oldThis.Connect();
      } catch (error) {}
    }, 1000);
  }
}

module.exports = ObsController;
