//Create a dynamic url
const WebSocketProvider = new WebSocket(`ws://${location.hostname}:3001`);

WebSocketProvider.onmessage = (event) => {
  console.log(JSON.parse(event.data));
};
