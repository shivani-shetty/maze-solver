const container = document.querySelector("#container");
var n = 50;
var w = screen.width;
var h = screen.height * (4 / 5);
var cellWidth = (w - 2 * (n + 1) + 2) / n;
var cellHeight = cellWidth;
var startPoint = -1;
var endPoint = -1;
var timer = 0;
var startSelected = false;
var endSelected = false;
var wallsReady = false;

var choosenDfs = false;
var choosenBfs = false;
var choosenDijkstra = false;
var choosenAstar = true;

//arrays
var isWall = [];
var isVisited = [];
var path = [];

for (var i = 0; i < n * 18; i++) isWall[i] = false;

for (var i = 0; i < n * 18; i++) isVisited[i] = false;

//selectors
const dfsStart = document.querySelector("#dfs");
const bfsStart = document.querySelector("#bfs");
const astarStart = document.querySelector("#astar");
const dijkstraStart = document.querySelector("#dijkstra");
const generate = document.querySelector("#generate");
const reset = document.querySelector("#reset");

const play = document.querySelector("#play");

for (let i = 0; i < n * 18; i++) {
  let newCell = document.createElement("div");
  newCell.classList.add("cell");
  container.appendChild(newCell);
}

var cells = document.querySelectorAll(".cell");

for (let i = 0; i < cells.length; i++) {
  cells[i].style.width = cellWidth + "px";
  cells[i].style.height = cellHeight + "px";
}

//event listeners
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", clicked);
}

for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("mousemove", buildWalls);
}

dfsStart.addEventListener("click", algorithm1);
bfsStart.addEventListener("click", algorithm2);
astarStart.addEventListener("click", algorithm3);
dijkstraStart.addEventListener("click", algorithm4);

play.addEventListener("click", algorithm);

generate.addEventListener("click", generateRandom);

reset.addEventListener("click", resetEverything);

//functions
function algorithm() {
  timer = 0;

  if (!startSelected || !endSelected) {
    alert("Please choose source and destination!");
    return;
  }

  if (choosenDfs) {
    dfs(startPoint, endPoint);
  } else if (choosenBfs) {
    bfs(startPoint, endPoint);
  } else if (choosenDijkstra) {
    dijkstraAlgo(startPoint, endPoint);
  } else {
    astarAlgo(startPoint, endPoint);
  }
}

function clicked(event) {
  var node;
  for (let i = 0; i < cells.length; i++) if (this == cells[i]) node = i;

  if (!startSelected) {
    startPoint = node;

    startSelected = true;
    this.innerHTML =
      '<i class="fas fa-running fa-2x" style="color:rgba(0,0,0,0.75);"></i>';
  } else if (startSelected && !endSelected) {
    endPoint = node;

    endSelected = true;

    this.innerHTML =
      '<i class="fa fa-map-marker fa-lg" aria-hidden="true" style="color:rgba(0,0,0,0.75);"></i>';
  } else {
    if (node == endPoint) {
      this.innerHTML = "";

      endSelected = false;
      return;
    }

    if (node == startPoint) {
      this.innerHTML = "";

      startSelected = false;
      return;
    }

    wallsReady = !wallsReady;
  }

  console.log(node);
}

function buildWalls(event) {
  if (wallsReady) {
    var node;
    for (let i = 0; i < cells.length; i++) if (this == cells[i]) node = i;

    this.classList.add("walls");
    isWall[node] = true;
  }
}

function generateRandom() {
  for (let i = 0; i < n * 18; i++) {
    isWall[i] = false;
    cells[i].classList.remove("walls");
  }

  var thisValueAlreadyCame = [];

  for (let i = 0; i < n * 18; i++) {
    thisValueAlreadyCame[i] = false;
  }

  var count = 0;
  var percentageWalls = n * 5;

  while (count < percentageWalls) {
    var randomCell = Math.floor(Math.random() * (n * 18));
    if (
      thisValueAlreadyCame[randomCell] ||
      randomCell == startPoint ||
      randomCell == endPoint
    )
      continue;
    count++;
    isWall[randomCell] = true;
    cells[randomCell].classList.add("walls");
    thisValueAlreadyCame[randomCell] = true;
  }
}

function algorithm1() {
  choosenDfs = true;
  choosenBfs = false;
  choosenDijkstra = false;
  choosenAstar = false;

  dfsStart.classList.add("choosen");
  bfsStart.classList.remove("choosen");
  astarStart.classList.remove("choosen");
  dijkstraStart.classList.remove("choosen");

  clearAll();
}

function algorithm2() {
  choosenDfs = false;
  choosenBfs = true;
  choosenDijkstra = false;
  choosenAstar = false;

  bfsStart.classList.add("choosen");
  dfsStart.classList.remove("choosen");
  astarStart.classList.remove("choosen");
  dijkstraStart.classList.remove("choosen");

  clearAll();
}

function algorithm3() {
  choosenDfs = false;
  choosenBfs = false;
  choosenDijkstra = false;
  choosenAstar = true;

  astarStart.classList.add("choosen");
  dfsStart.classList.remove("choosen");
  bfsStart.classList.remove("choosen");
  dijkstraStart.classList.remove("choosen");

  clearAll();
}

function algorithm4() {
  choosenDfs = false;
  choosenBfs = false;
  choosenDijkstra = true;
  choosenAstar = false;

  dijkstraStart.classList.add("choosen");
  dfsStart.classList.remove("choosen");
  bfsStart.classList.remove("choosen");
  astarStart.classList.remove("choosen");

  clearAll();
}

