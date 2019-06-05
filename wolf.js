class Wolf{
  constructor(x = 0, y = 0, size = 10) {
    this.x = x
    this.y = y
    this.size = size
    this.isCallHelped = false
    this.stuck = 0
  }
  //狼的绘制和运动代码
  draw() {
    context.save();
    context.fillStyle = "#39A234";
    context.beginPath();
    var p0x = this.x + 10;
    var p0y = this.y + 10;
    var size = this.size;
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
        if (!this.path) {
            let pathFinder = new Pathfinder(gridData, [(sheep.x)/20, (sheep.y)/20]);
            pathFinder.beginFill(this);
            if (pathFinder.path) {
                this.path = pathFinder.path;
            }
        }
        if (this.path) {
            this.size = 10;
            this.stuck = 0;
            let point = this.path.shift();
            if (point) {
                this.x = point[0] * 20;
                this.y = point[1] * 20;
            } else {
                this.path = null;
            }
        } else {
            this.size = this.size === 10 ? 12 : 10;
            this.stuck++;
            if (this.stuck > 6 && !this.isCallHelped) {
              Wolf.callHelp();
              this.isCallHelped = true;
            }
        }
    }
  })();

  static callHelp() {
    wolves.push(new Wolf(480, 0))
  }
}