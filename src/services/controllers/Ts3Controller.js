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
            Connected: false,
            ProcessMap: {
                StartAndConnect: null,
                Stop: null,
            },
        };
        this.ProcessPending = null;
    }

    CheckStatus() {
        setInterval(async () => {
            const oldSate = this.State;
            const isRunning = await isRunningAsync(this.ProcessName);

            const newState = {
                ...oldSate,
                Connected: isRunning,
            }

            if (oldSate.ProcessMap.StartAndConnect && newState.Connected) {
                newState.ProcessMap.StartAndConnect = null;
            }

            if (oldSate.ProcessMap.Stop && !newState.Connected) {
                newState.ProcessMap.Stop = null;
            }

            if (JSON.stringify(oldSate) === JSON.stringify(newState)) {
                return;
            }

            this.State = newState;
            this.HandlerNotificationService();
        }, 1000);
    }

    Mount() {
        this.CheckStatus();
        this.Provider.get(`${this.BasePath}`, async (request, response) => {
            response.json({
                status: true,
            });
        });

        this.Provider.get(
            `${this.BasePath}/startProcess`,
            async (request, response, next) => {
                if (!this.State.Connected) {
                    this.State.ProcessMap.StartAndConnect = true;
                    this.HandlerNotificationService();

                    await startProcessAsync({
                        program: `ts3server://agency?channel=AGENCY%20TV%2F%C2%BB%20LIVE%20ON%20NAO%20ENTRAR`,
                    });
                }
                response.json(this.State);
            }
        );

        this.Provider.get(
            `${this.BasePath}/stopProcess`,
            async (request, response, next) => {
                if (this.State.Connected) {
                    this.State.ProcessMap.Stop = true;
                    this.HandlerNotificationService();

                    await stopProcessPowershellAsync({
                        program: this.ProcessNameWithoutExe,
                    });
                }
                response.json(this.State);
            }
        );
    }

    OnClientConnected(ws) {
        ws.send(JSON.stringify({ ...this.State }));
    }

    HandlerNotificationService() {
        let _oldThis = this;
        this.WebScoketProvider.clients.forEach((client) => {
            client.send(JSON.stringify({ ..._oldThis.State }));
        });
    }
}


module.exports = Ts3Controller;