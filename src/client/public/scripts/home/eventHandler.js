function PreloadStart() {
  document.getElementById("overlay").style.display = "flex";
}

function PreloadEnd() {
  document.getElementById("overlay").style.display = "none";
}

function handlerError() {
  PreloadEnd();
}

function startObs() {
  PreloadStart();
  fetch("/api/obs/startProcess")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function stopObs() {
  PreloadStart();
  fetch("/api/obs/stopProcess")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function startTransmission() {
  PreloadStart();
  fetch("/api/obs/startStream")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function choiceScene() {
  PreloadStart();
  let selectedScen = document.getElementById("sceneList").value;

  fetch("/api/obs/changeScene/" + selectedScen)
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function stopTransmission() {
  PreloadStart();
  fetch("/api/obs/stopStream")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function startAndConnectCsGo() {
  PreloadStart();
  let serverIp = document.getElementById("serverIp").value;

  fetch("/api/csgo/startProcess/" + serverIp)
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function stopCsGo() {
  PreloadStart();
  fetch("/api/csgo/stopProcess/")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}
