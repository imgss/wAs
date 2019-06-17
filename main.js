/**
 * Created by gg on 2016/9/7.
 */
import Wolf from "./wolf";
let can = document.getElementById("game"),
  context = can.getContext("2d"),
  can2 = document.getElementById("bg"),
  ctx = can2.getContext("2d");
const GRID_NUM = 25; // 20 25

let CELL_W;

let walls = [],
  wolves = Wolf.wolves;
window.context = context;
let sheep = {
  x: 0,
  y: 0,
  draw() {
    context.drawImage(sheepImg, this.x, this.y, CELL_W, CELL_W);
  },
  init() {
    this.x = this.y = can.width - CELL_W;
  }
};

window.sheep = sheep;
window.pause = false;
let gameOver = (window.gameOver = false);

let wolf = new Wolf(0, 0);
wolves.push(wolf);
window.gridData = Array(GRID_NUM)
  .fill()
  .map(() => Array(GRID_NUM).fill(0));
// 画网格
function drawGrid(color, stepx, stepy) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (var i = stepx + 0.5; i < ctx.canvas.width; i += stepx) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
    ctx.stroke();
  }

  for (var i = stepy + 0.5; i < ctx.canvas.height; i += stepy) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
    ctx.stroke();
  }

  ctx.restore();
}
// 砖块
class Block {
  constructor(x, y) {
    //创建砖块
    this.x = x;
    this.y = y;
  }
  draw() {
    context.save();
    context.fillRect(this.x + 1, this.y + 1, CELL_W - 1, CELL_W - 1);
    // context.drawImage(brickImg, this.x, this.y, CELL_W, CELL_W);
    context.restore();
  }
}

function wallsInit() {
  for (var i = CELL_W * 4; i < can.width - CELL_W * 4; i += CELL_W) {
    for (var j = CELL_W * 4; j < can.width - CELL_W * 4; j += CELL_W) {
      if (!(i > CELL_W * 10 && i < CELL_W * 14 && (j > CELL_W * 10 && j < CELL_W * 14))) {
        //留下中间3*3个空格
        walls.push(new Block(i, j));
        window.gridData[i / CELL_W][j / CELL_W] = 1;
      }
    }
  }
}
//画出墙
function wallsDraw() {
  context.fillStyle = "rgba(255,165,0,0.5)";
  walls.forEach(function(wall) {
    wall.draw();
  });
}

//墙的运动
function wallLine(direction) {
  //选出羊上面的砖块
  var wallLine = [];
  let len = walls.length;
  switch (direction) {
    case "up":
      for (var i = 0; i < len; i++) {
        if (walls[i].x == sheep.x && walls[i].y <= sheep.y) {
          wallLine.push(walls[i]);
        }
      }
      break;
    case "down":
      for (var i = 0; i < len; i++) {
        if (walls[i].x == sheep.x && walls[i].y >= sheep.y) {
          wallLine.push(walls[i]);
        }
      }
      break;
    case "left":
      for (var i = 0; i < len; i++) {
        if (walls[i].y == sheep.y && walls[i].x <= sheep.x) {
          wallLine.push(walls[i]);
        }
      }
      break;
    case "right":
      for (var i = 0; i < len; i++) {
        if (walls[i].y == sheep.y && walls[i].x >= sheep.x) {
          wallLine.push(walls[i]);
        }
      }
      break;
  }
  return wallLine;
}

// 返回需要移动的砖块
function wallAffect(dir, wl) {
  var wallToMove = [],
    wl = wl || wallLine(dir),
    pointer; //羊运动影响的砖块集合,edge检测边界
  switch (dir) {
    case "up":
      {
        pointer = sheep.y;
        wl.sort((a, b) => a.y - b.y);
        for (var j = wl.length - 1; j >= 0; j--) {
          if (pointer - wl[j].y == CELL_W) {
            wallToMove.push(wl[j]);
            pointer = wl[j].y;
          }
        }
      }
      break;
    case "down":
      {
        pointer = sheep.y;
        wl.sort((a, b) => a.y - b.y);
        for (var j = 0; j < wl.length; j++) {
          if (wl[j].y - pointer == CELL_W) {
            wallToMove.push(wl[j]);
            pointer = wl[j].y;
          }
        }
      }
      break;
    case "left":
      {
        pointer = sheep.x;
        wl.sort((a, b) => a.x - b.x);
        for (var k = wl.length - 1; k >= 0; k--) {
          if (pointer - wl[k].x == CELL_W) {
            wallToMove.push(wl[k]);
            pointer = wl[k].x;
          }
        }
      }
      break;
    case "right":
      {
        pointer = sheep.x;
        wl.sort((a, b) => a.x - b.x);
        for (var m = 0; m < wl.length; m++) {
          if (wl[m].x - pointer == CELL_W) {
            wallToMove.push(wl[m]);
            pointer = wl[m].x;
          }
        }
      }
      break;
  }
  return wallToMove;
}

