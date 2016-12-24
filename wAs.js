/**
 * Created by gg on 2016/9/7.
 */
var walls = [],
    sheep = { x: 250, y: 250 },
    wolf = { x: 10, y: 10, draw: wolfDraw, move: wolfMove, direction: { x: 1, y: 1 } };
can = document.getElementById('map'), context = can.getContext('2d'),
    ctx = document.getElementById('bg').getContext('2d');

//function..................................................
function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

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

function newWall(x, y, index) { //创建砖块
    this.x = x;
    this.y = y;
    this.index = index;
}

function wallsInit() {
    var ind = 0;
    for (var i = 80; i < can.width - 80; i += 20) {
        for (var j = 80; j < can.width - 80; j += 20) {
            if (!((i > 200 && i < 280) && (j > 200 && j < 280))) { //留下中间3*3个空格
                walls.push(new newWall(i, j, ind++));
            }
        }
    }
}

function wallsDraw() { //画出墙
    context.save();
    context.fillStyle = '#529';
    walls.forEach(function(element, index, array) {
        context.fillRect(element.x, element.y, 18, 18);
    });
    context.restore();
    return walls;
}

function sheepDraw() { //画出羊
    context.save();
    context.fillStyle = '#823f29';
    context.beginPath();
    context.arc(sheep.x, sheep.y, 10, 0, Math.PI * 2);
    context.fill();
    context.restore();
}
//墙的运动
function wallLineUp() { //选出羊上面的砖块
    var wallLine = [];
    for (var i = 0; i < 280; i++) {
        if (walls[i].x == sheep.x - 10 && walls[i].y < sheep.y) {
            wallLine.push(walls[i]);
        }
    }
    return wallLine;
}

function wallLineDown() { //选出羊下面的砖块
    var wallLine = [];
    for (var i = 0; i < 280; i++) {
        if (walls[i].x == sheep.x - 10 && walls[i].y > sheep.y) {
            wallLine.push(walls[i]);
        }
    }
    return wallLine;
}

function wallLineLeft() { //选出羊左面的砖块
    var wallLine = [];
    for (var i = 0; i < 280; i++) {
        if (walls[i].y == sheep.y - 10 && walls[i].x < sheep.x) {
            wallLine.push(walls[i]);
        }
    }
    return wallLine;
}

function wallLineRight() { //选出羊右面的砖块
    var wallLine = [];
    for (var i = 0; i < 280; i++) {
        if (walls[i].y == sheep.y - 10 && walls[i].x > sheep.x) {
            wallLine.push(walls[i]);
        }
    }
    return wallLine;
}

function wallAffect(dir) {
    var wallToMove = [],
        wl, pointer; //羊运动影响的砖块集合,edge检测边界
    switch (dir) {
        case "up":
            {
                wl = wallLineUp();
                pointer = sheep.y - 10;
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
                wl = wallLineDown();
                //if(can.height-wl[wl.length-1].y < 20) return false;//顶到墙了
                pointer = sheep.y - 10;
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
                wl = wallLineLeft();
                pointer = sheep.x - 10;
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
                wl = wallLineRight();
                pointer = sheep.x - 10;
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
        move;
    if (keyID === 38 || keyID === 87) { // up arrow and W
        move = wallAffect('up');
        if (move.every(function(e) { return e.y > 0; })) {
            move.forEach(function(ele) { ele.y -= 20 });
            sheep.y = sheep.y - 20;
            e.preventDefault();
        }
    }
    if (keyID === 39 || keyID === 68) { // right arrow and D
        move = wallAffect('right');
        if (move.every(function(e) { return e.x < can.width - 20; })) {
            move.forEach(function(ele) { ele.x += 20 });
            sheep.x = sheep.x + 20;
            e.preventDefault();
        }
    }
    if (keyID === 40 || keyID === 83) { // down arrow and S
        move = wallAffect('down');
        if (move.every(function(e) { return e.y < can.height - 20; })) {
            move.forEach(function(ele) {
                ele.y += 20
            });
            sheep.y = sheep.y + 20;
            e.preventDefault();
        }
    }
    if (keyID === 37 || keyID === 65) { // left arrow and A
        move = wallAffect('left');
        if (move.every(function(e) { return e.x > 0; })) {
            move.forEach(function(ele) {
                ele.x -= 20
            });
            sheep.x = sheep.x - 20;
            e.preventDefault();
        }
    }

}
//狼的绘制和运动代码
function wolfDraw() {
    context.save();
    context.fillStyle = "#39A234"
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

function wolfMove() {
    if (sheep.y - wolf.y > 0) {

        wolf.direction.y = 1;
    } else if (sheep.x - wolf.x == 0) {

        wolf.direction.y = -1;
    } else {
        wolf.direction.y = 0;
    }
    if (sheep.x - wolf.x > 0) {

        wolf.direction.x = 1;
    } else if (sheep.x - wolf.x == 0) {

        wolf.direction.x = 0;
    } else {
        wolf.direction.x = -1;
    }
    if (wolf.x >= can.width || wolf.x < 0) {
        wolf.direction.x = -wolf.direction.x;
    }
    if (wolf.y >= can.height || wolf.y < 0) {
        wolf.direction.y = -wolf.direction.y;
    }
    for (let wall of walls) {
        if (wall.x == wolf.x + 20 && wall.x == wolf.x + 20) {
            wolf.direction.x = -wolf.direction.x;
            wolf.direction.y = -wolf.direction.y;
        }
    }

    wolf.x += wolf.direction.x;
    wolf.y += wolf.direction.y;

}
//初始化与循环
function clearCanvas() {
    context.clearRect(0, 0, can.width, can.height);
}

function draw() {
    clearCanvas();
    wolf.draw();
    wolf.move();
    wallsDraw();
    sheepDraw();
}
wallsInit();
setInterval(draw, 1000 / 30);
drawGrid('rgba(100,100,100,0.3)', 20, 20);
can.addEventListener('keydown', sheepMove);
document.addEventListener('keydown', sheepMove);