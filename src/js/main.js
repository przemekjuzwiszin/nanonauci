"use strict";

/*
   _____    ____    _   _    _____   _______              _   _   _______ 
  / ____|  / __ \  | \ | |  / ____| |__   __|     /\     | \ | | |__   __|
 | |      | |  | | |  \| | | (___      | |       /  \    |  \| |    | |   
 | |      | |  | | | . ` |  \___ \     | |      / /\ \   | . ` |    | |   
 | |____  | |__| | | |\  |  ____) |    | |     / ____ \  | |\  |    | |   
  \_____|  \____/  |_| \_| |_____/     |_|    /_/    \_\ |_| \_|    |_|   

*/

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
var NANONAUT_NR_ANIMATION_FRAMES = 7;
var NANONAUT_ANIMATION_SPEED = 3;
var ROBOT_WIDTH = 141;
var ROBOT_HEIGHT = 139;
var ROBOT_NR_ANIMATION_FRAMES = 9;
var ROBOT_ANIMATION_SPEED = 5;
var ROBOT_X_SPEED = 4;
var MIN_DISTANCE_BETWEEN_ROBOTS = 400;
var MAX_DISTANCE_BETWEEN_ROBOTS = 1200;
var MAX_ACTIVE_ROBOTS = 3;
var SCREENSHAKE_RADIUS = 16;
var NANONAUT_MAX_HEALTH = 100;
var PLAY_GAME_MODE = 0;
var GAME_OVER_GAME_MODE = 1;
var COIN_WIDTH = 80;
var COIN_HEIGHT = 60;
var coinGroundX = 800;
var coinGroundY = GROUND_Y - 80;
var positionCoinCounterImageX = 20;
var positionCoinCounterImageY = 60;
var COUNTER_IMAGE_WIDTH = 48;
var COUNTER_IMAGE_HEIGHT = 48;
var positionCoinScoreCounterX = 80;
var positionCoinScoreCounterY = 102;
var CALCULATE_COLLISION_WITH_ROBOTS = false;

/*
_____    _____    ______    _____    ____    _   _   ______   _____    _____ 
|  __ \  |  __ \  |  ____|  / ____|  / __ \  | \ | | |  ____| |_   _|  / ____|
| |__) | | |__) | | |__    | |      | |  | | |  \| | | |__      | |   | |  __ 
|  ___/  |  _  /  |  __|   | |      | |  | | | . ` | |  __|     | |   | | |_ |
| |      | | \ \  | |____  | |____  | |__| | | |\  | | |       _| |_  | |__| |
|_|      |_|  \_\ |______|  \_____|  \____/  |_| \_| |_|      |_____|  \_____|

*/

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

var nanocoinImage = new Image();
nanocoinImage.src = "assets/img/nanocoin.png";

var robotImage = new Image();
robotImage.src = "assets/img/animatedRobot.png";

var gameMode = PLAY_GAME_MODE;
var nanonautX = CANVAS_WIDTH / 2;
var nanonautY = GROUND_Y - NANONAUT_HEIGHT;
var nanonautYspeed = 0;
var nanonautIsInTheAir = false;
var spaceKeyIsPressed = false;
var nanonautHealth = NANONAUT_MAX_HEALTH;
var cameraX = 0;
var cameraY = 0;
var screenshake = false;
var nanonautFrameNr = 0;
var gameFrameCounter = 0;
var bushData = generateBushes();
var numberOfCoins = 0;

//array to x cordinates nanocoin
var coinData = generateCoins();

var nanonautSpriteSheet = {
  nrFramesPerRow: 5,
  spriteWidth: NANONAUT_WIDTH,
  spriteHeight: NANONAUT_HEIGHT,
  image: nanonautImage,
};

//Code to handle the robot sprite sheet (new object)
var robotSpriteSheet = {
  nrFramesPerRow: 3,
  spriteWidth: ROBOT_WIDTH,
  spriteHeight: ROBOT_HEIGHT,
  image: robotImage,
};

var nanonautCollisionRectangle = {
  xOffset: 60,
  yOffset: 20,
  width: 50,
  height: 200,
};

var robotCollisionRectangle = {
  xOffset: 50,
  yOffset: 20,
  width: 50,
  height: 100,
};

//This create collision area for coin
var coinCollisionRectangle = {
  xOffset: 30,
  yOffset: 15,
  width: 60,
  height: 100,
};

//Short list of robots to test
var robotData = [];

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

window.addEventListener("load", start);

function start() {
  window.requestAnimationFrame(mainLoop);
}

