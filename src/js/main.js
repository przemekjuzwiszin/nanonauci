"use strict";

// service worker registration - remove if you're not going to use it

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("serviceworker.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

// place your code below

//CONSTANT
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var NANONAUT_WIDTH = 181;
var NANONAUT_HEIGHT = 229;
var GROUND_Y = 540;
var NANONAUT_Y_ACCELERATION = 1;
var SPACE_KEYCODE = 32;
var NANONAUT_JUMP_SPEED = 20;
var NANONAUT_X_SPEED = 5;
var BACKGROUND_WIDTH = 1000;
var NANONAUT_NR_FRAMES_PER_ROW = 5;
var NANONAUT_NR_ANIMATION_FRAMES = 7;

//PRECONFIGURATION
var canvas = document.createElement("canvas");
var c = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

var nanonautImage = new Image();
nanonautImage.src = "assets/img/animatedNanonaut.png";

var backgroundImage = new Image();
backgroundImage.src = "assets/img/background.png";

var nanonautX = CANVAS_WIDTH / 2;
var nanonautY = GROUND_Y - NANONAUT_HEIGHT;
var nanonautYspeed = 0;
var nanonautIsInTheAir = false;
var spaceKeyIsPressed = false;
var cameraX = 0;
var cameraY = 0;
var nanonautFrameNr = 0;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

window.addEventListener("load", start);

function start() {
  window.requestAnimationFrame(mainLoop);
}

//MAIN LOOP
function mainLoop() {
  update();
  draw();
  window.requestAnimationFrame(mainLoop);
}

//CONTROL
function onKeyDown(event) {
  if (event.keyCode === SPACE_KEYCODE) {
    spaceKeyIsPressed = true;
  }
}

function onKeyUp(event) {
  if (event.keyCode === SPACE_KEYCODE) {
    spaceKeyIsPressed = false;
  }
}

//UPDATE
function update() {
  nanonautX = nanonautX + NANONAUT_X_SPEED;
  if (spaceKeyIsPressed && !nanonautIsInTheAir) {
    nanonautYspeed = -NANONAUT_JUMP_SPEED;
    nanonautIsInTheAir = true;
  }

  //Update nanonaut
  nanonautY = nanonautY + nanonautYspeed;
  nanonautYspeed = nanonautYspeed + NANONAUT_Y_ACCELERATION;
  if (nanonautY > GROUND_Y - NANONAUT_HEIGHT) {
    nanonautY = GROUND_Y - NANONAUT_HEIGHT;
    nanonautYspeed = 0;
    nanonautIsInTheAir = false;
  }

  //Update camera
  cameraX = nanonautX - 150;
}

//DRAWING
function draw() {
  //Draw sky
  c.fillStyle = "LightSkyBlue";
  c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40);

  //Draw background
  var backgroundX = - (cameraX % BACKGROUND_WIDTH);
  c.drawImage(backgroundImage, backgroundX, -210);
  c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH, - 210);

  //Draw earth
  c.fillStyle = "ForestGreen";
  c.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40);

  //Draw nanonaut
  var nanonautSpriteSheetRow = Math.floor(nanonautFrameNr / NANONAUT_NR_FRAMES_PER_ROW);
  c.drawImage(nanonautImage, nanonautX - cameraX, nanonautY - cameraY);
}
