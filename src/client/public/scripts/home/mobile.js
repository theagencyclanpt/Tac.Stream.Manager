window.OnMobileMode = false;

function setMobileMode() {
  let width = document.documentElement.clientWidth;

  if (width <= 411) {
    window.OnMobileMode = true;
  } else {
    window.OnMobileMode = false;
  }
}

setMobileMode();

window.onresize = () => {
  setMobileMode();
};
