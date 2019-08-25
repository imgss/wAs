import Pathfinder from './search';
import msg from './message';
import swal from './modal';
import {failAlert} from './alert';
function sameLocation(a, b) {
  return a.x === b.x && a.y === b.y;
}
function rand(min, max) {
  return min + Math.floor((max-min) * Math.random());
}

let maxWolfs = 4;
class Wolf{
  constructor(x = 0, y = 0, size = window.CELL_W) {
    this.x = x;
    this.y = y;
    this.speed = Wolf.wolves.length ? rand(2, 4) : 2;
    this.size = size;
    this.isCallHelped = false;
    // 这里狼被困住的状态有问题
    this.stuck = 0;

    this._timeStamp = Date.now();
  }
  //狼的绘制和运动代码
  draw() {
    let context = window.context;
    context.save();
    context.drawImage(wolfImg, this.x, this.y, this.size, this.size);
    context.restore();
  }

  move() {
      let now = Date.now();
      if (now - this._timeStamp < 1000 / this.speed) return;
      this._timeStamp = now;
      if (sameLocation(this, window.sheep)) {
          failAlert();
          return;
      }
      if (!this.path) {
          let sheep = window.sheep;
          let pathFinder = new Pathfinder(window.gridData, [(sheep.x)/window.CELL_W, (sheep.y)/window.CELL_W]);
          pathFinder.beginFill(this);
          // 找到路径
          if (pathFinder.path) {
              this.path = pathFinder.path;
          }
      }
      if (this.path) {
          this.size = window.CELL_W;
          this.stuck = 0;
          let point = this.path.shift();
          if (point) {
              this.x = point[0] * window.CELL_W;
              this.y = point[1] * window.CELL_W;
          } else {
              this.path = null;
          }
      } else {
          this.size = this.size === window.CELL_W ? window.CELL_W * 1.2 : window.CELL_W;
          if (this.stuck === 1) {
            let msgs = [
              '你等着，我叫人去',
              '我大哥来了你就死定了',
              '我们老大马上就到',
              '额，是个狠人',
              '大大大大，大哥别杀我~'
            ];
            msg('wolf', msgs[Wolf.wolves.length-1] || '你还真有两下子');
          }
          this.stuck++;
          if (this.stuck > 6 && !this.isCallHelped) {
            Wolf.callHelp();
            this.isCallHelped = true;
          }
      }
  }

  static callHelp() {
    if (Wolf.wolves.length > maxWolfs && Wolf.wolves.every(w => w.stuck)) {
      window.pause = true;
      swal({
        text:'you win！',
        buttons: ['取消', '继续']
      }).then(v => {
        console.log(v);
        if (v) {
          maxWolfs = 100;
          setTimeout(() => {
            window.pause = false;
            Wolf.callHelp();
          }, 1000);
        }
      });
      return;
    }
    // TODO: 利用pathFinder，优化狼出现的位置
    let pf = new Pathfinder(window.gridData, [0,0]);
    let {x, y} = window.sheep;
    let wolf;
    pf.findSteps([x / window.CELL_W, y / window.CELL_W], 8);
    let targetPoint = pf.data[pf.open.pop()];
    if (!targetPoint) {
      pf.findSteps([x / window.CELL_W, y / window.CELL_W], 2);
      targetPoint = pf.data[pf.open.pop()];
    }
    wolf = new Wolf(targetPoint.x * window.CELL_W, targetPoint.y * window.CELL_W);
    Wolf.wolves.push(wolf);
  }
}
Wolf.wolves = [];
export default Wolf;