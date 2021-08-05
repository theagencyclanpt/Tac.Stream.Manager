function handlerError() {
  console.log("Error");
}

function startObs() {
  fetch("/process/api/obs/startProcess")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function stopObs() {
  fetch("/process/api/obs/stopProcess")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function startTransmission() {
  fetch("/process/api/obs/startStream")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function choiceScene() {
  let selectedScen = document.getElementById("sceneList").value;

  fetch("/process/api/obs/changeScene/" + selectedScen)
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function stopTransmission() {
  fetch("/process/api/obs/stopStream")
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
  fetch("/process/api/csgo/startProcess/" + ip)
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function stopCsGo() {
  fetch("/process/api/csgo/stopProcess/")
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function changePreviewScene(element) {
  fetch("/process/api/obs/changePreviewScene/" + element.value)
    .then((r) => {})
    .catch(() => {
      handlerError();
    });
}

function transationScene() {
  fetch("/process/api/obs/transationScene/")
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

function hideModal(element_id) {
  //document.getElementById(element_id).style.display = "none";
  document.getElementById(element_id).style.zIndex = "-100";
}
