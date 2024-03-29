module.exports = {
  WebPort: process.env.WEB_PORT || 3000,

  ObsPath: process.env.OBS_PATH || "C:\\Program Files\\obs-studio\\bin\\64bit",
  ObsWebSocketHost: process.env.OBS_WEBSOCKET_HOST || "localhost",
  ObsWebSocketPort: process.env.OBS_WEBSOCKET_PORT || "4444",
  ObsWebSocketPassword: process.env.OBS_WEBSOCKET_PASSWORD || "1234",

  GsiAuthToken: process.env.GSI_AUTH_TOKEN || "TAC_STREAM_HASH123",
  GsiPort: process.env.GSI_PORT || 43001,
};
