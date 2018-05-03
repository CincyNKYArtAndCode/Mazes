
const adjacentCellOffset = [
  [0, 1],   // east  0 
  [1, 0],   // south 1 
  [0, -1],  // west  2 
  [-1, 0]   // north 3 
]

// A maze is an array of doors wth size Rows X Columns X 2(Doors).
// Each array element is false if the door is closed and true 
// if the door is open.
// Each cell has 2 elements for the east and south doors.  
// The north door of a cell is the south door in the previous row.
// The west door of a cell is the east door in the previous colum.
class Maze {
  // Create the array and initialize all the doors to false(closed)
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.arr = new Array(rows * cols * 2);
    for(var idx = 0; idx < rows * cols * 2; ++idx) {
      this.arr[idx] = false;
    }
  }

  isCoordInBounds(row, col) {
    var rtn = row >= 0 && 
      row < this.rows && 
      col >= 0 && 
      col < this.cols;
    return rtn;
  }

  isDoorOpen(row, col, door) {
    if(door > 1) {
      row = row + adjacentCellOffset[door][0];
      col = col + adjacentCellOffset[door][1];
      door = (door + 2) % 4; // reverse door
    }
    if(this.isCoordInBounds(row, col) == false) {
      return false;
    }

    return this.arr[row * this.cols * 2 + col * 2 + door];
  }

  anyDoorOpen(row, col) {
    for(var door = 0; door < 4; ++door) {
      if(this.isDoorOpen(row, col, door)) {
        return true;
      }
    }
    return false;
  }

  openDoor(row, col, door) {
    if(door > 1) {
      row = row + adjacentCellOffset[door][0];
      col = col + adjacentCellOffset[door][1];
      door = (door + 2) % 4; // reverse door
    }
    if(this.isCoordInBounds(row, col) == true) {
      this.arr[row * this.cols * 2 + col * 2 + door] = true;
    }
  }
}

function chooseRandomDoor(maze, row, col) {
  var validDoors = [];
  var randDoor = -1;
  for (let door = 0; door < 4; door++) {
    var testRow = row + adjacentCellOffset[door][0];
    var testCol = col + adjacentCellOffset[door][1];
    if(maze.isCoordInBounds(testRow, testCol) == true && 
      maze.anyDoorOpen(testRow, testCol) == false) {
        validDoors.push(door);
    }
  }
  if(validDoors.length > 0) {
    var randIdx = Math.floor(Math.random() * validDoors.length);
    randDoor = validDoors[randIdx];
  }
  return randDoor; 
}

function buidMaze(maze) {
  var curRow = 0;
  var curCol = 0;
  var backup = [];

  while(true) {
    // Go forward
    while(true) {
      var door = chooseRandomDoor(maze, curRow, curCol);
      if(door == -1) break;
      maze.openDoor(curRow, curCol, door);
      backup.push(curRow);
      backup.push(curCol);
      curRow = curRow + adjacentCellOffset[door][0];
      curCol = curCol + adjacentCellOffset[door][1];
    }
    // Backup
    if(backup.length == 0) break;
    curCol = backup.pop();
    curRow = backup.pop();
  }
}

function drawMaze(maze, rowHeight, colWidth) {
  var mazeWidth = maze.cols * colWidth;
  var mazeHeight = maze.rows * rowHeight;
  var baseX = (width - mazeWidth)/2;
  var baseY = (height - mazeHeight)/2;
  line(baseX, baseY, baseX + mazeWidth, baseY);
  line(baseX, baseY, baseX, baseY + mazeHeight);
  for(var row = 0; row < maze.rows; ++row) {
    for(var col = 0; col < maze.cols; ++col) {
      // east(0) door
      if(maze.isDoorOpen(row, col, 0) == false) {
        line( baseX + (col + 1) * colWidth,
              baseY + row * rowHeight,
              baseX + (col + 1) * colWidth,
              baseY + (row + 1) * rowHeight);
      }
      // south(1) door
      if(maze.isDoorOpen(row, col, 1) == false) {
        line( baseX + col * colWidth,
              baseY + (row + 1) * rowHeight,
              baseX + (col + 1) * colWidth,
              baseY + (row + 1) * rowHeight);
      }
    }
  }
}

function createMaze(rows, cols) {
  var maze = new Maze(rows, cols);
  buidMaze(maze);
  return maze;
}

var maze;

function setup() {
  createCanvas(800, 800);
  maze = createMaze(20,20);
  stroke(255);
  background(0);
  noLoop();
}

function draw() {
  drawMaze(maze, 20, 20);
}
