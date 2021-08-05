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
  let ip = prompt("Server Ip", "");

  if (ip) {
    connectCsGo(ip);
  }
}

function connectCsGo(ip) {
  PreloadStart();

  fetch("/api/csgo/startProcess/" + ip)
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

function changePreviewScene(element) {
  PreloadStart();
  fetch("/api/obs/changePreviewScene/" + element.value)
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function transationScene() {
  PreloadStart();
  fetch("/api/obs/transationScene/")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function showModal(element_id) {
    //document.getElementById(element_id).style.display = "block";
    //document.getElementById(element_id).style.position = "absolute";
    document.getElementById(element_id).style.zIndex = "100";
}

function hideModal(element_id){
    //document.getElementById(element_id).style.display = "none";
    document.getElementById(element_id).style.zIndex = "-100";
}