function generateBushes() {
  var generatedBushData = [];
  var bushX = 0;
  while (bushX < 2 * CANVAS_WIDTH) {
    var bushImage;
    if (Math.random() >= 0.5) {
      bushImage = bush1Image;
    } else {
      bushImage = bush2Image;
    }
    generatedBushData.push({
      x: bushX,
      y: 80 + Math.random() * 20,
      image: bushImage,
    });
    bushX += 150 + Math.random() * 200;
  }
  return generatedBushData;
}

function generateCoins() {
  var generatedCoinData = [];
  generatedCoinData.push({
    x: coinGroundX + Math.random() * CANVAS_WIDTH,
    y: coinGroundY,
    image: nanocoinImage,
  });
  return generatedCoinData;
}

/*
  __  __              _____   _   _     _         ____     ____    _____  
 |  \/  |     /\     |_   _| | \ | |   | |       / __ \   / __ \  |  __ \ 
 | \  / |    /  \      | |   |  \| |   | |      | |  | | | |  | | | |__) |
 | |\/| |   / /\ \     | |   | . ` |   | |      | |  | | | |  | | |  ___/ 
 | |  | |  / ____ \   _| |_  | |\  |   | |____  | |__| | | |__| | | |     
 |_|  |_| /_/    \_\ |_____| |_| \_|   |______|  \____/   \____/  |_|     
                                                                          
*/

function mainLoop() {
  update();
  draw();
  window.requestAnimationFrame(mainLoop);
}

/*
   _____    ____    _   _   _______   _____     ____    _      
  / ____|  / __ \  | \ | | |__   __| |  __ \   / __ \  | |     
 | |      | |  | | |  \| |    | |    | |__) | | |  | | | |     
 | |      | |  | | | . ` |    | |    |  _  /  | |  | | | |     
 | |____  | |__| | | |\  |    | |    | | \ \  | |__| | | |____ 
  \_____|  \____/  |_| \_|    |_|    |_|  \_\  \____/  |______|
                                                               
*/

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

/*
  _    _   _____    _____               _______   ______ 
 | |  | | |  __ \  |  __ \      /\     |__   __| |  ____|
 | |  | | | |__) | | |  | |    /  \       | |    | |__   
 | |  | | |  ___/  | |  | |   / /\ \      | |    |  __|  
 | |__| | | |      | |__| |  / ____ \     | |    | |____ 
  \____/  |_|      |_____/  /_/    \_\    |_|    |______|
                                                         
*/

function update() {
  if (gameMode != PLAY_GAME_MODE) return;

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

  var nanonautCatchCoin = updateCoins();

  //Update robots
  screenshake = false;
  var nanonautTouchedARobot = updateRobots();
  if (nanonautTouchedARobot) {
    screenshake = true;
    if (nanonautHealth > 0) nanonautHealth -= 1;
  }
  //check if the game end
  if (nanonautHealth <= 0) {
    gameMode = GAME_OVER_GAME_MODE;
    screenshake = false;
  }

  for (var i = 0; i < coinData.length; i++) {
    var isCoinOutsideLeftCamera = coinData[i].x - cameraX < -CANVAS_WIDTH;
    if (isCoinOutsideLeftCamera || nanonautCatchCoin) {
      coinData[i].x += 2 * CANVAS_WIDTH;
    }
  }
}

function updateRobots() {
  //Moving and animating robots and detects a collision with a nanonaut
  var nanonautTouchedARobot = false;
  for (var i = 0; i < robotData.length; i++) {
    if (
      doesNanonautOverlapRobot(
        nanonautX + nanonautCollisionRectangle.xOffset,
        nanonautY + nanonautCollisionRectangle.yOffset,
        nanonautCollisionRectangle.width,
        nanonautCollisionRectangle.height,
        robotData[i].x + robotCollisionRectangle.xOffset,
        robotData[i].y + robotCollisionRectangle.yOffset,
        robotCollisionRectangle.width,
        robotCollisionRectangle.height
      )
    ) {
      if (CALCULATE_COLLISION_WITH_ROBOTS) {
        nanonautTouchedARobot = true;
      }
    }
    robotData[i].x -= ROBOT_X_SPEED;
    if (gameFrameCounter % ROBOT_ANIMATION_SPEED === 0) {
      robotData[i].frameNr = robotData[i].frameNr + 1;
      if (robotData[i].frameNr >= ROBOT_NR_ANIMATION_FRAMES) {
        robotData[i].frameNr = 0;
      }
    }
  }

  //Remove robots that have gone off-screen
  var robotIndex = 0;
  while (robotIndex < robotData.length) {
    if (robotData[robotIndex].x < cameraX - ROBOT_WIDTH) {
      robotData.splice(robotIndex, 1);
    } else {
      robotIndex += 1;
    }
  }

  if (robotData.length < MAX_ACTIVE_ROBOTS) {
    var lastRobotX = CANVAS_WIDTH;
    if (robotData.length > 0) {
      lastRobotX = robotData[robotData.length - 1].x;
    }
    var newRobotX =
      lastRobotX +
      MIN_DISTANCE_BETWEEN_ROBOTS +
      Math.random() *
        (MAX_DISTANCE_BETWEEN_ROBOTS - MIN_DISTANCE_BETWEEN_ROBOTS);
    robotData.push({
      x: newRobotX,
      y: GROUND_Y - ROBOT_HEIGHT,
      frameNr: 0,
    });
  }
  return nanonautTouchedARobot;
}

