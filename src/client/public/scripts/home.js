const BANNER_TYPE_REF = document.getElementById("bannerType");
const IMAGE_PREVIEW_REF = document.getElementById("preview_image");
const CANVAS_REF = document.getElementById("preview_canvas");
const FORM_BANNER_REF = document.getElementById("dynamic_form");
const FORM_OPTIONS_REF = document.getElementById("dynamic_form_options");
let bannerMapped = null;

let STATE = {
  HAS_STREAM: false,
  OVERRIDE: {},
};

let drawImageWithTimeoutTime = null;

function drawImageWithTimeout() {
  clearTimeout(drawImageWithTimeoutTime);
  drawImageWithTimeoutTime = setTimeout(function () {
    drawImage();
  }, 100);
}

async function onBannerTypeSelectChange(e) {
  fetch("/map/" + BANNER_TYPE_REF.value.toLowerCase(), {
    method: "GET",
    headers: { "Content-type": "application/json;charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((r) => {
      bannerMapped = r;
      FORM_OPTIONS_REF.textContent = "";
      if (bannerMapped) {
        drawImage(null);
        drawForm();
      }
    });
}

function isValidDependency(input) {
  let isValid = false;
  if (input.dependency) {
    let allPropsFromState = Object.getOwnPropertyNames(STATE).sort();
    allPropsFromState.forEach((propName) => {
      if (input.dependency.hasOwnProperty(propName)) {
        if (input.dependency[propName] === STATE[propName]) {
          isValid = true;
        } else {
          isValid = false;
        }
      }
    });
  } else {
    isValid = true;
  }

  return isValid;
}

function renderDynamicFormInputs() {
  FORM_BANNER_REF.textContent = "";
  bannerMapped.inputs.forEach((input) => {
    if (!isValidDependency(input)) {
      return;
    }
    console.log("RENDERING INPUT FORM -> " + input.label);

    var master = document.createElement("div");
    master.classList.add("form-group");
    master.classList.add("w-100");
    master.classList.add("mb-2");

    var label = document.createElement("label");
    label.textContent = input.label;

    var inputElement = document.createElement("input");
    inputElement.classList.add("w-100");
    inputElement.type = input.type;
    inputElement.id = input.id;

    if (input.type === "text") {
      inputElement.classList.add("form-control");

      if (!STATE[input.id] && input.defaultValue) {
        STATE[input.id] = input.defaultValue;
      }

      inputElement.value = STATE[input.id] ? STATE[input.id] : "";

      inputElement.oninput = function (e) {
        STATE[input.id] = e.target.value;
        drawImageWithTimeout();
      };
    }

    if (input.type === "time") {
      inputElement.classList.add("form-control");

      if (!STATE[input.id] && input.defaultValue) {
        STATE[input.id] = input.defaultValue;
      }

      inputElement.value = STATE[input.id] ? STATE[input.id] : "";

      inputElement.oninput = function (e) {
        let temp = e.target.value;
        temp = temp.replace(":", "H");
        STATE[input.id] = temp;
        drawImageWithTimeout();
      };
    }

    if (input.type === "file") {
      inputElement.classList.add("form-control");
      inputElement.onchange = function (e) {
        let tempImage = new Image();
        tempImage.src = URL.createObjectURL(e.target.files[0]);
        tempImage.onload = function () {
          if (input["max-height"] && tempImage.height > input["max-height"]) {
            alert("A imagem do campeonato só deve ter 100px de altura");
            inputElement.value = "";
            return;
          }

          STATE[input.id] = tempImage;
          drawImageWithTimeout();
        };
      };
    }

    master.appendChild(label);
    master.appendChild(inputElement);

    FORM_BANNER_REF.appendChild(master);
  });
}

function drawForm() {
  if (!bannerMapped || !bannerMapped.inputs) {
    alert("Invalid bannerMapped mapped");
  }

  renderDynamicFormInputs();

  if (bannerMapped.options) {
    bannerMapped.options.forEach((option) => {
      var master = document.createElement("div");
      master.classList.add("form-group");
      master.classList.add("w-100");
      master.classList.add("mt-2");

      var label = document.createElement("label");
      label.textContent = option.label;

      if (option.type === "checkbox") {
        var inputElement = document.createElement("input");
        master.classList.remove("form-group");
        master.classList.add("form-switch");
        master.classList.add("form-check");
        label.classList.add("form-check-label");
        inputElement.type = option.type;
        inputElement.id = option.id;
        inputElement.classList.add("form-check-input");

        inputElement.onchange = function (e) {
          if (inputElement.checked) {
            STATE[option.id] = true;
            if (option.templateOverride) {
              STATE.OVERRIDE["bannerUrl"] = option.templateOverride;
            }
            drawImageWithTimeout();
          } else {
            STATE[option.id] = false;
            STATE.OVERRIDE["bannerUrl"] = null;
            drawImageWithTimeout();
          }

          renderDynamicFormInputs();
        };
      }

      master.appendChild(inputElement);
      master.appendChild(label);

      FORM_OPTIONS_REF.appendChild(master);
    });
  }
}

function previewImg() {
  IMAGE_PREVIEW_REF.src = CANVAS_REF.toDataURL();
  IMAGE_PREVIEW_REF.width = bannerMapped.preview.width;
  IMAGE_PREVIEW_REF.height = bannerMapped.preview.height;
}

function drawImage() {
  CANVAS_REF.width = bannerMapped.width;
  CANVAS_REF.height = bannerMapped.height;

  var context = CANVAS_REF.getContext("2d");
  var imageObj = new Image();

  if (STATE.OVERRIDE["bannerUrl"]) {
    imageObj.src = STATE.OVERRIDE["bannerUrl"];
  } else {
    imageObj.src = bannerMapped.file;
  }

  imageObj.onload = function () {
    context.drawImage(imageObj, 0, 0);
    context.font = bannerMapped.fontBase;

    if (STATE !== null) {
      bannerMapped.inputs.forEach((input) => {
        if (
          (input.type === "text" || input.type === "time") &&
          STATE[input.id]
        ) {
          if (!isValidDependency(input)) {
            return;
          }

          if (input.shape) {
            context.fillStyle = input.shape.color;
            context.fillRect(
              input.shape.x,
              input.shape.y,
              input.shape.width,
              input.shape.height
            );
          }

          context.font = input.font;
          context.fillStyle = input.color;
          context.textAlign = input.textAlign;
          context.fillText(STATE[input.id], input.x, input.y);
        }

        if (input.type === "file" && STATE[input.id]) {
          if (input.width && input.height) {
            context.drawImage(
              STATE[input.id],
              input.x,
              input.y,
              input.width,
              input.height
            );
          } else {
            context.drawImage(STATE[input.id], input.x, input.y);
          }
        }
      });

      if (bannerMapped.statics) {
        bannerMapped.statics.forEach((static) => {
          if (static.type === "text") {
            if (!isValidDependency(static)) {
              return;
            }

            context.font = static.font;
            context.fillStyle = static.color;
            context.textAlign = static.textAlign;
            context.fillText(static.value, static.x, static.y);
          }
        });
      }
    }

    if (bannerMapped.overlay) {
      var imageObjOverlay = new Image();
      imageObjOverlay.src = bannerMapped.overlay;

      imageObjOverlay.onload = function () {
        context.drawImage(imageObjOverlay, 0, 0);
        previewImg();
      };
    } else {
      previewImg();
    }
  };
}

function download_image() {
  let image = CANVAS_REF.toDataURL("image/jpeg", 1);

  var link = document.createElement("a");
  link.download = "BANNER_AGENCY.jpeg";
  link.href = image;

  link.click();
}

function publish_insta() {
  let image64 = CANVAS_REF.toDataURL("image/jpeg", 1);

  fetch("/publish-insta", {
    method: "POST",
    headers: { "Content-type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ image: image64 }),
  }).then((response) => response.json());
}

fetch("/options", {
  method: "GET",
  headers: { "Content-type": "application/json;charset=UTF-8" },
})
  .then((response) => response.json())
  .then((r) => {
    r.forEach((element) => {
      var option = document.createElement("option");
      option.text = element.title;
      option.value = element.value;
      BANNER_TYPE_REF.add(option, BANNER_TYPE_REF[0]);
    });

    onBannerTypeSelectChange();
  });
