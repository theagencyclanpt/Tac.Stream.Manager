const {
    startProcessAsync,
    isRunningAsync,
    stopProcessPowershellAsync
} = require("../helper");


class Ts3Controller {
    constructor(provider, basePath, webScoketProvider) {
        if (!provider)
            throw new Error(
                "Argument provider is missing on CsGoController constructor."
            );

        if (!webScoketProvider)
            throw new Error(
                "Argument webScoketProvider is missing on ObsController constructor."
            );

        this.ProcessName = "ts3client_win64.exe";
        this.ProcessNameWithoutExe = "ts3client_win64";
        this.WebScoketProvider = webScoketProvider;
        this.Provider = provider;
        this.BasePath = "/" + basePath;
        this.State = {
            Type: "TS3_STATE",
            Connected: false
        };
    }

    Mount() {
        this.Provider.get(`${this.BasePath}`, async (request, response) => {
            response.json({
                status: true,
            });
        });

        this.Provider.get(
            `${this.BasePath}/startProcess`,
            async (request, response, next) => {
                var isRunning = await isRunningAsync(this.ProcessName);

                if (!isRunning) {
                    await startProcessAsync({
                        program: `ts3server://agency?channel=AGENCY%20TV%2F%C2%BB%20LIVE%20ON%20NAO%20ENTRAR`,
                    });
                }

                this.State.Connected = true;
                this.HandlerNotificationService();
                response.json(this.State);
            }
        );

        this.Provider.get(
            `${this.BasePath}/stopProcess`,
            async (request, response, next) => {
                var isRunning = await isRunningAsync(this.ProcessName);
                if (isRunning) {
                    await stopProcessPowershellAsync({
                        program: this.ProcessNameWithoutExe,
                    });
                }

                this.State.Connected = false;
                this.HandlerNotificationService();

                response.json(this.State);
            }
        );
    }

    OnClientConnected(ws) {
        ws.send(JSON.stringify({ ...this.State }));
    }

    HandlerNotificationService() {
        let _oldThis = this;
        this.WebScoketProvider.clients.forEach((client) =>
            client.send(JSON.stringify({ ..._oldThis.State }))
        );
    }
}


module.exports = Ts3Controller;