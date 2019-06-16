import Pathfinder from './search';
import msg from './message';
import swal from 'sweetalert';

function sameLocation(a, b) {
  return a.x === b.x && a.y === b.y;
}
function rand(min, max) {
  return min + Math.floor((max-min) * Math.random());
}
let wolfImg = document.getElementById('wolf-img');
let maxWolfs = 4;
class Wolf{
  constructor(x = 0, y = 0, size = window.CELL_W) {
    this.x = x;
    this.y = y;
    this.speed = Wolf.wolves.length ? rand(2, 4) : 2;
    this.size = size;
    this.isCallHelped = false;
    this.stuck = 0;

    this._timeStamp = Date.now();
  }
  //狼的绘制和运动代码
  draw() {
    let context = window.context;
    context.save();
    context.drawImage(wolfImg, this.x, this.y, this.size, this.size);
    // context.fillStyle = "#39A234";
    // context.beginPath();
    // var p0x = this.x + 10;
    // var p0y = this.y + 10;
    // var size = this.size;
    // context.moveTo(p0x + size, p0y);
    // for (var i = 1; i < 6; i++) {
    //     context.lineTo(p0x + size * Math.cos(Math.PI / 3 * i), p0y - size * Math.sin(Math.PI / 3 * i));
    // }
    // context.closePath();
    // context.fill();
    context.restore();
  }

  move() {
      let now = Date.now();
      if (now - this._timeStamp < 1000 / this.speed) return;
      this._timeStamp = now;
      if (sameLocation(this, window.sheep)) {
          swal({
            text: '哈哈哈，你被抓住了',
            button: '再来一次'
          }).then(v => {
            console.log(v);
            if (v) {
              window.location.reload();
            }
          });
          window.gameOver = true;
          return;
      }
      if (!this.path) {
          let sheep = window.sheep;
          let pathFinder = new Pathfinder(window.gridData, [(sheep.x)/window.CELL_W, (sheep.y)/window.CELL_W]);
          pathFinder.beginFill(this);
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
            msg('wolf', msgs[Wolf.wolves.length-1] || '小兄弟有两下子');
          }
          this.stuck++;
          if (this.stuck > 6 && !this.isCallHelped) {
            Wolf.callHelp();
            this.isCallHelped = true;
          }
      }
  }

  static callHelp() {
    if (Wolf.wolves.length > maxWolfs) {
      swal({
        text:'you win！',
        buttons: ['取消', '继续']
      }).then(v => {
        console.log(v);
        if (v) {
          maxWolfs = 100;
          Wolf.callHelp();
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