function doesNanonautOverlapRobotAlongOneAxis(
  nanonautNearX,
  nanonautFarX,
  robotNearX,
  robotFarX
) {
  var nanonautOverlapsNearRobotEdge =
    nanonautFarX >= robotNearX && nanonautFarX <= robotFarX;
  var nanonautOverlapsFarRobotEdge =
    nanonautNearX >= robotNearX && nanonautNearX <= robotFarX;
  var nanonautOverlapsEntireRobot =
    nanonautNearX <= robotNearX && nanonautFarX >= robotFarX;
  return (
    nanonautOverlapsNearRobotEdge ||
    nanonautOverlapsFarRobotEdge ||
    nanonautOverlapsEntireRobot
  );
}

function doesNanonautOverlapRobot(
  nanonautX,
  nanonautY,
  NANONAUT_WIDTH,
  NANONAUT_HEIGHT,
  robotX,
  robotY,
  ROBOT_WIDTH,
  ROBOT_HEIGHT
) {
  var nanonautOverlapsRobotOnXAxis = doesNanonautOverlapRobotAlongOneAxis(
    nanonautX,
    nanonautX + NANONAUT_WIDTH,
    robotX,
    robotX + ROBOT_WIDTH
  );
  var nanonautOverlapRobotOnYAxis = doesNanonautOverlapRobotAlongOneAxis(
    nanonautY,
    nanonautY + NANONAUT_HEIGHT,
    robotY,
    robotY + ROBOT_HEIGHT
  );
  return nanonautOverlapsRobotOnXAxis && nanonautOverlapRobotOnYAxis;
}

function updateCoins() {
  var nanonautCatchCoin = false;
  for (var i = 0; i < coinData.length; i++) {
    if (
      doesNanonautOverlapCoin(
        nanonautX + nanonautCollisionRectangle.xOffset,
        nanonautY + nanonautCollisionRectangle.yOffset,
        nanonautCollisionRectangle.width,
        nanonautCollisionRectangle.height,
        coinData[i].x + coinCollisionRectangle.xOffset,
        coinData[i].y + coinCollisionRectangle.yOffset,
        coinCollisionRectangle.width,
        coinCollisionRectangle.height
      )
    ) {
      nanonautCatchCoin = true;
    }
  }
  return nanonautCatchCoin;
}

//THIS FUNCTION CHECK THE COLLISION BETWEEN NANONAUT AND COIN
function doesNanonautOverlapCoinAlongOneAxis(
  nanonautNearX,
  nanonautFarX,
  coinNearX,
  coinFarX
) {
  var nanonautOverLapsNearCoinEdge =
    nanonautFarX >= coinNearX && nanonautFarX <= coinFarX;
  var nanonautOverLapsFarCoinEdge =
    nanonautNearX >= coinNearX && nanonautNearX <= coinFarX;
  var nanonautOverlapsEntireCoin =
    nanonautNearX <= coinNearX && nanonautFarX >= coinFarX;
  return (
    nanonautOverLapsNearCoinEdge ||
    nanonautOverLapsFarCoinEdge ||
    nanonautOverlapsEntireCoin
  );
}

// THIS FUNCTION CHECK THE PARAMETERS OF THE NANONAUT AND THE COIN IN RELATION TO TWO AXES
function doesNanonautOverlapCoin(
  nanonautX,
  nanonautY,
  NANONAUT_WIDTH,
  NANONAUT_HEIGHT,
  coinX,
  coinY,
  COIN_WIDTH,
  COIN_HEIGHT
) {
  var nanonautCatchCoinAlongOneXAxis = doesNanonautOverlapCoinAlongOneAxis(
    nanonautX,
    nanonautX + NANONAUT_WIDTH,
    coinX,
    coinX + COIN_WIDTH
  );
  var nanonautCatchCoinAlongOneYAxis = doesNanonautOverlapCoinAlongOneAxis(
    nanonautY,
    nanonautY + NANONAUT_HEIGHT,
    coinY,
    coinY + COIN_HEIGHT
  );
  return nanonautCatchCoinAlongOneXAxis && nanonautCatchCoinAlongOneYAxis;
}

