# Tac Stream Manager

> :warning: **This version just work on windows**

## Requirements

- [OBS +27.0.0](https://obsproject.com/pt-br)
- [OBS Websocket 4.9.1](https://github.com/Palakis/obs-websocket/releases/tag/4.9.1)
- [Node v12.17.0](https://nodejs.org/en/download/)

## Get Started

After you start you need copy the cs go config (change the cs go path if necesseray).

> :warning: **If you change GSI_PORT on .env file you need change inside da config/gamestate_integration_tac_stream.cfg on uri**

```bash
cp ".\config\gamestate_integration_tac_stream.cfg"  "G:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\cfg"
```

```bash
git clone https://github.com/The-Agency-Clan-Dev/Tac.Stream.Manager.git

cd Tac.Stream.Manager

npm i

mv .env.dev .env

npm run dev
```

## Environment Settings

```
WEB_PORT=3001 -> Web host port
OBS_PATH=G:\Program Files\obs-studio\bin\64bit -> Obs directory
OBS_WEBSOCKET_HOST=localhost -> Obs websocket plugin host
OBS_WEBSOCKET_PORT=4444 -> Obs websocket plugin port
OBS_WEBSOCKET_PASSWORD=1234 -> Obs websocket plugin password
```

## Obs Documentation `/api/obs`

### API Resources

- [GET /startProcess](#get-startProcess)
- [GET /stopProcess](#get-stopProcess)
- [GET /changeScene/:sceneName](#get-changeScenesceneName)
- [GET /startStream](#get-startStream)
- [GET /stopStream](#get-/stopStream)

### GET /startProcess

Example: http://localhost:3000/api/obs/startProcess

- Obs need to be disconnected

Response body 200 OK:

    {
        "CurrentScene": "STREAM_MONITOR2",
        "Connected": true,
        "Streaming": false,
        "Scenes": [
            "STREAM_MONITOR1",
            "STREAM_MONITOR2"
        ]
    }

### GET /stopProcess

Example: http://localhost:3000/api/obs/stopProcess

- Obs need to be connected

Response body 200 OK:

    {
        "CurrentScene": "STREAM_MONITOR2",
        "Connected": false,
        "Streaming": false,
        "Scenes": [
            "STREAM_MONITOR1",
            "STREAM_MONITOR2"
        ]
    }

### GET /changeScene/:sceneName

Example: http://localhost:3000/api/obs/changeScene/STREAM_MONITOR1

- Obs need to be connected

Response body 200 OK:

    {
        "CurrentScene": "STREAM_MONITOR1",
        "Connected": true,
        "Streaming": false,
        "Scenes": [
            "STREAM_MONITOR1",
            "STREAM_MONITOR2"
        ]
    }

### GET /startStream

Example: http://localhost:3000/api/obs/startStream

- Obs need to be connected
- Obs need to be not streaming

Response body 200 OK:

    {
        "CurrentScene": "STREAM_MONITOR1",
        "Connected": true,
        "Streaming": false,
        "Scenes": [
            "STREAM_MONITOR1",
            "STREAM_MONITOR2"
        ]
    }

### GET /stopStream

Example: http://localhost:3000/api/obs/startStream

- Obs need to be connected
- Obs need to be streaming

Response body 200 OK:

    {
        "CurrentScene": "STREAM_MONITOR1",
        "Connected": true,
        "Streaming": false,
        "Scenes": [
            "STREAM_MONITOR1",
            "STREAM_MONITOR2"
        ]
    }

## Cs Go Documentation `/api/csgo`

### API Resources

- [GET /startProcess/:ip](#get-startProcessip)
- [GET /stopProcess](#get-stopProcess)

### GET /startProcess/:ip

Example: http://localhost:3000/api/csgo/startProcess/185.113.141.11:27029

- The ip needs to be valid.

Response body 200 OK:

    {
        "Type": "CSGO_STATE",
        "Ip": "185.113.141.11:27029",
        "Connected": true
    }

### GET /stopProcess

Example: http://localhost:3000/api/csgo/stopProcess

Response body 200 OK:

    {
        "Type": "CSGO_STATE",
        "Ip": null,
        "Connected": false
    }
