const startObsElement = document.getElementById("startObs");
const stopObsElement = document.getElementById("stopObs");
const startTransmissionElement = document.getElementById("startTransmission");
const stopTransmissionElement = document.getElementById("stopTransmission");
const transactionSceneElement = window.OnMobileMode
  ? document.getElementById("transactionSceneMobile")
  : document.getElementById("transactionScene");
const scenesElement = window.OnMobileMode
  ? document.getElementById("scenesMobile")
  : document.getElementById("scenes");
const currentSceneImgElement = document.getElementById("currentScene");
const previewSceneImgElement = window.OnMobileMode
  ? document.getElementById("previewSceneMobile")
  : document.getElementById("previewScene");

const startAndConnectCsGoElement = document.getElementById(
  "startAndConnectCsGo"
);
const stopCsGoElement = document.getElementById("stopCsGo");

const startAndConnectToTs3Element = document.getElementById("startAndConnectToTs3");
const closeTs3Element = document.getElementById("closeTs3");

//Create a dynamic url
const WebSocketProvider = new WebSocket(
  `ws://${location.hostname}:${location.port}`
);

WebSocketProvider.onmessage = (event) => {
  let state = JSON.parse(event.data);

  switch (state.Type) {
    case "OBS_STATE":
      OnObs(state);
      break;

    case "CSGO_STATE":
      OnCsGo(state);
      break;

    case "PROCESS_MANAGER":
      OnProcessManager(state);
      break;
    case "TS3_STATE":
      OnTs3(state);
      break;

    default:
      console.log(state.Type, "Not mapped");
  }
};

function DisableButton(element) {
  element.disabled = true;
  element.classList.remove("tac_transation_button");
  element.classList.add("tac_transation_button_disabled");
}

function AllowButton(element) {
  element.disabled = false;
  element.classList.remove("tac_transation_button_disabled");
  element.classList.add("tac_transation_button");
}

function OnObs(state) {
  if (state.Connected) {
    DisableButton(startObsElement);
    AllowButton(stopObsElement);
    AllowButton(transactionSceneElement);
  } else {
    DisableButton(stopObsElement);
    DisableButton(stopTransmissionElement);
    DisableButton(startTransmissionElement);
    DisableButton(transactionSceneElement);
    AllowButton(startObsElement);
  }

  if (state.Connected && state.Streaming) {
    DisableButton(startTransmissionElement);
    AllowButton(stopTransmissionElement);
  } else if (state.Connected && !state.Streaming) {
    DisableButton(stopTransmissionElement);
    AllowButton(startTransmissionElement);
  }

  if (state.Scenes.length > 0 && scenesElement.options.length == 0) {
    state.Scenes.forEach((element) => {
      var opt = document.createElement("option");
      opt.value = element;
      opt.innerHTML = element;
      scenesElement.appendChild(opt);
    });
  }

  if (state.CurrentSceneImage) {
    currentSceneImgElement.src = state.CurrentSceneImage;
  }

  if (state.PreviewSceneImage) {
    previewSceneImgElement.src = state.PreviewSceneImage;
  }
}

function OnCsGo(state) {
  if (state.Connected) {
    console.log(state.Connected);
    AllowButton(stopCsGoElement);
    DisableButton(startAndConnectCsGoElement);
  } else {
    AllowButton(startAndConnectCsGoElement);
    DisableButton(stopCsGoElement);
  }
}

function OnProcessManager(state) {
  if (state.Processing) {
    document.getElementById("overlay").style.display = "flex";
  } else {
    document.getElementById("overlay").style.display = "none";
  }
}

function OnTs3(state) {
  if (state.Connected) {
    DisableButton(startAndConnectToTs3Element);
    AllowButton(closeTs3Element);
  } else {
    DisableButton(closeTs3Element);
    AllowButton(startAndConnectToTs3Element);
  }
}