/*
  _____    _____              __          __  _____   _   _    _____ 
 |  __ \  |  __ \      /\     \ \        / / |_   _| | \ | |  / ____|
 | |  | | | |__) |    /  \     \ \  /\  / /    | |   |  \| | | |  __ 
 | |  | | |  _  /    / /\ \     \ \/  \/ /     | |   | . ` | | | |_ |
 | |__| | | | \ \   / ____ \     \  /\  /     _| |_  | |\  | | |__| |
 |_____/  |_|  \_\ /_/    \_\     \/  \/     |_____| |_| \_|  \_____|
                                                                     
*/

function draw() {
  //if necessary, shake the screen
  var shakenCameraX = cameraX;
  var shakenCameraY = cameraY;
  if (screenshake) {
    shakenCameraX += (Math.random() - 0.5) * SCREENSHAKE_RADIUS;
    shakenCameraY += (Math.random() - 0.5) * SCREENSHAKE_RADIUS;
  }

  //Draw sky
  c.fillStyle = "LightSkyBlue";
  c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40);

  //Draw background
  var backgroundX = -(shakenCameraX % BACKGROUND_WIDTH);
  c.drawImage(backgroundImage, backgroundX, -210);
  c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH, -210);

  //Draw earth
  c.fillStyle = "ForestGreen";
  c.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40);

  //DRAW BUSHES
  for (var i = 0; i < bushData.length; i++) {
    c.drawImage(
      bushData[i].image,
      bushData[i].x - shakenCameraX,
      GROUND_Y - bushData[i].y - shakenCameraY
    );
  }

  //Draw nanocoins
  for (var i = 0; i < coinData.length; i++) {
    c.drawImage(
      coinData[i].image,
      coinData[i].x - shakenCameraX,
      coinData[i].y - shakenCameraY,
      COIN_WIDTH,
      COIN_HEIGHT
    );
  }

  //Show coin counter image
  c.drawImage(
    nanocoinImage,
    positionCoinCounterImageX,
    positionCoinCounterImageY,
    COUNTER_IMAGE_WIDTH,
    COUNTER_IMAGE_HEIGHT
  );

  //Show number of coins
  c.fillStyle = "black";
  c.font = "45px sans-serif";
  c.fillText(
    numberOfCoins,
    positionCoinScoreCounterX,
    positionCoinScoreCounterY
  );

  //Draw robots
  for (var i = 0; i < robotData.length; i++) {
    drawAnimatedSprite(
      robotData[i].x - shakenCameraX,
      robotData[i].y - shakenCameraY,
      robotData[i].frameNr,
      robotSpriteSheet
    );
  }

  //Draw nanonaut
  drawAnimatedSprite(
    nanonautX - shakenCameraX,
    nanonautY - shakenCameraY,
    nanonautFrameNr,
    nanonautSpriteSheet
  );

  //display the distance traveled by the nanonaut
  var nanonautDistance = nanonautX / 100;
  c.fillStyle = "black";
  c.font = "48px sans-serif";
  c.fillText(nanonautDistance.toFixed(0) + "m", 20, 40);

  //Draw nanonaut health
  c.fillStyle = "red";
  c.fillRect(400, 10, (nanonautHealth / NANONAUT_MAX_HEALTH) * 380, 20);
  c.strokeStyle = "red";
  c.strokeRect(400, 10, 380, 20);

  //If the game is over, display the end of the game
  if (gameMode == GAME_OVER_GAME_MODE) {
    c.font = "69px sans-serif";
    c.fillStyle = "black";
    c.fillText("GAME OVER", 120, 300);
  }
  //Draw a sprite animation
  function drawAnimatedSprite(screenX, screenY, frameNr, spriteSheet) {
    var spriteSheetRow = Math.floor(frameNr / spriteSheet.nrFramesPerRow);
    var spriteSheetColumn = frameNr % spriteSheet.nrFramesPerRow;
    var spriteSheetX = spriteSheetColumn * spriteSheet.spriteWidth;
    var spriteSheetY = spriteSheetRow * spriteSheet.spriteHeight;

    c.drawImage(
      spriteSheet.image,
      spriteSheetX,
      spriteSheetY,
      spriteSheet.spriteWidth,
      spriteSheet.spriteHeight,
      screenX,
      screenY,
      spriteSheet.spriteWidth,
      spriteSheet.spriteHeight
    );
  }
}
