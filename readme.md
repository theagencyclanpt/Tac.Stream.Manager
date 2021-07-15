# Tac Stream Manager
> :warning: **This version just work on windows**

## Requirements

- [OBS +27.0.0](https://obsproject.com/pt-br)
- [OBS Websocket 4.9.1](https://github.com/Palakis/obs-websocket/releases/tag/4.9.1)
- [Node v12.17.0](https://nodejs.org/en/download/)

## Get Started


```bash
git clone https://github.com/The-Agency-Clan-Dev/Tac.Stream.Manager.git

cd Tac.Stream.Manager

npm i

npm run dev
```


## Obs Documentation `/api/obs`

### API Resources

- [GET /startProcess](#get-startProcess)
- [GET /stopProcess](#get-stopProcess)
- [GET /changeScene/:sceneName](#get-changeScenesceneName)
- [GET /startStream](#get-startStream)
- [GET /stopStream](#get-/stopStream)

### GET /startProcess

Example:  http://localhost:3000/api/obs/startProcess

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

Example:  http://localhost:3000/api/obs/stopProcess

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

Example:  http://localhost:3000/api/obs/changeScene/STREAM_MONITOR1

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

Example:  http://localhost:3000/api/obs/startStream

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

Example:  http://localhost:3000/api/obs/startStream

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