function sheepMove(e) {
  let direction, moveBlocks;
  let audio = document.getElementById('fail');
  HTMLAudioElement.prototype.stop = function() { this.pause(); this.currentTime = 0.0;};
  if (typeof e === "string") {
    direction = e;
  } else {
    var keyID = e.keyCode ? e.keyCode : e.which;
    e.preventDefault();
    direction = getDirection(keyID);
  }
  moveBlocks = wallAffect(direction);
  // 获得羊的方向
  function getDirection(keyID) {
    if (keyID === 38 || keyID === 87) {
      return "up";
    }
    if (keyID === 39 || keyID === 68) {
      return "right";
    }
    if (keyID === 40 || keyID === 83) {
      return "down";
    }
    if (keyID === 37 || keyID === 65) {
      return "left";
    }
  }
  //判断移动的方向上是不是有狼
  function isWolfInTheWay(wolf, direction) {
    let len = moveBlocks.length;
    if (len === 0) return false;

    let lastBlock = moveBlocks[len - 1];
    if (direction === "up") {
      return lastBlock.x === wolf.x && lastBlock.y - CELL_W === wolf.y;
    }
    if (direction === "down") {
      return lastBlock.x === wolf.x && lastBlock.y + CELL_W === wolf.y;
    }
    if (direction === "left") {
      return lastBlock.y === wolf.y && lastBlock.x - CELL_W === wolf.x;
    }
    if (direction === "right") {
      return lastBlock.y === wolf.y && lastBlock.x + CELL_W === wolf.x;
    }
  }

  function isWolvesInTheWay(direction) {
    return Wolf.wolves.some(wolf => isWolfInTheWay(wolf, direction));
  }

  if (direction === "up") {
    // up arrow and W
    if (sheep.y === 0) return;
    moveBlocks = wallAffect("up");
    if (moveBlocks.every(e => e.y > 0) && !isWolvesInTheWay("up")) {
      moveBlocks.forEach(ele => (ele.y -= CELL_W));
      sheep.y = sheep.y - CELL_W;
    } else {
      audio.stop();
      audio.play();
    }
  }
  if (direction === "right") {
    // right arrow and D
    if (sheep.x === can.width - CELL_W) return;
    if (
      moveBlocks.every(e => e.x < can.width - CELL_W) &&
      !isWolvesInTheWay("right")
    ) {
      moveBlocks.forEach(ele => (ele.x += CELL_W));
      sheep.x = sheep.x + CELL_W;
    } else {
      audio.stop();
      audio.play();
    }
  }
  if (direction === "down") {
    // down arrow and S
    if (sheep.y === can.width - CELL_W) return;
    if (
      moveBlocks.every(e => e.y < can.height - CELL_W) &&
      !isWolvesInTheWay("down")
    ) {
      moveBlocks.forEach(function(ele) {
        ele.y += CELL_W;
      });
      sheep.y = sheep.y + CELL_W;
    } else {
      audio.stop();
      audio.play();
    }
  }
  if (direction === "left") {
    // left arrow and A
    if (sheep.x === 0) return;
    if (moveBlocks.every(e => e.x > 0) && !isWolvesInTheWay("left")) {
      moveBlocks.forEach(function(ele) {
        ele.x -= CELL_W;
      });
      sheep.x = sheep.x - CELL_W;
    } else {
      audio.stop();
      audio.play();
    }
  }
  window.gridData = Array(GRID_NUM)
    .fill()
    .map(() => Array(GRID_NUM).fill(0));
  walls.forEach(w => (window.gridData[w.y / CELL_W][w.x / CELL_W] = 1));
  wolves.forEach(wolf => (wolf.path = null));
}

function loop() {
  context.clearRect(0, 0, can.width, can.height);
  wallsDraw();
  sheep.draw();
  wolves.forEach(wolf => {
    if (!window.pause) {
      wolf.move();
    }
    wolf.draw();
  });
  !window.gameOver && requestAnimationFrame(loop);
}

function main() {
  var devicePixelRatio = window.devicePixelRatio || 1,
    backingStoreRatio =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1,
    ratio = devicePixelRatio / backingStoreRatio;
  var isMobile = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  [can, can2].map(function(canvas) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;
    if (isMobile) {
      canvas.style.width = "100vw";
      canvas.style.height = "100vw";
    } else {
      canvas.style.width = oldWidth + "px";
      canvas.style.height = oldHeight + "px";
    }
    // canvas.getContext('2d').scale(ratio, ratio);
    CELL_W = canvas.width / GRID_NUM;
    window.CELL_W = CELL_W;
  });
  // 滑动操作代码
  // if (isMobile) {
  //   var gamepad = window.nipplejs.create({
  //     zone: document.getElementById("static"),
  //     mode: "static",
  //     position: { left: "50%", top: "80%" },
  //     color: "red"
  //   });
  //   let timer;
  //   gamepad.on("dir", function(ev, data) {
  //     console.log(data.direction.angle);
  //     clearInterval(timer);
  //     timer = setInterval(function() {
  //       sheepMove(data.direction.angle);
  //     }, 200);
  //   });
  //   gamepad.on("end", function() {
  //     clearInterval(timer);
  //   });
  // }

  wallsInit();
  sheep.init();
  drawGrid(
    "rgba(100,100,100,0.3)",
    Math.floor(can.width / GRID_NUM),
    Math.floor(can.height / GRID_NUM)
  );
  document.addEventListener("keydown", sheepMove);
  document
    .querySelector(".keyboard")
    .addEventListener("touchstart", function(e) {
      e.stopPropagation();
      e.preventDefault();
      sheepMove(e.target.id);
    });
  loop();
}
let wolfImg = document.getElementById("wolf-img");
let sheepImg = document.getElementById("sheep-img");
let promiseArr = [sheepImg, wolfImg].map(
  el =>
    new Promise(function(resolve, reject) {
      el.onload = function() {
        console.log("load", el);
        resolve();
      };
    })
);
// Promise.all(promiseArr).then((v) => {
//     main();
// }).catch(err => console.log(err));
main();
