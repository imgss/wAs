// 参考: https://codepen.io/clindsey/pen/yNvYxE
var Pathfinder;
Pathfinder = (function() {
  function Pathfinder(gridData, targetPosition, foundCallback) {
    this.gridData = gridData;
    this.targetPosition = targetPosition;

    this.foundCallback = foundCallback;
    this.width = this.gridData[0].length;
    this.height = this.gridData.length;
  }

  Pathfinder.prototype.parseGridData = function() {
    var cell, data, index, node, row, x, y, _i, _j, _len, _len1, _ref;
    data = [];
    _ref = this.gridData;
    for (y = _i = 0, _len = _ref.length; _i < _len; y = ++_i) {
      row = _ref[y];
      for (x = _j = 0, _len1 = row.length; _j < _len1; x = ++_j) {
        cell = row[x];
        index = y * this.width + x;
        node = {
          open: !cell, // 是不是墙
          visited: false,
          index: index,
          x: x,
          y: y
        };
        data[index] = node;
      }
    }
    return data;
  };

  Pathfinder.prototype.beginFill = function(wolf) {
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
  Pathfinder.prototype.findSteps = function(startPosition, step) {
    let [x, y] = startPosition;
    this.startPosition = startPosition;
    this.reset();
    this.closeNode(x, y);
    this.addNeighbors(x, y);
    while (step--) {
      this.nextStep();
    }
  };

  Pathfinder.prototype.nextStep = function() {
    var x, y, _ref;
    if (this.open.length === 0) {
      this.isFinished = true;
      return;
    }
    _ref = this.iToC(this.open.shift()), x = _ref[0], y = _ref[1];
    this.closeNode(x, y);
    return this.addNeighbors(x, y);
  };

  Pathfinder.prototype.addNeighbors = function(x, y) {
    var index;
    index = this.data[this.cToI(x, y)].index;
    this.addOpen(x + 1, y, index);
    x - 1 >= 0 && this.addOpen(x - 1, y, index);
    this.addOpen(x, y + 1, index);
    y - 1 >= 0 && this.addOpen(x, y - 1, index);
  };
  // 访问到这个节点
  Pathfinder.prototype.addOpen = function(x, y, nodeIndex) {
    var index, node, tX, tY, _ref;
    if(x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) return;
    index = this.cToI(x, y);
    // console.log(x, y)
    node = this.data[index];
    // console.log(node)
    if (node.open) {
      this.open.push(index);
      node.fromIndex = nodeIndex;
      node.open = false;
      node.visited = true;
    }
    _ref = this.targetPosition, tX = _ref[0], tY = _ref[1];
    if (x === tX && y === tY) {
      return this.targetFound();
    }
  };

  Pathfinder.prototype.closeNode = function(x, y) {
    var node;
    node = this.data[this.cToI(x, y)];
    try {
      node.open = false;
    } catch (err) {
      console.log(this);
      console.log(x, y);
    }

  };

  Pathfinder.prototype.targetFound = function() {
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

  Pathfinder.prototype.pathFound = function() {
    var path;
    path = this.solutionPath.reverse();
    this.path = path.slice(1);
    this.foundCallback && this.foundCallback(path);
  };

  Pathfinder.prototype.walkSolution = function() {
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

  Pathfinder.prototype.findLowestNeighbor = function(x, y) {
    var candidateNode, node;
    candidateNode = this.data[this.cToI(x, y)];
    node = this.data[this.cToI(x + 1, y)];
    if (node && node.visited && node.index < candidateNode.index) {
      candidateNode = node;
    }
    node = this.data[this.cToI(x - 1, y)];
    if (node && node.visited && node.index < candidateNode.index) {
      candidateNode = node;
    }
    node = this.data[this.cToI(x, y + 1)];
    if (node && node.visited && node.index < candidateNode.index) {
      candidateNode = node;
    }
    node = this.data[this.cToI(x, y - 1)];
    if (node && node.visited && node.index < candidateNode.index) {
      candidateNode = node;
    }
    return candidateNode;
  };

  Pathfinder.prototype.reset = function() {
    this.open = [];
    this.data = this.parseGridData();
    this.isFinished = false;
    return ;
  };
  // 列转换成idx
  Pathfinder.prototype.cToI = function(x, y) {
    return y * this.width + x;
  };
  // idx转换成坐标
  Pathfinder.prototype.iToC = function(index) {
    var x, y;
    x = index % this.width;
    y = Math.floor(index / this.width);
    return [x, y];
  };

  return Pathfinder;

})();
module.exports =  Pathfinder;