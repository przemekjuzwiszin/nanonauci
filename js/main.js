!function(n){var c={};function r(a){if(c[a])return c[a].exports;var t=c[a]={i:a,l:!1,exports:{}};return n[a].call(t.exports,t,t.exports,r),t.l=!0,t.exports}r.m=n,r.c=c,r.d=function(n,c,a){r.o(n,c)||Object.defineProperty(n,c,{enumerable:!0,get:a})},r.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},r.t=function(n,c){if(1&c&&(n=r(n)),8&c)return n;if(4&c&&"object"==typeof n&&n&&n.__esModule)return n;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:n}),2&c&&"string"!=typeof n)for(var t in n)r.d(a,t,function(c){return n[c]}.bind(null,t));return a},r.n=function(n){var c=n&&n.__esModule?function(){return n.default}:function(){return n};return r.d(c,"a",c),c},r.o=function(n,c){return Object.prototype.hasOwnProperty.call(n,c)},r.p="",r(r.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\n// service worker registration - remove if you\'re not going to use it\r\n\r\nif ("serviceWorker" in navigator) {\r\n  window.addEventListener("load", function () {\r\n    navigator.serviceWorker.register("serviceworker.js").then(\r\n      function (registration) {\r\n        // Registration was successful\r\n        console.log(\r\n          "ServiceWorker registration successful with scope: ",\r\n          registration.scope\r\n        );\r\n      },\r\n      function (err) {\r\n        // registration failed :(\r\n        console.log("ServiceWorker registration failed: ", err);\r\n      }\r\n    );\r\n  });\r\n}\r\n\r\n// place your code below\r\n\r\n//CONSTANT\r\nvar CANVAS_WIDTH = 800;\r\nvar CANVAS_HEIGHT = 600;\r\nvar NANONAUT_WIDTH = 181;\r\nvar NANONAUT_HEIGHT = 229;\r\nvar GROUND_Y = 540;\r\nvar NANONAUT_Y_ACCELERATION = 1;\r\nvar SPACE_KEYCODE = 32;\r\nvar NANONAUT_JUMP_SPEED = 20;\r\nvar NANONAUT_X_SPEED = 5;\r\nvar BACKGROUND_WIDTH = 1000;\r\nvar NANONAUT_NR_FRAMES_PER_ROW = 5;\r\nvar NANONAUT_NR_ANIMATION_FRAMES = 7;\r\nvar NANONAUT_ANIMATION_SPEED = 3;\r\n\r\n//PRECONFIGURATION\r\nvar canvas = document.createElement("canvas");\r\nvar c = canvas.getContext("2d");\r\ncanvas.width = CANVAS_WIDTH;\r\ncanvas.height = CANVAS_HEIGHT;\r\ndocument.body.appendChild(canvas);\r\n\r\nvar nanonautImage = new Image();\r\nnanonautImage.src = "assets/img/animatedNanonaut.png";\r\n\r\nvar backgroundImage = new Image();\r\nbackgroundImage.src = "assets/img/background.png";\r\n\r\nvar bush1Image = new Image();\r\nbush1Image.src = "assets/img/bush1.png";\r\n\r\nvar bush2Image = new Image();\r\nbush2Image.src = "assets/img/bush2.png";\r\n\r\nvar nanonautX = CANVAS_WIDTH / 2;\r\nvar nanonautY = GROUND_Y - NANONAUT_HEIGHT;\r\nvar nanonautYspeed = 0;\r\nvar nanonautIsInTheAir = false;\r\nvar spaceKeyIsPressed = false;\r\nvar cameraX = 0;\r\nvar cameraY = 0;\r\nvar nanonautFrameNr = 0;\r\nvar gameFrameCounter = 0;\r\nvar bushData = generateBushes();\r\n\r\nwindow.addEventListener("keydown", onKeyDown);\r\nwindow.addEventListener("keyup", onKeyUp);\r\n\r\nwindow.addEventListener("load", start);\r\n\r\nfunction start() {\r\n  window.requestAnimationFrame(mainLoop);\r\n}\r\n\r\n//TO DO: Refill the code - at this point it doesn\'t work.\r\nfunction generateBushes() {\r\n  var generatedBushData = [];\r\n  return generatedBushData;\r\n}\r\n\r\n//MAIN LOOP\r\nfunction mainLoop() {\r\n  update();\r\n  draw();\r\n  window.requestAnimationFrame(mainLoop);\r\n}\r\n\r\n//CONTROL\r\nfunction onKeyDown(event) {\r\n  if (event.keyCode === SPACE_KEYCODE) {\r\n    spaceKeyIsPressed = true;\r\n  }\r\n}\r\n\r\nfunction onKeyUp(event) {\r\n  if (event.keyCode === SPACE_KEYCODE) {\r\n    spaceKeyIsPressed = false;\r\n  }\r\n}\r\n\r\n//UPDATE\r\nfunction update() {\r\n  gameFrameCounter = gameFrameCounter + 1;\r\n\r\n  nanonautX = nanonautX + NANONAUT_X_SPEED;\r\n  if (spaceKeyIsPressed && !nanonautIsInTheAir) {\r\n    nanonautYspeed = -NANONAUT_JUMP_SPEED;\r\n    nanonautIsInTheAir = true;\r\n  }\r\n\r\n  //Update nanonaut\r\n  nanonautY = nanonautY + nanonautYspeed;\r\n  nanonautYspeed = nanonautYspeed + NANONAUT_Y_ACCELERATION;\r\n  if (nanonautY > GROUND_Y - NANONAUT_HEIGHT) {\r\n    nanonautY = GROUND_Y - NANONAUT_HEIGHT;\r\n    nanonautYspeed = 0;\r\n    nanonautIsInTheAir = false;\r\n  }\r\n\r\n  //Update animation\r\n  if (gameFrameCounter % NANONAUT_ANIMATION_SPEED === 0) {\r\n    nanonautFrameNr = nanonautFrameNr + 1;\r\n    if (nanonautFrameNr >= NANONAUT_NR_ANIMATION_FRAMES) {\r\n      nanonautFrameNr = 0;\r\n    }\r\n  }\r\n\r\n  //Update camera\r\n  cameraX = nanonautX - 150;\r\n\r\n  //Update bushes\r\n  for (var i = 0; i < bushData.length; i++) {\r\n    if (bushData[i].x - cameraX < -CANVAS_WIDTH) {\r\n      bushData[i].x += 2 * CANVAS_WIDTH + 150;\r\n    }\r\n  }\r\n}\r\n\r\n//DRAWING\r\nfunction draw() {\r\n  //Draw sky\r\n  c.fillStyle = "LightSkyBlue";\r\n  c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40);\r\n\r\n  //Draw background\r\n  var backgroundX = -(cameraX % BACKGROUND_WIDTH);\r\n  c.drawImage(backgroundImage, backgroundX, -210);\r\n  c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH, -210);\r\n\r\n  //Draw earth\r\n  c.fillStyle = "ForestGreen";\r\n  c.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40);\r\n\r\n  //DRAW BUSHES\r\n  for (var i = 0; i < bushData.length; i++) {\r\n    c.drawImage(\r\n      bushData[i].image,\r\n      bushData[i].x - cameraX,\r\n      GROUND_Y - bushData[i].y - cameraY\r\n    );\r\n  }\r\n\r\n  //Draw nanonaut\r\n  var nanonautSpriteSheetRow = Math.floor(\r\n    nanonautFrameNr / NANONAUT_NR_FRAMES_PER_ROW\r\n  );\r\n  var nanonautSpriteSheetColumn = nanonautFrameNr % NANONAUT_NR_FRAMES_PER_ROW;\r\n  var nanonautSpriteSheetX = nanonautSpriteSheetColumn * NANONAUT_WIDTH;\r\n  var nanonautSpriteSheetY = nanonautSpriteSheetRow * NANONAUT_HEIGHT;\r\n  c.drawImage(\r\n    nanonautImage,\r\n    nanonautSpriteSheetX,\r\n    nanonautSpriteSheetY,\r\n    NANONAUT_WIDTH,\r\n    NANONAUT_HEIGHT,\r\n    nanonautX - cameraX,\r\n    nanonautY - cameraY,\r\n    NANONAUT_WIDTH,\r\n    NANONAUT_HEIGHT\r\n  );\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHFCQUFxQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHFCQUFxQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLy8gc2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIC0gcmVtb3ZlIGlmIHlvdSdyZSBub3QgZ29pbmcgdG8gdXNlIGl0XHJcblxyXG5pZiAoXCJzZXJ2aWNlV29ya2VyXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKFwic2VydmljZXdvcmtlci5qc1wiKS50aGVuKFxyXG4gICAgICBmdW5jdGlvbiAocmVnaXN0cmF0aW9uKSB7XHJcbiAgICAgICAgLy8gUmVnaXN0cmF0aW9uIHdhcyBzdWNjZXNzZnVsXHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICBcIlNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN1Y2Nlc3NmdWwgd2l0aCBzY29wZTogXCIsXHJcbiAgICAgICAgICByZWdpc3RyYXRpb24uc2NvcGVcclxuICAgICAgICApO1xyXG4gICAgICB9LFxyXG4gICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZCA6KFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiBcIiwgZXJyKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9KTtcclxufVxyXG5cclxuLy8gcGxhY2UgeW91ciBjb2RlIGJlbG93XHJcblxyXG4vL0NPTlNUQU5UXHJcbnZhciBDQU5WQVNfV0lEVEggPSA4MDA7XHJcbnZhciBDQU5WQVNfSEVJR0hUID0gNjAwO1xyXG52YXIgTkFOT05BVVRfV0lEVEggPSAxODE7XHJcbnZhciBOQU5PTkFVVF9IRUlHSFQgPSAyMjk7XHJcbnZhciBHUk9VTkRfWSA9IDU0MDtcclxudmFyIE5BTk9OQVVUX1lfQUNDRUxFUkFUSU9OID0gMTtcclxudmFyIFNQQUNFX0tFWUNPREUgPSAzMjtcclxudmFyIE5BTk9OQVVUX0pVTVBfU1BFRUQgPSAyMDtcclxudmFyIE5BTk9OQVVUX1hfU1BFRUQgPSA1O1xyXG52YXIgQkFDS0dST1VORF9XSURUSCA9IDEwMDA7XHJcbnZhciBOQU5PTkFVVF9OUl9GUkFNRVNfUEVSX1JPVyA9IDU7XHJcbnZhciBOQU5PTkFVVF9OUl9BTklNQVRJT05fRlJBTUVTID0gNztcclxudmFyIE5BTk9OQVVUX0FOSU1BVElPTl9TUEVFRCA9IDM7XHJcblxyXG4vL1BSRUNPTkZJR1VSQVRJT05cclxudmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbnZhciBjID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuY2FudmFzLndpZHRoID0gQ0FOVkFTX1dJRFRIO1xyXG5jYW52YXMuaGVpZ2h0ID0gQ0FOVkFTX0hFSUdIVDtcclxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG5cclxudmFyIG5hbm9uYXV0SW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxubmFub25hdXRJbWFnZS5zcmMgPSBcImFzc2V0cy9pbWcvYW5pbWF0ZWROYW5vbmF1dC5wbmdcIjtcclxuXHJcbnZhciBiYWNrZ3JvdW5kSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuYmFja2dyb3VuZEltYWdlLnNyYyA9IFwiYXNzZXRzL2ltZy9iYWNrZ3JvdW5kLnBuZ1wiO1xyXG5cclxudmFyIGJ1c2gxSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuYnVzaDFJbWFnZS5zcmMgPSBcImFzc2V0cy9pbWcvYnVzaDEucG5nXCI7XHJcblxyXG52YXIgYnVzaDJJbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5idXNoMkltYWdlLnNyYyA9IFwiYXNzZXRzL2ltZy9idXNoMi5wbmdcIjtcclxuXHJcbnZhciBuYW5vbmF1dFggPSBDQU5WQVNfV0lEVEggLyAyO1xyXG52YXIgbmFub25hdXRZID0gR1JPVU5EX1kgLSBOQU5PTkFVVF9IRUlHSFQ7XHJcbnZhciBuYW5vbmF1dFlzcGVlZCA9IDA7XHJcbnZhciBuYW5vbmF1dElzSW5UaGVBaXIgPSBmYWxzZTtcclxudmFyIHNwYWNlS2V5SXNQcmVzc2VkID0gZmFsc2U7XHJcbnZhciBjYW1lcmFYID0gMDtcclxudmFyIGNhbWVyYVkgPSAwO1xyXG52YXIgbmFub25hdXRGcmFtZU5yID0gMDtcclxudmFyIGdhbWVGcmFtZUNvdW50ZXIgPSAwO1xyXG52YXIgYnVzaERhdGEgPSBnZW5lcmF0ZUJ1c2hlcygpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uS2V5RG93bik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgb25LZXlVcCk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgc3RhcnQpO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcCk7XHJcbn1cclxuXHJcbi8vVE8gRE86IFJlZmlsbCB0aGUgY29kZSAtIGF0IHRoaXMgcG9pbnQgaXQgZG9lc24ndCB3b3JrLlxyXG5mdW5jdGlvbiBnZW5lcmF0ZUJ1c2hlcygpIHtcclxuICB2YXIgZ2VuZXJhdGVkQnVzaERhdGEgPSBbXTtcclxuICByZXR1cm4gZ2VuZXJhdGVkQnVzaERhdGE7XHJcbn1cclxuXHJcbi8vTUFJTiBMT09QXHJcbmZ1bmN0aW9uIG1haW5Mb29wKCkge1xyXG4gIHVwZGF0ZSgpO1xyXG4gIGRyYXcoKTtcclxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5Mb29wKTtcclxufVxyXG5cclxuLy9DT05UUk9MXHJcbmZ1bmN0aW9uIG9uS2V5RG93bihldmVudCkge1xyXG4gIGlmIChldmVudC5rZXlDb2RlID09PSBTUEFDRV9LRVlDT0RFKSB7XHJcbiAgICBzcGFjZUtleUlzUHJlc3NlZCA9IHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBvbktleVVwKGV2ZW50KSB7XHJcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IFNQQUNFX0tFWUNPREUpIHtcclxuICAgIHNwYWNlS2V5SXNQcmVzc2VkID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcblxyXG4vL1VQREFURVxyXG5mdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgZ2FtZUZyYW1lQ291bnRlciA9IGdhbWVGcmFtZUNvdW50ZXIgKyAxO1xyXG5cclxuICBuYW5vbmF1dFggPSBuYW5vbmF1dFggKyBOQU5PTkFVVF9YX1NQRUVEO1xyXG4gIGlmIChzcGFjZUtleUlzUHJlc3NlZCAmJiAhbmFub25hdXRJc0luVGhlQWlyKSB7XHJcbiAgICBuYW5vbmF1dFlzcGVlZCA9IC1OQU5PTkFVVF9KVU1QX1NQRUVEO1xyXG4gICAgbmFub25hdXRJc0luVGhlQWlyID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8vVXBkYXRlIG5hbm9uYXV0XHJcbiAgbmFub25hdXRZID0gbmFub25hdXRZICsgbmFub25hdXRZc3BlZWQ7XHJcbiAgbmFub25hdXRZc3BlZWQgPSBuYW5vbmF1dFlzcGVlZCArIE5BTk9OQVVUX1lfQUNDRUxFUkFUSU9OO1xyXG4gIGlmIChuYW5vbmF1dFkgPiBHUk9VTkRfWSAtIE5BTk9OQVVUX0hFSUdIVCkge1xyXG4gICAgbmFub25hdXRZID0gR1JPVU5EX1kgLSBOQU5PTkFVVF9IRUlHSFQ7XHJcbiAgICBuYW5vbmF1dFlzcGVlZCA9IDA7XHJcbiAgICBuYW5vbmF1dElzSW5UaGVBaXIgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8vVXBkYXRlIGFuaW1hdGlvblxyXG4gIGlmIChnYW1lRnJhbWVDb3VudGVyICUgTkFOT05BVVRfQU5JTUFUSU9OX1NQRUVEID09PSAwKSB7XHJcbiAgICBuYW5vbmF1dEZyYW1lTnIgPSBuYW5vbmF1dEZyYW1lTnIgKyAxO1xyXG4gICAgaWYgKG5hbm9uYXV0RnJhbWVOciA+PSBOQU5PTkFVVF9OUl9BTklNQVRJT05fRlJBTUVTKSB7XHJcbiAgICAgIG5hbm9uYXV0RnJhbWVOciA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBjYW1lcmFcclxuICBjYW1lcmFYID0gbmFub25hdXRYIC0gMTUwO1xyXG5cclxuICAvL1VwZGF0ZSBidXNoZXNcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1c2hEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoYnVzaERhdGFbaV0ueCAtIGNhbWVyYVggPCAtQ0FOVkFTX1dJRFRIKSB7XHJcbiAgICAgIGJ1c2hEYXRhW2ldLnggKz0gMiAqIENBTlZBU19XSURUSCArIDE1MDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vRFJBV0lOR1xyXG5mdW5jdGlvbiBkcmF3KCkge1xyXG4gIC8vRHJhdyBza3lcclxuICBjLmZpbGxTdHlsZSA9IFwiTGlnaHRTa3lCbHVlXCI7XHJcbiAgYy5maWxsUmVjdCgwLCAwLCBDQU5WQVNfV0lEVEgsIEdST1VORF9ZIC0gNDApO1xyXG5cclxuICAvL0RyYXcgYmFja2dyb3VuZFxyXG4gIHZhciBiYWNrZ3JvdW5kWCA9IC0oY2FtZXJhWCAlIEJBQ0tHUk9VTkRfV0lEVEgpO1xyXG4gIGMuZHJhd0ltYWdlKGJhY2tncm91bmRJbWFnZSwgYmFja2dyb3VuZFgsIC0yMTApO1xyXG4gIGMuZHJhd0ltYWdlKGJhY2tncm91bmRJbWFnZSwgYmFja2dyb3VuZFggKyBCQUNLR1JPVU5EX1dJRFRILCAtMjEwKTtcclxuXHJcbiAgLy9EcmF3IGVhcnRoXHJcbiAgYy5maWxsU3R5bGUgPSBcIkZvcmVzdEdyZWVuXCI7XHJcbiAgYy5maWxsUmVjdCgwLCBHUk9VTkRfWSAtIDQwLCBDQU5WQVNfV0lEVEgsIENBTlZBU19IRUlHSFQgLSBHUk9VTkRfWSArIDQwKTtcclxuXHJcbiAgLy9EUkFXIEJVU0hFU1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnVzaERhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgIGMuZHJhd0ltYWdlKFxyXG4gICAgICBidXNoRGF0YVtpXS5pbWFnZSxcclxuICAgICAgYnVzaERhdGFbaV0ueCAtIGNhbWVyYVgsXHJcbiAgICAgIEdST1VORF9ZIC0gYnVzaERhdGFbaV0ueSAtIGNhbWVyYVlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvL0RyYXcgbmFub25hdXRcclxuICB2YXIgbmFub25hdXRTcHJpdGVTaGVldFJvdyA9IE1hdGguZmxvb3IoXHJcbiAgICBuYW5vbmF1dEZyYW1lTnIgLyBOQU5PTkFVVF9OUl9GUkFNRVNfUEVSX1JPV1xyXG4gICk7XHJcbiAgdmFyIG5hbm9uYXV0U3ByaXRlU2hlZXRDb2x1bW4gPSBuYW5vbmF1dEZyYW1lTnIgJSBOQU5PTkFVVF9OUl9GUkFNRVNfUEVSX1JPVztcclxuICB2YXIgbmFub25hdXRTcHJpdGVTaGVldFggPSBuYW5vbmF1dFNwcml0ZVNoZWV0Q29sdW1uICogTkFOT05BVVRfV0lEVEg7XHJcbiAgdmFyIG5hbm9uYXV0U3ByaXRlU2hlZXRZID0gbmFub25hdXRTcHJpdGVTaGVldFJvdyAqIE5BTk9OQVVUX0hFSUdIVDtcclxuICBjLmRyYXdJbWFnZShcclxuICAgIG5hbm9uYXV0SW1hZ2UsXHJcbiAgICBuYW5vbmF1dFNwcml0ZVNoZWV0WCxcclxuICAgIG5hbm9uYXV0U3ByaXRlU2hlZXRZLFxyXG4gICAgTkFOT05BVVRfV0lEVEgsXHJcbiAgICBOQU5PTkFVVF9IRUlHSFQsXHJcbiAgICBuYW5vbmF1dFggLSBjYW1lcmFYLFxyXG4gICAgbmFub25hdXRZIC0gY2FtZXJhWSxcclxuICAgIE5BTk9OQVVUX1dJRFRILFxyXG4gICAgTkFOT05BVVRfSEVJR0hUXHJcbiAgKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]);