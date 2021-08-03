const startObsElement = document.getElementById("startObs");
const stopObsElement = document.getElementById("stopObs");
const startTransmissionElement = document.getElementById("startTransmission");
const stopTransmissionElement = document.getElementById("stopTransmission");
const transactionSceneElement = document.getElementById("transactionScene");
const scenesElement = document.getElementById("scenes");
const currentSceneImgElement = document.getElementById("currentScene");

//Create a dynamic url
const WebSocketProvider = new WebSocket(
  `ws://${location.hostname}:${location.port}`
);

WebSocketProvider.onmessage = (event) => {
  let state = JSON.parse(event.data);
  document.getElementById("overlay").style.display = "none";

  console.log(state);

  switch (state.Type) {
    case "OBS_STATE":
      OnObs(state);
      break;

    default:
      break;
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
}
