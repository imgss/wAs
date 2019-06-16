// 参考: https://codepen.io/clindsey/pen/yNvYxE
export default class Pathfinder{
  constructor(gridData, targetPosition, foundCallback) {
    this.gridData = gridData;
    this.targetPosition = targetPosition;

    this.foundCallback = foundCallback;
    this.width = this.gridData[0].length;
    this.height = this.gridData.length;
  }

  parseGridData() {
    var cell, data, index, node, row, x, y, _i, _j, _len, _len1, _ref;
    data = [];
    _ref = this.gridData;
    for (y = _i = 0, _len = _ref.length; _i < _len; y = ++_i) {
      row = _ref[y];
      for (x = _j = 0, _len1 = row.length; _j < _len1; x = ++_j) {
        cell = row[x];
        index = y * this.width + x;
        node = {
          open: !cell, // 如果是墙，直接不能访问这个节点
          index: index,
          fromIndex: null, // 当前访问的这个节点的上一个节点是谁
          x: x,
          y: y
        };
        data[index] = node;
      }
    }
    return data;
  };

  beginFill(wolf) {
    let {x, y} = wolf;
    x = x / window.CELL_W;
    y = y / window.CELL_W;
    this.startPosition = [x, y];
    this.reset();
    this.closeNode(x, y);
    this.addNeighbors(x, y);
    while (!this.isFinished) {
      this.nextStep();
    }
  };
  /**
   * @description 找出距startPosition节点step范围内的一个可用节点
   * @return [x,y]
   */
  findSteps(startPosition, step) {
    let [x, y] = startPosition;
    this.startPosition = startPosition;
    this.reset();
    this.closeNode(x, y);
    this.addNeighbors(x, y);
    while (step--) {
      this.nextStep();
    }
  };

  nextStep() {
    var x, y, _ref;
    if (this.open.length === 0) {
      this.isFinished = true;
      return;
    }
    _ref = this.iToC(this.open.shift()), x = _ref[0], y = _ref[1];
    this.closeNode(x, y);
    return this.addNeighbors(x, y);
  };

  addNeighbors(x, y) {
    var index;
    index = this.data[this.cToI(x, y)].index;
    this.addOpen(x + 1, y, index);
    x - 1 >= 0 && this.addOpen(x - 1, y, index);
    this.addOpen(x, y + 1, index);
    y - 1 >= 0 && this.addOpen(x, y - 1, index);
  };
  // 访问到这个节点
  addOpen(x, y, nodeIndex) {
    var index, node, tX, tY, _ref;
    if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) return;
    index = this.cToI(x, y);
    // console.log(x, y)
    node = this.data[index];
    // console.log(node)
    if (node.open) {
      this.open.push(index);
      node.fromIndex = nodeIndex;
      node.open = false;
    }
    _ref = this.targetPosition, tX = _ref[0], tY = _ref[1];
    if (x === tX && y === tY) {
      return this.targetFound();
    }
  };

  closeNode(x, y) {
    var node;
    node = this.data[this.cToI(x, y)];
    try {
      node.open = false;
    } catch (err) {
      console.log(this);
      console.log(x, y);
    }

  };

  targetFound() {
    var _results;
    this.isFinished = true;
    this.solutionPath = [];
    this.solutionPath.push(this.targetPosition);
    _results = [];

    while (this.walkSolution()) {
      _results.push(true);
    }
    return _results;
  };

  pathFound() {
    var path;
    path = this.solutionPath.reverse();
    this.path = path.slice(1);
    this.foundCallback && this.foundCallback(path);
  };

  walkSolution() {
    var lastNode, nextNode, _ref;
    _ref = this.solutionPath[this.solutionPath.length - 1];
    let [x, y] = _ref;
    lastNode = this.data[this.cToI(x, y)];
    try { 
      nextNode = this.data[lastNode.fromIndex];
      this.solutionPath.push([nextNode.x, nextNode.y]);
      if (!nextNode.fromIndex) {
        this.isFinished = true;
        this.pathFound();
        return false;
      }
    } catch(err) {
      throw(err);
    }

    // console.log(nextNode.index);
    return true;
  };

  reset() {
    this.open = [];
    this.data = this.parseGridData();
    this.isFinished = false;
    return ;
  };
  // 列转换成idx
  cToI(x, y) {
    return y * this.width + x;
  };
  // idx转换成坐标
  iToC(index) {
    var x, y;
    x = index % this.width;
    y = Math.floor(index / this.width);
    return [x, y];
  };

}
module.exports =  Pathfinder;