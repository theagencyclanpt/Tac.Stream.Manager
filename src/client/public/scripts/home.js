function startObs() {
  fetch("/api/obs/startProcess").then((r) => {
    console.log(r);
  });
}

function stopObs() {
  fetch("/api/obs/stopProcess").then((r) => {
    console.log(r);
  });
}

function startTransmission() {
  fetch("/api/obs/startStream").then((r) => {
    console.log(r);
  });
}

function stopTransmission() {
  fetch("/api/obs/stopStream").then((r) => {
    console.log(r);
  });
}
