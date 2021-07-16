function handlerError() {
  alert("Error on request.");
}

function startObs() {
  fetch("/api/obs/startProcess")
    .then((r) => {
      console.log(r);
    })
    .catch(() => {
      handlerError();
    });
}

function stopObs() {
  fetch("/api/obs/stopProcess")
    .then((r) => {
      console.log(r);
    })
    .catch(() => {
      handlerError();
    });
}

function startTransmission() {
  fetch("/api/obs/startStream")
    .then((r) => {
      console.log(r);
    })
    .catch(() => {
      handlerError();
    });
}

function choiseScene() {
  let selectedScen = document.getElementById("sceneList").value;

  fetch("/api/obs/changeScene/" + selectedScen)
    .then((r) => {
      console.log(r);
    })
    .catch(() => {
      handlerError();
    });
}

function stopTransmission() {
  fetch("/api/obs/stopStream")
    .then((r) => {
      console.log(r);
    })
    .catch(() => {
      handlerError();
    });
}

function startAndConnectCsGo() {
  let serverIp = document.getElementById("serverIp").value;

  fetch("/api/csgo/startProcess/" + serverIp)
    .then((r) => {
      console.log(r);
    })
    .catch(() => {
      handlerError();
    });
}
function stopCsGo() {
  fetch("/api/csgo/stopProcess/")
    .then((r) => {
      console.log(r);
    })
    .catch(() => {
      handlerError();
    });
}