function check(neighbor, cellnode) {
  if (neighbor < 0 || neighbor >= n * 18) return false;

  if (isWall[neighbor] == true || isVisited[neighbor] == true) return false;

  var neighborRow = Math.floor(neighbor / n);
  var cellnodeRow = Math.floor(cellnode / n);

  if (cellnode == neighbor + 1 || cellnode == neighbor - 1) {
    if (neighborRow != cellnodeRow) return false;
  }

  return true;
}

var isEnded = false;

function dfs(st, nd) {
  if (st == nd) {
    isEnded = true;
    path.push(st);
    console.log(path);
    drawPath();
    return;
  }

  if (isEnded == false) {
    isVisited[st] = true;
    path.push(st);

    setTimeout(() => {
      cells[st].style.backgroundColor = "#588da8";
    }, timer * 10);

    timer++;

    var neighbors = [st + 1, st + n, st - 1, st - n];

    for (let i = 0; i < 4; i++) {
      if (check(neighbors[i], st)) dfs(neighbors[i], nd);

      if (isEnded) return;
    }

    path.pop();
  }
}

function bfs(st, nd) {
  var whoAdded = [];
  var queue = [];
  queue.push(st);

  whoAdded[st] = -1;

  isVisited[st] = true;

  while (queue.length != 0) {
    let present = queue.shift();

    setTimeout(() => {
      cells[present].style.backgroundColor = "#588da8";
    }, timer * 10);

    timer++;

    if (present == nd) {
      while (present != -1) {
        path.unshift(present);
        present = whoAdded[present];
      }

      drawPath();
      return;
    }

    var neighbors = [present + 1, present + n, present - 1, present - n];

    for (let i = 0; i < 4; i++) {
      if (check(neighbors[i], present) && isVisited[neighbors[i]] == false) {
        isVisited[neighbors[i]] = true;
        queue.push(neighbors[i]);
        whoAdded[neighbors[i]] = present;
      }
    }
  }
}

function dijkstraAlgo(st, nd) {
  distance = [];
  parent = [];

  for (let i = 0; i < n * 18; i++) {
    distance[i] = 100000;
  }

  distance[st] = 0;
  parent[st] = -1;

  let NotFound = false;

  while (NotFound == false) {
    let leastDistance = 100000;
    let presentNode;

    NotFound = true;

    for (let i = 0; i < n * 18; i++) {
      if (isVisited[i] == false && distance[i] < leastDistance) {
        leastDistance = distance[i];
        presentNode = i;
        NotFound = false;
      }
    }

    isVisited[presentNode] = true;

    setTimeout(() => {
      cells[presentNode].style.backgroundColor = "#588da8";
    }, timer * 10);

    timer++;

    if (presentNode == nd) {
      while (presentNode != -1) {
        path.unshift(presentNode);
        presentNode = parent[presentNode];
      }

      drawPath();
      return;
    }

    var neighbors = [
      presentNode + 1,
      presentNode + n,
      presentNode - 1,
      presentNode - n,
    ];

    for (let i = 0; i < 4; i++) {
      if (
        isVisited[neighbors[i]] == false &&
        check(neighbors[i], presentNode) == true &&
        distance[presentNode] + 1 < distance[neighbors[i]]
      ) {
        distance[neighbors[i]] = distance[presentNode] + 1;
        parent[neighbors[i]] = presentNode;
      }
    }
  }
}

function astarAlgo(st, nd) {
  var endRow = Math.floor(nd / n);
  var endColumn = nd % n;

  hValue = [];

  for (let i = 0; i < n * 18; i++) {
    var row = Math.floor(i / n);
    var column = i % n;

    var rowDiff = endRow - row;
    var columnDiff = endColumn - column;

    if (rowDiff < 0) rowDiff = -rowDiff;

    if (columnDiff < 0) columnDiff = -columnDiff;

    hValue[i] = rowDiff + columnDiff;
  }

  distance = [];
  parent = [];

  for (let i = 0; i < n * 18; i++) distance[i] = 100000;

  distance[st] = 0;
  parent[st] = -1;

  var NotFound = false;

  while (NotFound == false) {
    let least = 10000000;
    let presentNode;

    NotFound = true;
    for (let i = 0; i < n * 18; i++) {
      var effective = distance[i] + hValue[i];

      if (effective < least && isVisited[i] == false) {
        least = effective;
        presentNode = i;
        NotFound = false;
      }
    }

    isVisited[presentNode] = true;

    setTimeout(() => {
      cells[presentNode].style.backgroundColor = "#588da8";
    }, timer * 10);

    timer++;

    if (presentNode == nd) {
      while (presentNode != -1) {
        path.unshift(presentNode);
        presentNode = parent[presentNode];
      }

      drawPath();
      return;
    }

    var neighbors = [
      presentNode + 1,
      presentNode + n,
      presentNode - 1,
      presentNode - n,
    ];

    for (let i = 0; i < 4; i++) {
      if (
        isVisited[neighbors[i]] == false &&
        check(neighbors[i], presentNode) == true &&
        distance[presentNode] + 1 < distance[neighbors[i]]
      ) {
        distance[neighbors[i]] = distance[presentNode] + 1;
        parent[neighbors[i]] = presentNode;
      }
    }
  }
}

function drawPath() {
  for (let i = 0; i < path.length; i++) {
    setTimeout(() => {
      cells[path[i]].style.backgroundColor = "#ffc045";
    }, timer * 10);
    timer++;
  }
}

function clearAll() {
  for (let i = 0; i < n * 18; i++) {
    if (isVisited[i]) {
      cells[i].style.backgroundColor = "#e4e4e4";
      isVisited[i] = false;
    }
  }

  path = [];
}

function resetEverything() {
  location.reload();
}
