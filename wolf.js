import Pathfinder from './search';

function sameLocation(a, b) {
  return a.x === b.x && a.y === b.y;
}
function rand(min, max) {
  return min + Math.floor((max-min) * Math.random());
}
class Wolf{
  constructor(x = 0, y = 0, size = 10) {
    this.x = x;
    this.y = y;
    this.speed = rand(2, 5);
    this.size = size;
    this.isCallHelped = false;
    this.stuck = 0;

    this._timeStamp = Date.now();
  }
  //狼的绘制和运动代码
  draw() {
    let context = window.context;
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

  move() {
      let now = Date.now();
      if (now - this._timeStamp < 1000 / this.speed) return;
      this._timeStamp = now;
      if (sameLocation(this, window.sheep)) {
          alert('你被抓住了');
          window.gameOver = true;
          return;
      }
      if (!this.path) {
          let sheep = window.sheep;
          let pathFinder = new Pathfinder(window.gridData, [(sheep.x)/20, (sheep.y)/20]);
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

  static callHelp() {
    if (Wolf.wolves.length > 3) {
      return;
    }
    // TODO: 利用pathFinder，优化狼出现的位置
    let pf = new Pathfinder(window.gridData, [0,0]);
    let {x, y} = window.sheep;
    pf.findSteps([x / 20, y / 20], 8);
    let targetPoint = pf.data[pf.open.pop()];
    Wolf.wolves.push(new Wolf(targetPoint.x * 20 || 480, targetPoint.y * 20 || 0));
  }

}
Wolf.wolves = [];
export default Wolf;