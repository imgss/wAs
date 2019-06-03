/**
 * Created by gg on 2016/9/7.
 */
let walls = [],
    sheep = { x: 250, y: 250 },
    wolf = { x: 0, y: 0, draw: wolfDraw, direction: { x: 1, y: 1 } };
let can = document.getElementById('map'), context = can.getContext('2d'),
    ctx = document.getElementById('bg').getContext('2d');
const GRID_NUM = 25;
const CELL_W = 20;

let gridData = Array(GRID_NUM).fill().map( () => Array(GRID_NUM).fill(0));
class Steps {
    constructor() {
        this.stack = [];
    }
    addStep(step) {
        this.stack.push(step)
    }
    back() {
        let step = this.stack.pop()
        console.log(step)
    }
}
//function..................................................
function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}
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

function Block(x, y) { //创建砖块
    this.x = x;
    this.y = y;
}
Block.prototype.draw = function() {
    context.save();
    context.fillRect(this.x + 1, this.y + 1, 19, 19);
    context.restore();
}

function wallsInit() {
    for (var i = 80; i < can.width - 80; i += 20) {
        for (var j = 80; j < can.width - 80; j += 20) {
            if (!((i > 200 && i < 280) && (j > 200 && j < 280))) { //留下中间3*3个空格
                walls.push(new Block(i, j));
                gridData[i/20][j/20] = 1;
            }
        }
    }
}
//画出墙
function wallsDraw() { 
    context.fillStyle = 'rgba(255,165,0,0.5)';
    walls.forEach(function(wall) {
        wall.draw();
    });
}
//画出羊
function sheepDraw() { 
    context.save();
    context.fillStyle = '#823f29';
    context.beginPath();
    context.arc(sheep.x, sheep.y, 10, 0, Math.PI * 2);
    context.fill();
    context.restore();
}
//墙的运动
function wallLine(direction) { //选出羊上面的砖块
    var wallLine = [];
    switch (direction) {
        case 'up':
            for (var i = 0; i < 280; i++) {
                if (walls[i].x == sheep.x - 10 && walls[i].y <= sheep.y) {
                    wallLine.push(walls[i]);
                }
            }
            break;
        case 'down':
            for (var i = 0; i < 280; i++) {
                if (walls[i].x == sheep.x - 10 && walls[i].y >= sheep.y) {
                    wallLine.push(walls[i]);
                }
            }
            break;
        case 'left':
            for (var i = 0; i < 280; i++) {
                if (walls[i].y == sheep.y - 10 && walls[i].x <= sheep.x) {
                    wallLine.push(walls[i]);
                }
            }
            break;
        case 'right':
            for (var i = 0; i < 280; i++) {
                if (walls[i].y == sheep.y - 10 && walls[i].x >= sheep.x) {
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
                pointer = sheep.y - 10;
                wl.sort((a, b) => a.y - b.y)
                for (var j = wl.length - 1; j >= 0; j--) {
                    if (pointer - wl[j].y == 20) {
                        wallToMove.push(wl[j]);
                        pointer = wl[j].y;
                    }
                }
            }
            break;
        case "down":
            {
                //if(can.height-wl[wl.length-1].y < 20) return false;//顶到墙了
                pointer = sheep.y - 10;
                wl.sort((a, b) => a.y - b.y)
                for (var j = 0; j < wl.length; j++) {
                    if (wl[j].y - pointer == 20) {
                        wallToMove.push(wl[j]);
                        pointer = wl[j].y;
                    }
                }
            }
            break;
        case "left":
            {
                pointer = sheep.x - 10;
                wl.sort((a, b) => a.x - b.x);
                for (var k = wl.length - 1; k >= 0; k--) {
                    if (pointer - wl[k].x == 20) {
                        wallToMove.push(wl[k]);
                        pointer = wl[k].x;
                    }
                }
            }
            break;
        case "right":
            {
                pointer = sheep.x - 10;
                wl.sort((a, b) => a.x - b.x);
                for (var m = 0; m < wl.length; m++) {
                    if (wl[m].x - pointer == 20) {
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
    var keyID = e.keyCode ? e.keyCode : e.which,
        moveBlocks;
    if (keyID === 38 || keyID === 87) { // up arrow and W
        if (sheep.y === 10) return
        moveBlocks = wallAffect('up');
        if (moveBlocks.every(function(e) { return e.y > 0; })) {
            moveBlocks.forEach(function(ele) { ele.y -= 20 });
            sheep.y = sheep.y - 20;
            e.preventDefault();
        }
    }
    if (keyID === 39 || keyID === 68) { // right arrow and D
        if (sheep.x === 490) return
        moveBlocks = wallAffect('right');
        if (moveBlocks.every(function(e) { return e.x < can.width - 20; })) {
            moveBlocks.forEach(function(ele) { ele.x += 20 });
            sheep.x = sheep.x + 20;
            e.preventDefault();
        }
    }
    if (keyID === 40 || keyID === 83) { // down arrow and S
        if (sheep.y === 490) return
        moveBlocks = wallAffect('down');
        if (moveBlocks.every(function(e) { return e.y < can.height - 20; })) {
            moveBlocks.forEach(function(ele) {
                ele.y += 20
            });
            sheep.y = sheep.y + 20;
            e.preventDefault();
        }
    }
    if (keyID === 37 || keyID === 65) { // left arrow and A
        
        if (sheep.x === 10) return
        moveBlocks = wallAffect('left');
        if (moveBlocks.every(e => e.x > 0)) {
            moveBlocks.forEach(function(ele) {
                ele.x -= 20
            });
            sheep.x = sheep.x - 20;
            e.preventDefault();
        }
    }
    gridData = Array(25).fill().map( () => Array(25).fill(0));
    walls.forEach(w => gridData[w.y / 20][w.x / 20] = 1)
}
//狼的绘制和运动代码
function wolfDraw() {
    context.save();
    context.fillStyle = "#39A234";
    context.beginPath();
    var p0x = wolf.x;
    var p0y = wolf.y;
    var line = 10;
    context.moveTo(p0x + 10, p0y);
    for (var i = 1; i < 6; i++) {
        context.lineTo(p0x + line * Math.cos(Math.PI / 3 * i), p0y - line * Math.sin(Math.PI / 3 * i));
    }
    context.closePath();
    context.fill();
    context.restore();
}

wolf.move = (function() {
    let timeStemp = Date.now();
    return function() {
        let now = Date.now()
        if (now - timeStemp < 1000) return;
        timeStemp = now;

        if (!wolf.path) {
            let pathFinder = new Pathfinder(gridData, [(sheep.x - 10)/20, (sheep.y - 10)/20]);
            pathFinder.beginFill(wolf);
            if (pathFinder.path) {
                wolf.path = pathFinder.path
            }
        }
        if (wolf.path) {
            let point = wolf.path.shift();
            if (point) {
                wolf.x = point[0] * 20;
                wolf.y = point[1] * 20;
            } else {
                wolf.path = null
            }
        }
    }
})();

function draw() {
    context.clearRect(0, 0, can.width, can.height);
    wolf.draw();
    wolf.move();
    wallsDraw();
    sheepDraw();
    requestAnimationFrame(draw);
}
wallsInit();
draw();
drawGrid('rgba(100,100,100,0.3)', can.width / GRID_NUM, can.height / GRID_NUM);
can.addEventListener('keydown', sheepMove);
document.addEventListener('keydown', sheepMove);