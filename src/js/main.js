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
var NANONAUT_ANIMATION_SPEED = 3;

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

var bush1Image = new Image();
bush1Image.src = "assets/img/bush1.png";

var bush2Image = new Image();
bush2Image.src = "assets/img/bush2.png";

var nanonautX = CANVAS_WIDTH / 2;
var nanonautY = GROUND_Y - NANONAUT_HEIGHT;
var nanonautYspeed = 0;
var nanonautIsInTheAir = false;
var spaceKeyIsPressed = false;
var cameraX = 0;
var cameraY = 0;
var nanonautFrameNr = 0;
var gameFrameCounter = 0;
var bushData = generateBushes();

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

window.addEventListener("load", start);

function start() {
  window.requestAnimationFrame(mainLoop);
}

//TO DO: Refill the code - at this point it doesn't work.
function generateBushes() {
  var generatedBushData = [];
  return generatedBushData;
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
  gameFrameCounter = gameFrameCounter + 1;

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

  //Update animation
  if (gameFrameCounter % NANONAUT_ANIMATION_SPEED === 0) {
    nanonautFrameNr = nanonautFrameNr + 1;
    if (nanonautFrameNr >= NANONAUT_NR_ANIMATION_FRAMES) {
      nanonautFrameNr = 0;
    }
  }

  //Update camera
  cameraX = nanonautX - 150;

  //Update bushes
  for (var i = 0; i < bushData.length; i++) {
    if (bushData[i].x - cameraX < -CANVAS_WIDTH) {
      bushData[i].x += 2 * CANVAS_WIDTH + 150;
    }
  }
}

//DRAWING
function draw() {
  //Draw sky
  c.fillStyle = "LightSkyBlue";
  c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40);

  //Draw background
  var backgroundX = -(cameraX % BACKGROUND_WIDTH);
  c.drawImage(backgroundImage, backgroundX, -210);
  c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH, -210);

  //Draw earth
  c.fillStyle = "ForestGreen";
  c.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40);

  //DRAW BUSHES
  for (var i = 0; i < bushData.length; i++) {
    c.drawImage(
      bushData[i].image,
      bushData[i].x - cameraX,
      GROUND_Y - bushData[i].y - cameraY
    );
  }

  //Draw nanonaut
  var nanonautSpriteSheetRow = Math.floor(
    nanonautFrameNr / NANONAUT_NR_FRAMES_PER_ROW
  );
  var nanonautSpriteSheetColumn = nanonautFrameNr % NANONAUT_NR_FRAMES_PER_ROW;
  var nanonautSpriteSheetX = nanonautSpriteSheetColumn * NANONAUT_WIDTH;
  var nanonautSpriteSheetY = nanonautSpriteSheetRow * NANONAUT_HEIGHT;
  c.drawImage(
    nanonautImage,
    nanonautSpriteSheetX,
    nanonautSpriteSheetY,
    NANONAUT_WIDTH,
    NANONAUT_HEIGHT,
    nanonautX - cameraX,
    nanonautY - cameraY,
    NANONAUT_WIDTH,
    NANONAUT_HEIGHT
  );
}
