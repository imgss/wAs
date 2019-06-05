class Wolf{
  constructor(x = 0, y = 0, size = 10) {
    this.x = x
    this.y = y
    this.size = size
  }
  //狼的绘制和运动代码
  draw() {
    context.save();
    context.fillStyle = "#39A234";
    context.beginPath();
    var p0x = wolf.x + 10;
    var p0y = wolf.y + 10;
    var size = wolf.size;
    context.moveTo(p0x + size, p0y);
    for (var i = 1; i < 6; i++) {
        context.lineTo(p0x + size * Math.cos(Math.PI / 3 * i), p0y - size * Math.sin(Math.PI / 3 * i));
    }
    context.closePath();
    context.fill();
    context.restore();
  }

  move = (function() {
    let timeStemp = Date.now();

    return function() {
        let now = Date.now()
        if (now - timeStemp < 500) return;
        timeStemp = now;
        if (sameLocation(wolf, sheep)) {
            alert('你被抓住了');
            gameOver = true;
            return;
        }
        if (!wolf.path) {
            let pathFinder = new Pathfinder(gridData, [(sheep.x)/20, (sheep.y)/20]);
            pathFinder.beginFill(wolf);
            if (pathFinder.path) {
                wolf.path = pathFinder.path;
            }
        }
        if (wolf.path) {
            wolf.size = 10;
            let point = wolf.path.shift();
            if (point) {
                wolf.x = point[0] * 20;
                wolf.y = point[1] * 20;
            } else {
                wolf.path = null;
            }
        } else {
            wolf.size = wolf.size === 10 ? 12 : 10;
        }
    }
  })();
}