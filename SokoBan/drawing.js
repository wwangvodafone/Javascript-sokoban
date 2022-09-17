// Const
const X_SIZE = 12;
const Y_SIZE = 12;
// Level
const LEVEL1 = 1;
const LEVEL2 = 2;
const LEVEL3 = 3;
const LEVEL4 = 4;
const LEVEL5 = 5;
const LEVEL6 = 6;
const LEVEL7 = 7;
const LEVEL8 = 8;
const LEVEL9 = 9;
const LEVEL10 = 10;
// Image
const WALL = 1;
const SOKO = 2;
const PERSON = 3;
const BOX = 4;
const POSITION = 5;
const BOX_OVER = 6;

// Persion position
Person_X = 0;
Person_Y = 0;

var iPositionNum = 0;
var currentLevel = 1;

var SokoBanMap = new Array(X_SIZE);
var SokoBanCategoryMap = new Array(X_SIZE);
for (var i = 0; i < SokoBanMap.length; i++) {
	SokoBanMap[i] = new Array(Y_SIZE);
	SokoBanCategoryMap[i] = new Array(Y_SIZE);
}

UNITX = 0;
UNITY = 0;

STARTX = 20;
STARTY = 50;

context = null;

var iUndoCount = 0;
var iRedoCount = 0;
var undoList = [];
var redoList = [];

var iSokoBanStep = 0;

// Draw sokoban
function onDraw(ctx) {
	context = ctx;
	UNITX = ctx.canvas.width / X_SIZE;
	UNITY = ctx.canvas.width / Y_SIZE;
	preCreateSokoBan(currentLevel);

	ctx.beginPath();
	drawSokoban();
	ctx.closePath()
}

// Level up
function levelUp(level) {
	iSokoBanStep = 0;
	iUndoCount = 0;
	iRedoCount = 0;
	undoList.length = 0;
	redoList.length = 0;

	for (var i = 0; i < SokoBanMap.length; i++) {
		SokoBanMap[i] = new Array(Y_SIZE);
		SokoBanCategoryMap[i] = new Array(Y_SIZE);
	}
	context.clearRect(0, 0, context.width, context.height);
	context.beginPath();
	context.fillStyle = "black"
	context.font = "30px Arial";
	var name = "Level " + currentLevel;
	context.fillText(name, 200, 50);
	iPositionNum = 0;
	currentLevel = level;
	UNITX = context.canvas.width / X_SIZE;
	UNITY = context.canvas.width / Y_SIZE;
	preCreateSokoBan(level);
	drawSokoban();
	context.closePath();
}

// draw sokoban
function drawSokoban() {
	context.fillStyle = "white"
	context.font = "30px Arial";
	var name = "Level " + currentLevel;
	context.fillText(name, 200, 50);
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			var image = getBlockMap(SokoBanMap[i][j]);
			if (image != null) {
				context.drawImage(image, STARTX + i * UNITX, STARTY + j * UNITY);
			}
		}
	}

	var pSteps = document.getElementById("steps");
	pSteps.innerHTML = "Move: " + iSokoBanStep;
}


// move to left
async function move_left() { 
	var bMoveFlg = false;
	if (Person_X - 1 >= 0) {
		leftPos = Person_X - 1;
		if (SokoBanMap[leftPos][Person_Y] == POSITION) {
			return;
		}
		if (SokoBanMap[leftPos][Person_Y] == BOX_OVER) {
			SokoBanMap[leftPos][Person_Y] = PERSON;
			bMoveFlg = true;
		}
		else if (SokoBanMap[leftPos - 1][Person_Y] == SOKO) {
			if (SokoBanMap[leftPos][Person_Y] == BOX) {
				insertUndoMap();
				SokoBanMap[leftPos - 1][Person_Y] = BOX;
			}
			bMoveFlg = true;
		}
		else if (SokoBanMap[leftPos - 1][Person_Y] == POSITION) {
			if (SokoBanMap[leftPos][Person_Y] == BOX) {
				insertUndoMap();
				SokoBanMap[leftPos - 1][Person_Y] = BOX_OVER;
			}
			bMoveFlg = true;
		}
		else if (SokoBanMap[leftPos][Person_Y] == SOKO) {
			bMoveFlg = true;
		}
	}
	if (bMoveFlg) {
		iSokoBanStep++;
		redoList.length = 0;
		iRedoCount = 0;
		context.clearRect(0, 0, context.width, context.height);
		context.beginPath();
		SokoBanMap[leftPos][Person_Y] = PERSON;
		SokoBanMap[Person_X][Person_Y] = SOKO;
		Person_X = leftPos;
		drawSokoban();
		context.closePath();
	}
	if (getPositionNum() == 0) {
		levelUp(currentLevel + 1);
	}
}

// move to right
function move_right() {
	var bMoveFlg = false;
	if (Person_X + 1 < X_SIZE) {
		rightPos = Person_X + 1;
		if (SokoBanMap[rightPos][Person_Y] == POSITION) {
			return;
		}
		if (SokoBanMap[rightPos][Person_Y] == BOX_OVER) {
			SokoBanMap[rightPos][Person_Y] = PERSON;
			bMoveFlg = true;
		}
		else if (SokoBanMap[rightPos + 1][Person_Y] == SOKO) {
			if (SokoBanMap[rightPos][Person_Y] == BOX) {
				insertUndoMap();
				SokoBanMap[rightPos + 1][Person_Y] = BOX;
			}
			bMoveFlg = true;
			
		}
		else if (SokoBanMap[rightPos + 1][Person_Y] == POSITION) {
			if (SokoBanMap[rightPos][Person_Y] == BOX) {
				insertUndoMap();
				SokoBanMap[rightPos + 1][Person_Y] = BOX_OVER;
			}
			bMoveFlg = true;
		}
		else if (SokoBanMap[rightPos][Person_Y] == SOKO) {
			bMoveFlg = true;
		}
	}
	if (bMoveFlg) {
		iSokoBanStep++;
		redoList.length = 0;
		iRedoCount = 0;
		context.clearRect(0, 0, context.width, context.height);
		context.beginPath();
		SokoBanMap[rightPos][Person_Y] = PERSON;
		SokoBanMap[Person_X][Person_Y] = SOKO;
		Person_X = rightPos;
		drawSokoban();
		context.closePath();
	}
	if (getPositionNum() == 0) {
		levelUp(currentLevel + 1);
	}
}

// move to up
function move_up() {
	var bMoveFlg = false;
	if (Person_Y - 1 >= 0) {
		upPos = Person_Y - 1;
		if (SokoBanMap[Person_X][upPos] == POSITION) {
			return;
		}
		if (SokoBanMap[Person_X][upPos] == BOX_OVER) {
			SokoBanMap[Person_X][upPos] = PERSON;
			bMoveFlg = true;
		}
		else if (SokoBanMap[Person_X][upPos - 1] == SOKO) {
			if (SokoBanMap[Person_X][upPos] == BOX) {
				insertUndoMap();
				SokoBanMap[Person_X][upPos - 1] = BOX;
			}
			bMoveFlg = true;
		}
		else if (SokoBanMap[Person_X][upPos - 1] == POSITION) {
			if (SokoBanMap[Person_X][upPos] == BOX) {
				insertUndoMap();
				SokoBanMap[Person_X][upPos - 1] = BOX_OVER;				
			}
			bMoveFlg = true;
		}
		else if (SokoBanMap[Person_X][upPos] == SOKO) {
			bMoveFlg = true;
		}
	}
	if (bMoveFlg) {
		iSokoBanStep++;
		redoList.length = 0;
		iRedoCount = 0;
		context.clearRect(0, 0, context.width, context.height);
		context.beginPath();
		SokoBanMap[Person_X][upPos] = PERSON;
		SokoBanMap[Person_X][Person_Y] = SOKO;
		Person_Y = upPos;
		drawSokoban();
		context.closePath();
	}	
	if (getPositionNum() == 0) {
		levelUp(currentLevel + 1);
	}

}


// move down
function move_down() {
	var bMoveFlg = false;
	if (Person_Y + 1 < Y_SIZE) {
		downPos = Person_Y + 1;
		if (SokoBanMap[Person_X][downPos] == POSITION) {
			return;
		}
		if (SokoBanMap[Person_X][downPos] == BOX_OVER) {
			SokoBanMap[Person_X][downPos] = PERSON;
			bMoveFlg = true;
		}		
		else if (SokoBanMap[Person_X][downPos + 1] == SOKO) {
			if (SokoBanMap[Person_X][downPos] == BOX) {
				insertUndoMap();
				SokoBanMap[Person_X][downPos + 1] = BOX;
			}
			bMoveFlg = true;
		}
		else if (SokoBanMap[Person_X][downPos + 1] == POSITION) {
			if (SokoBanMap[Person_X][downPos] == BOX) {
				insertUndoMap();
				SokoBanMap[Person_X][downPos + 1] = BOX_OVER;
			}
			bMoveFlg = true;
		}
		else if (SokoBanMap[Person_X][downPos] == SOKO) {
			bMoveFlg = true;
		}
	}
	if (bMoveFlg) {
		iSokoBanStep++;
		redoList.length = 0;
		iRedoCount = 0;
		context.clearRect(0, 0, context.width, context.height);
		context.beginPath();
		SokoBanMap[Person_X][downPos] = PERSON;
		SokoBanMap[Person_X][Person_Y] = SOKO;
		Person_Y = downPos;
		drawSokoban();
		context.closePath();
	}
	if (getPositionNum() == 0) {
		levelUp(currentLevel + 1);
	}
}

// Undo
function undoSokoBan() {
	console.log(undoList.length);
	insertRedoMap();
	if (undoList.length == 0) {
		return;
	}
	var undoMap = undoList.pop();
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			SokoBanMap[i][j] = undoMap[i][j];
			if (SokoBanMap[i][j] == PERSON) {
				Person_X = i;
				Person_Y = j;
			}
		}
	}
	drawSokoban();
	iUndoCount--;
}

// Redo
function redoSokoBan() {
	console.log("redo");
	insertUndoMap();
	if (redoList.length == 0) {
		return;
	}
	var redoMap = redoList.pop();
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			SokoBanMap[i][j] = redoMap[i][j];
			if (SokoBanMap[i][j] == PERSON) {
				Person_X = i;
				Person_Y = j;
			}
		}
	}
	drawSokoban();
	iRedoCount--;
}

// window key
window.onkeydown = function(e) {
  let key = e.key || e.keyCode;
  switch(key) {
    case "ArrowLeft":
    case 37: // left arrow keyCode
      move_left();
      break;
    case "ArrowUp":
    case 38: // up arrow keyCode
      move_up();
      break;
    case "ArrowRight":
    case 39: // right arrow keyCode
      move_right();
      break;
    case "ArrowDown":
    case 40: // down arrow keyCode
      move_down();
      break;
     case "r":
     case 82:
      redoSokoBan();
      break;
     case "u":
     case 85:
      undoSokoBan();
      break;
  }
}

// create sokoban
function preCreateSokoBan(iLevel) {
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			SokoBanMap[i][j] = 0;
		}
	}
	switch (iLevel) {
		case LEVEL1:
			SokoBanMap[4][2] = WALL;
			SokoBanMap[5][2] = WALL;
			SokoBanMap[6][2] = WALL;
			SokoBanMap[4][3] = WALL;
			SokoBanMap[5][3] = SOKO;
			SokoBanMap[5][3] = POSITION;
			iPositionNum++;
			SokoBanMap[6][3] = WALL;
			SokoBanMap[4][4] = WALL;
			SokoBanMap[5][4] = SOKO;
			SokoBanMap[6][4] = WALL;
			SokoBanMap[7][4] = WALL;
			SokoBanMap[8][4] = WALL;
			SokoBanMap[9][4] = WALL;			
			SokoBanMap[2][5] = WALL;
			SokoBanMap[3][5] = WALL;
			SokoBanMap[4][5] = WALL;
			SokoBanMap[5][5] = BOX;
			SokoBanMap[6][5] = SOKO;
			SokoBanMap[7][5] = BOX;
			SokoBanMap[8][5] = SOKO;
			SokoBanMap[8][5] = POSITION;
			iPositionNum++;
			SokoBanMap[9][5] = WALL;
			SokoBanMap[2][6] = WALL;
			SokoBanMap[3][6] = SOKO;
			SokoBanMap[3][6] = POSITION;
			iPositionNum++;
			SokoBanMap[4][6] = SOKO;
			SokoBanMap[5][6] = BOX;
			SokoBanMap[6][6] = PERSON;
			SokoBanMap[7][6] = WALL;
			SokoBanMap[8][6] = WALL;
			SokoBanMap[9][6] = WALL;
			SokoBanMap[2][7] = WALL;
			SokoBanMap[3][7] = WALL;
			SokoBanMap[4][7] = WALL;
			SokoBanMap[5][7] = WALL;
			SokoBanMap[6][7] = BOX;
			SokoBanMap[7][7] = WALL;
			SokoBanMap[5][8] = WALL;
			SokoBanMap[6][8] = SOKO;
			SokoBanMap[6][8] = POSITION;
			iPositionNum++;
			SokoBanMap[7][8] = WALL;
			SokoBanMap[5][9] = WALL;	
			SokoBanMap[6][9] = WALL;
			SokoBanMap[7][9] = WALL;
			
			Person_X = 6;
			Person_Y = 6;
			break;
		case LEVEL2:
			SokoBanMap[1][2] = WALL;
			SokoBanMap[2][2] = WALL;
			SokoBanMap[3][2] = WALL;
			SokoBanMap[4][2] = WALL;
			SokoBanMap[5][2] = WALL;
			SokoBanMap[1][3] = WALL;
			SokoBanMap[2][3] = PERSON;
			SokoBanMap[3][3] = SOKO;
			SokoBanMap[4][3] = SOKO;
			SokoBanMap[5][3] = WALL;
			SokoBanMap[1][4] = WALL;		
			SokoBanMap[2][4] = SOKO;	
			SokoBanMap[3][4] = BOX;		
			SokoBanMap[4][4] = BOX;		
			SokoBanMap[5][4] = WALL;	
			SokoBanMap[7][4] = WALL;		
			SokoBanMap[8][4] = WALL;		
			SokoBanMap[9][4] = WALL;	
			SokoBanMap[1][5] = WALL;	
			SokoBanMap[2][5] = SOKO;
			SokoBanMap[3][5] = BOX;
			SokoBanMap[4][5] = SOKO;
			SokoBanMap[5][5] = WALL;
			SokoBanMap[7][5] = WALL;
			SokoBanMap[8][5] = POSITION;
			iPositionNum++;
			SokoBanMap[9][5] = WALL;
			SokoBanMap[1][6] = WALL;	
			SokoBanMap[2][6] = WALL;	
			SokoBanMap[3][6] = WALL;	
			SokoBanMap[4][6] = SOKO;	
			SokoBanMap[5][6] = WALL;	
			SokoBanMap[6][6] = WALL;	
			SokoBanMap[7][6] = WALL;	
			SokoBanMap[8][6] = POSITION;
			iPositionNum++;
			SokoBanMap[9][6] = WALL;	
			SokoBanMap[2][7] = WALL;
			SokoBanMap[3][7] = WALL;
			SokoBanMap[4][7] = SOKO;
			SokoBanMap[5][7] = SOKO;	
			SokoBanMap[6][7] = SOKO;	
			SokoBanMap[7][7] = SOKO;	
			SokoBanMap[8][7] = POSITION;
			iPositionNum++;
			SokoBanMap[9][7] = WALL;
			SokoBanMap[2][8] = WALL;	
			SokoBanMap[3][8] = SOKO;	
			SokoBanMap[4][8] = SOKO;	
			SokoBanMap[5][8] = SOKO;	
			SokoBanMap[6][8] = WALL;
			SokoBanMap[7][8] = SOKO;	
			SokoBanMap[8][8] = SOKO;	
			SokoBanMap[9][8] = WALL;
			SokoBanMap[2][9] = WALL;	
			SokoBanMap[3][9] = SOKO;	
			SokoBanMap[4][9] = SOKO;	
			SokoBanMap[5][9] = SOKO;	
			SokoBanMap[6][9] = WALL;			
			SokoBanMap[7][9] = WALL;	
			SokoBanMap[8][9] = WALL;	
			SokoBanMap[9][9] = WALL;	
			SokoBanMap[2][10] = WALL;	
			SokoBanMap[3][10] = WALL;	
			SokoBanMap[4][10] = WALL;	
			SokoBanMap[5][10] = WALL;	
			SokoBanMap[6][10] = WALL;	
			Person_X = 2;
			Person_Y = 3;
			break;
		case LEVEL3:
			SokoBanMap[2][3] = WALL;
			SokoBanMap[3][3] = WALL;
			SokoBanMap[4][3] = WALL;
			SokoBanMap[5][3] = WALL;
			SokoBanMap[6][3] = WALL;
			SokoBanMap[7][3] = WALL;
			SokoBanMap[8][3] = WALL;
			SokoBanMap[2][4] = WALL;
			SokoBanMap[3][4] = SOKO;
			SokoBanMap[4][4] = SOKO;
			SokoBanMap[5][4] = SOKO;
			SokoBanMap[6][4] = SOKO;
			SokoBanMap[7][4] = SOKO;
			SokoBanMap[8][4] = WALL;
			SokoBanMap[9][4] = WALL;
			SokoBanMap[10][4] = WALL;
			SokoBanMap[1][5] = WALL;
			SokoBanMap[2][5] = WALL;
			SokoBanMap[3][5] = BOX;
			SokoBanMap[4][5] = WALL;
			SokoBanMap[5][5] = WALL;
			SokoBanMap[6][5] = WALL;
			SokoBanMap[7][5] = SOKO;
			SokoBanMap[8][5] = SOKO;
			SokoBanMap[9][5] = SOKO;
			SokoBanMap[10][5] = WALL;
			SokoBanMap[1][6] = WALL;
			SokoBanMap[2][6] = SOKO;
			SokoBanMap[3][6] = PERSON;
			SokoBanMap[4][6] = SOKO;
			SokoBanMap[5][6] = BOX;
			SokoBanMap[6][6] = SOKO;
			SokoBanMap[7][6] = SOKO;
			SokoBanMap[8][6] = BOX;
			SokoBanMap[9][6] = SOKO;
			SokoBanMap[10][6] = WALL;
			SokoBanMap[1][7] = WALL;
			SokoBanMap[2][7] = SOKO;
			SokoBanMap[3][7] = POSITION;
			iPositionNum++;
			SokoBanMap[4][7] = POSITION;
			iPositionNum++;
			SokoBanMap[5][7] = WALL;
			SokoBanMap[6][7] = SOKO;
			SokoBanMap[7][7] = BOX;
			SokoBanMap[8][7] = SOKO;
			SokoBanMap[9][7] = WALL;
			SokoBanMap[10][7] = WALL;
			SokoBanMap[1][8] = WALL;
			SokoBanMap[2][8] = WALL;
			SokoBanMap[3][8] = POSITION;
			iPositionNum++;
			SokoBanMap[4][8] = POSITION;
			iPositionNum++;
			SokoBanMap[5][8] = WALL;
			SokoBanMap[6][8] = SOKO;
			SokoBanMap[7][8] = SOKO;
			SokoBanMap[8][8] = SOKO;
			SokoBanMap[9][8] = WALL;
			SokoBanMap[2][9] = WALL;
			SokoBanMap[3][9] = WALL;
			SokoBanMap[4][9] = WALL;
			SokoBanMap[5][9] = WALL;
			SokoBanMap[6][9] = WALL;
			SokoBanMap[7][9] = WALL;
			SokoBanMap[8][9] = WALL;
			SokoBanMap[9][9] = WALL;
			Person_X = 3;
			Person_Y = 6;
			break;
		case LEVEL4:
			SokoBanMap[4][2] = WALL;
			SokoBanMap[5][2] = WALL;
			SokoBanMap[6][2] = WALL;
			SokoBanMap[7][2] = WALL;
			SokoBanMap[3][3] = WALL;
			SokoBanMap[4][3] = WALL;
			SokoBanMap[5][3] = SOKO;
			SokoBanMap[6][3] = SOKO;
			SokoBanMap[7][3] = WALL;
			SokoBanMap[3][4] = WALL;
			SokoBanMap[4][4] = PERSON;
			SokoBanMap[5][4] = BOX;
			SokoBanMap[6][4] = SOKO;
			SokoBanMap[7][4] = WALL;
			SokoBanMap[3][5] = WALL;
			SokoBanMap[4][5] = WALL;
			SokoBanMap[5][5] = BOX;
			SokoBanMap[6][5] = SOKO;
			SokoBanMap[7][5] = WALL;
			SokoBanMap[8][5] = WALL;
			SokoBanMap[3][6] = WALL;
			SokoBanMap[4][6] = WALL;
			SokoBanMap[5][6] = SOKO;
			SokoBanMap[6][6] = BOX;
			SokoBanMap[7][6] = SOKO;
			SokoBanMap[8][6] = WALL;
			SokoBanMap[3][7] = WALL;
			SokoBanMap[4][7] = POSITION;
			iPositionNum++;
			SokoBanMap[5][7] = BOX;
			SokoBanMap[6][7] = SOKO;
			SokoBanMap[7][7] = SOKO;
			SokoBanMap[8][7] = WALL;
			SokoBanMap[3][8] = WALL;
			SokoBanMap[4][8] = POSITION;
			iPositionNum++;
			SokoBanMap[5][8] = POSITION;
			iPositionNum++;
			SokoBanMap[6][8] = SOKO;
			SokoBanMap[7][8] = POSITION;
			iPositionNum++;
			SokoBanMap[8][8] = WALL;
			SokoBanMap[3][9] = WALL;
			SokoBanMap[4][9] = WALL;
			SokoBanMap[5][9] = WALL;
			SokoBanMap[6][9] = WALL;
			SokoBanMap[7][9] = WALL;
			SokoBanMap[8][9] = WALL;
			Person_X = 4;
			Person_Y = 4;
			break;
		case LEVEL5:
			SokoBanMap[3][2] = WALL;
			SokoBanMap[4][2] = WALL;
			SokoBanMap[5][2] = WALL;
			SokoBanMap[6][2] = WALL;
			SokoBanMap[7][2] = WALL;
			SokoBanMap[3][3] = WALL;
			SokoBanMap[4][3] = SOKO;
			SokoBanMap[5][3] = SOKO;
			SokoBanMap[6][3] = WALL;
			SokoBanMap[7][3] = WALL;
			SokoBanMap[8][3] = WALL;
			SokoBanMap[3][4] = WALL;
			SokoBanMap[4][4] = PERSON;
			SokoBanMap[5][4] = BOX;
			SokoBanMap[6][4] = SOKO;
			SokoBanMap[7][4] = SOKO;
			SokoBanMap[8][4] = WALL;
			SokoBanMap[2][5] = WALL;
			SokoBanMap[3][5] = WALL;
			SokoBanMap[4][5] = WALL;
			SokoBanMap[5][5] = SOKO;
			SokoBanMap[6][5] = WALL;
			SokoBanMap[7][5] = SOKO;
			SokoBanMap[8][5] = WALL;
			SokoBanMap[9][5] = WALL;
			SokoBanMap[2][6] = WALL;
			SokoBanMap[3][6] = POSITION;
			iPositionNum++;
			SokoBanMap[4][6] = WALL;
			SokoBanMap[5][6] = SOKO;
			SokoBanMap[6][6] = WALL;
			SokoBanMap[7][6] = SOKO;
			SokoBanMap[8][6] = SOKO;
			SokoBanMap[9][6] = WALL;
			SokoBanMap[2][7] = WALL;
			SokoBanMap[3][7] = POSITION;
			iPositionNum++;
			SokoBanMap[4][7] = BOX;
			SokoBanMap[5][7] = SOKO;
			SokoBanMap[6][7] = SOKO;
			SokoBanMap[7][7] = WALL;
			SokoBanMap[8][7] = SOKO;
			SokoBanMap[9][7] = WALL;
			SokoBanMap[2][8] = WALL;
			SokoBanMap[3][8] = POSITION;
			iPositionNum++;
			SokoBanMap[4][8] = SOKO;
			SokoBanMap[5][8] = SOKO;
			SokoBanMap[6][8] = SOKO;
			SokoBanMap[7][8] = BOX;
			SokoBanMap[8][8] = SOKO;
			SokoBanMap[9][8] = WALL;
			SokoBanMap[2][9] = WALL;
			SokoBanMap[3][9] = WALL;
			SokoBanMap[4][9] = WALL;
			SokoBanMap[5][9] = WALL;
			SokoBanMap[6][9] = WALL;
			SokoBanMap[7][9] = WALL;
			SokoBanMap[8][9] = WALL;
			SokoBanMap[9][9] = WALL;
			Person_X = 4;
			Person_Y = 4;
			break;
		case LEVEL6:
			SokoBanMap[4][2] = WALL;
			SokoBanMap[5][2] = WALL;
			SokoBanMap[6][2] = WALL;
			SokoBanMap[7][2] = WALL;
			SokoBanMap[8][2] = WALL;
			SokoBanMap[9][2] = WALL;
			SokoBanMap[10][2] = WALL;
			SokoBanMap[3][3] = WALL;
			SokoBanMap[4][3] = WALL;
			SokoBanMap[5][3] = SOKO;
			SokoBanMap[6][3] = SOKO;
			SokoBanMap[7][3] = WALL;
			SokoBanMap[8][3] = SOKO;
			SokoBanMap[9][3] = PERSON;
			SokoBanMap[10][3] = WALL;
			SokoBanMap[3][4] = WALL;
			SokoBanMap[4][4] = SOKO;
			SokoBanMap[5][4] = SOKO;
			SokoBanMap[6][4] = SOKO;
			SokoBanMap[7][4] = WALL;
			SokoBanMap[8][4] = SOKO;
			SokoBanMap[9][4] = SOKO;
			SokoBanMap[10][4] = WALL;
			SokoBanMap[3][5] = WALL;
			SokoBanMap[4][5] = BOX;
			SokoBanMap[5][5] = SOKO;
			SokoBanMap[6][5] = BOX;
			SokoBanMap[7][5] = SOKO;
			SokoBanMap[8][5] = BOX;
			SokoBanMap[9][5] = SOKO;
			SokoBanMap[10][5] = WALL;
			SokoBanMap[3][6] = WALL;
			SokoBanMap[4][6] = SOKO;
			SokoBanMap[5][6] = BOX;
			SokoBanMap[6][6] = WALL;
			SokoBanMap[7][6] = WALL;
			SokoBanMap[8][6] = SOKO;
			SokoBanMap[9][6] = SOKO;
			SokoBanMap[10][6] = WALL;
			SokoBanMap[1][7] = WALL;
			SokoBanMap[2][7] = WALL;
			SokoBanMap[3][7] = WALL;
			SokoBanMap[4][7] = SOKO;
			SokoBanMap[5][7] = BOX;
			SokoBanMap[6][7] = SOKO;
			SokoBanMap[7][7] = WALL;
			SokoBanMap[8][7] = SOKO;
			SokoBanMap[9][7] = WALL;
			SokoBanMap[10][7] = WALL;
			SokoBanMap[1][8] = WALL;
			SokoBanMap[2][8] = POSITION;
			iPositionNum++;
			SokoBanMap[3][8] = POSITION;
			iPositionNum++;
			SokoBanMap[4][8] = POSITION;
			iPositionNum++;
			SokoBanMap[5][8] = POSITION;
			iPositionNum++;
			SokoBanMap[6][8] = POSITION;
			iPositionNum++;
			SokoBanMap[7][8] = SOKO;
			SokoBanMap[8][8] = SOKO;
			SokoBanMap[9][8] = WALL;
			SokoBanMap[1][9] = WALL;
			SokoBanMap[2][9] = WALL;
			SokoBanMap[3][9] = WALL;
			SokoBanMap[4][9] = WALL;
			SokoBanMap[5][9] = WALL;
			SokoBanMap[6][9] = WALL;
			SokoBanMap[7][9] = WALL;
			SokoBanMap[8][9] = WALL;
			SokoBanMap[9][9] = WALL;
			Person_X = 9;
			Person_Y = 3;
			break;
		case LEVEL7:
			SokoBanMap[4][2] = WALL;
			SokoBanMap[5][2] = WALL;
			SokoBanMap[6][2] = WALL;
			SokoBanMap[7][2] = WALL;
			SokoBanMap[8][2] = WALL;
			SokoBanMap[9][2] = WALL;
			SokoBanMap[2][3] = WALL;
			SokoBanMap[3][3] = WALL;
			SokoBanMap[4][3] = WALL;
			SokoBanMap[5][3] = SOKO;
			SokoBanMap[6][3] = SOKO;
			SokoBanMap[7][3] = SOKO;
			SokoBanMap[8][3] = SOKO;
			SokoBanMap[9][3] = WALL;
			SokoBanMap[1][4] = WALL;
			SokoBanMap[2][4] = WALL;
			SokoBanMap[3][4] = POSITION;
			iPositionNum++;
			SokoBanMap[4][4] = SOKO;
			SokoBanMap[5][4] = BOX;
			SokoBanMap[6][4] = WALL;
			SokoBanMap[7][4] = WALL;
			SokoBanMap[8][4] = SOKO;
			SokoBanMap[9][4] = WALL;
			SokoBanMap[10][4] = WALL;
			SokoBanMap[1][5] = WALL;
			SokoBanMap[2][5] = POSITION;
			iPositionNum++;
			SokoBanMap[3][5] = POSITION;
			iPositionNum++;
			SokoBanMap[4][5] = BOX;
			SokoBanMap[5][5] = SOKO;
			SokoBanMap[6][5] = BOX;
			SokoBanMap[7][5] = SOKO;
			SokoBanMap[8][5] = SOKO;
			SokoBanMap[9][5] = PERSON;
			SokoBanMap[10][5] = WALL;
			SokoBanMap[1][6] = WALL;
			SokoBanMap[2][6] = POSITION;
			iPositionNum++;
			SokoBanMap[3][6] = POSITION;
			iPositionNum++;
			SokoBanMap[4][6] = SOKO;
			SokoBanMap[5][6] = BOX;
			SokoBanMap[6][6] = SOKO;
			SokoBanMap[7][6] = BOX;
			SokoBanMap[8][6] = SOKO;
			SokoBanMap[9][6] = WALL;
			SokoBanMap[10][6] = WALL;
			SokoBanMap[1][7] = WALL;
			SokoBanMap[2][7] = WALL;
			SokoBanMap[3][7] = WALL;
			SokoBanMap[4][7] = WALL;
			SokoBanMap[5][7] = WALL;
			SokoBanMap[6][7] = WALL;
			SokoBanMap[7][7] = SOKO;
			SokoBanMap[8][7] = SOKO;
			SokoBanMap[9][7] = WALL;
			SokoBanMap[6][8] = WALL;
			SokoBanMap[7][8] = WALL;
			SokoBanMap[8][8] = WALL;
			SokoBanMap[9][8] = WALL;
			Person_X = 9;
			Person_Y = 5;
			break;
		case LEVEl8:
			SokoBanMap[2][1] = WALL;
			SokoBanMap[3][1] = WALL;
			SokoBanMap[4][1] = WALL;
			SokoBanMap[5][1] = WALL;
			SokoBanMap[6][1] = WALL;
			SokoBanMap[7][1] = WALL;
			SokoBanMap[8][1] = WALL;
			SokoBanMap[9][1] = WALL;
			SokoBanMap[10][1] = WALL;
			SokoBanMap[2][2] = WALL;
			SokoBanMap[3][2] = SOKO;
			SokoBanMap[4][2] = SOKO;
			SokoBanMap[5][2] = WALL;
			SokoBanMap[6][2] = WALL;
			SokoBanMap[7][2] = SOKO;
			SokoBanMap[8][2] = SOKO;
			SokoBanMap[9][2] = SOKO;
			SokoBanMap[10][2] = WALL;
			SokoBanMap[2][3] = WALL;
			SokoBanMap[3][3] = SOKO;
			SokoBanMap[4][3] = SOKO;
			SokoBanMap[5][3] = SOKO;
			SokoBanMap[6][3] = BOX;
			SokoBanMap[7][3] = SOKO;
			SokoBanMap[8][3] = SOKO;
			SokoBanMap[9][3] = SOKO;
			SokoBanMap[10][3] = WALL;
			SokoBanMap[2][4] = WALL;
			SokoBanMap[3][4] = BOX;
			SokoBanMap[4][4] = SOKO;
			SokoBanMap[5][4] = WALL;
			SokoBanMap[6][4] = WALL;
			SokoBanMap[7][4] = WALL;
			SokoBanMap[8][4] = SOKO;
			SokoBanMap[9][4] = BOX;
			SokoBanMap[10][4] = WALL;
			SokoBanMap[2][5] = WALL;
			SokoBanMap[3][5] = SOKO;
			SokoBanMap[4][5] = WALL;
			SokoBanMap[5][5] = POSITION;
			iPositionNum++;
			SokoBanMap[6][5] = POSITION;
			iPositionNum++;
			SokoBanMap[7][5] = POSITION;
			iPositionNum++;
			SokoBanMap[8][5] = WALL;
			SokoBanMap[9][5] = SOKO;
			SokoBanMap[10][5] = WALL;
			SokoBanMap[1][6] = WALL;
			SokoBanMap[2][6] = WALL;
			SokoBanMap[3][6] = SOKO;
			SokoBanMap[4][6] = WALL;
			SokoBanMap[5][6] = POSITION;
			iPositionNum++;
			SokoBanMap[6][6] = POSITION;
			iPositionNum++;
			SokoBanMap[7][6] = POSITION;
			iPositionNum++;
			SokoBanMap[8][6] = WALL;
			SokoBanMap[9][6] = SOKO;
			SokoBanMap[10][6] = WALL;
			SokoBanMap[11][6] = WALL;
			SokoBanMap[1][7] = WALL;
			SokoBanMap[2][7] = SOKO;
			SokoBanMap[3][7] = BOX;
			SokoBanMap[4][7] = SOKO;
			SokoBanMap[5][7] = SOKO;
			SokoBanMap[6][7] = BOX;
			SokoBanMap[7][7] = SOKO;
			SokoBanMap[8][7] = SOKO;
			SokoBanMap[9][7] = BOX;
			SokoBanMap[10][7] = SOKO;
			SokoBanMap[11][7] = WALL;
			SokoBanMap[1][8] = WALL;
			SokoBanMap[2][8] = SOKO;
			SokoBanMap[3][8] = SOKO;
			SokoBanMap[4][8] = SOKO;
			SokoBanMap[5][8] = SOKO;
			SokoBanMap[6][8] = SOKO;
			SokoBanMap[7][8] = WALL;
			SokoBanMap[8][8] = SOKO;
			SokoBanMap[9][8] = PERSON;
			SokoBanMap[10][8] = SOKO;
			SokoBanMap[11][8] = WALL;
			SokoBanMap[1][9] = WALL;
			SokoBanMap[2][9] = WALL;
			SokoBanMap[3][9] = WALL;
			SokoBanMap[4][9] = WALL;
			SokoBanMap[5][9] = WALL;
			SokoBanMap[6][9] = WALL;
			SokoBanMap[7][9] = WALL;
			SokoBanMap[8][9] = WALL;
			SokoBanMap[9][9] = WALL;
			SokoBanMap[10][9] = WALL;
			SokoBanMap[11][9] = WALL;
			Person_X = 9;
			Person_Y = 8;			
			break;
		case LEVEL9:
			SokoBanMap[4][2] = WALL;
			SokoBanMap[5][2] = WALL;
			SokoBanMap[6][2] = WALL;
			SokoBanMap[7][2] = WALL;
			SokoBanMap[8][2] = WALL;
			SokoBanMap[9][2] = WALL;
			SokoBanMap[4][3] = WALL;
			SokoBanMap[5][3] = SOKO;
			SokoBanMap[6][3] = SOKO;
			SokoBanMap[7][3] = SOKO;
			SokoBanMap[8][3] = SOKO;
			SokoBanMap[9][3] = WALL;
			SokoBanMap[2][4] = WALL;
			SokoBanMap[3][4] = WALL;
			SokoBanMap[4][4] = WALL;
			SokoBanMap[5][4] = BOX;
			SokoBanMap[6][4] = BOX;
			SokoBanMap[7][4] = BOX;
			SokoBanMap[8][4] = SOKO;
			SokoBanMap[9][4] = WALL;
			SokoBanMap[2][5] = WALL;
			SokoBanMap[3][5] = SOKO;
			SokoBanMap[4][5] = PERSON;
			SokoBanMap[5][5] = BOX;
			SokoBanMap[6][5] = POSITION;
			iPositionNum++;
			SokoBanMap[7][5] = POSITION;
			iPositionNum++;
			SokoBanMap[8][5] = SOKO;
			SokoBanMap[9][5] = WALL;
			SokoBanMap[2][6] = WALL;
			SokoBanMap[3][6] = SOKO;
			SokoBanMap[4][6] = BOX;
			SokoBanMap[5][6] = POSITION;
			iPositionNum++;
			SokoBanMap[6][6] = POSITION;
			iPositionNum++;
			SokoBanMap[7][6] = POSITION;
			iPositionNum++;
			SokoBanMap[8][6] = WALL;
			SokoBanMap[9][6] = WALL;
			SokoBanMap[2][7] = WALL;
			SokoBanMap[3][7] = WALL;
			SokoBanMap[4][7] = WALL;
			SokoBanMap[5][7] = WALL;
			SokoBanMap[6][7] = SOKO;
			SokoBanMap[7][7] = SOKO;
			SokoBanMap[8][7] = WALL;
			SokoBanMap[5][8] = WALL;
			SokoBanMap[6][8] = WALL;
			SokoBanMap[7][8] = WALL;
			SokoBanMap[8][8] = WALL;
			Person_X = 4;
			Person_Y = 5;			
			break;
		case LEVEL10:
			SokoBanMap[1][3] = WALL;
			SokoBanMap[2][3] = WALL;
			SokoBanMap[3][3] = WALL;
			SokoBanMap[4][3] = WALL;
			SokoBanMap[7][3] = WALL;
			SokoBanMap[8][3] = WALL;
			SokoBanMap[9][3] = WALL;
			SokoBanMap[10][3] = WALL;
			SokoBanMap[11][3] = WALL;
			SokoBanMap[0][4] = WALL;
			SokoBanMap[1][4] = WALL;
			SokoBanMap[2][4] = SOKO;
			SokoBanMap[3][4] = SOKO;
			SokoBanMap[4][4] = WALL;
			SokoBanMap[7][4] = WALL;
			SokoBanMap[8][4] = SOKO;
			SokoBanMap[9][4] = SOKO;
			SokoBanMap[10][4] = SOKO;
			SokoBanMap[11][4] = WALL;
			SokoBanMap[0][5] = WALL;
			SokoBanMap[1][5] = SOKO;
			SokoBanMap[2][5] = BOX;
			SokoBanMap[3][5] = SOKO;
			SokoBanMap[4][5] = WALL;
			SokoBanMap[5][5] = WALL;
			SokoBanMap[6][5] = WALL;
			SokoBanMap[7][5] = WALL;
			SokoBanMap[8][5] = BOX;
			SokoBanMap[9][5] = SOKO;
			SokoBanMap[10][5] = SOKO;
			SokoBanMap[11][5] = WALL;
			SokoBanMap[0][6] = WALL;
			SokoBanMap[1][6] = SOKO;
			SokoBanMap[2][6] = SOKO;
			SokoBanMap[3][6] = BOX;
			SokoBanMap[4][6] = POSITION;
			iPositionNum++;
			SokoBanMap[5][6] = POSITION;
			iPositionNum++;
			SokoBanMap[6][6] = POSITION;
			iPositionNum++;
			SokoBanMap[7][6] = POSITION;
			iPositionNum++;
			SokoBanMap[8][6] = SOKO;
			SokoBanMap[9][6] = BOX;
			SokoBanMap[10][6] = SOKO;
			SokoBanMap[11][6] = WALL;
			SokoBanMap[0][7] = WALL;
			SokoBanMap[1][7] = WALL;
			SokoBanMap[2][7] = SOKO;
			SokoBanMap[3][7] = SOKO;
			SokoBanMap[4][7] = SOKO;
			SokoBanMap[5][7] = SOKO;
			SokoBanMap[6][7] = WALL;
			SokoBanMap[7][7] = SOKO;
			SokoBanMap[8][7] = PERSON;
			SokoBanMap[9][7] = SOKO;
			SokoBanMap[10][7] = WALL;
			SokoBanMap[11][7] = WALL;
			SokoBanMap[1][8] = WALL;
			SokoBanMap[2][8] = WALL;
			SokoBanMap[3][8] = WALL;
			SokoBanMap[4][8] = WALL;
			SokoBanMap[5][8] = WALL;
			SokoBanMap[6][8] = WALL;
			SokoBanMap[7][8] = WALL;
			SokoBanMap[8][8] = WALL;
			SokoBanMap[9][8] = WALL;
			SokoBanMap[10][8] = WALL;
			Person_X = 8;
			Person_Y = 7;			
			break;			
		default:
			break;
	}

	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			SokoBanCategoryMap[i][j] = SokoBanMap[i][j];
		}
	}
}

// Get blockmap
function getBlockMap(iCategory) {
	var image = null;
	switch (iCategory) {
		case WALL:
			image  = document.getElementById("wall");
			break;
		case SOKO:
			image  = document.getElementById("soko");
			break;	
		case BOX:
			image  = document.getElementById("box");
			break;		
		case PERSON:
			image  = document.getElementById("person");
			break;		
		case POSITION:
			image  = document.getElementById("position");
			break;		
		case BOX_OVER:
			image  = document.getElementById("box_over");
			break;	
		default:
			break;		
	}
	return image;
}

// Get the iPositionNum
function getPositionNum() {
	var iPNum = iPositionNum;
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			if (SokoBanCategoryMap[i][j] == POSITION
					&& SokoBanMap[i][j] != POSITION) {
				iPNum--;
			}
		}
	}
	
	return iPNum;
}

// Insert Undo Map
function insertUndoMap() {
	iUndoCount++;
	var undoSokoBanMap = new Array(X_SIZE);
	for (var i = 0; i < undoSokoBanMap.length; i++) {
		undoSokoBanMap[i] = new Array(Y_SIZE);
	}
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			undoSokoBanMap[i][j] = SokoBanMap[i][j];
		}
	}
	undoList.push(undoSokoBanMap);
}

// Insert Redo Map
function insertRedoMap() {
	iRedoCount++;
	var redoSokoBanMap = new Array(X_SIZE);
	for (var i = 0; i < redoSokoBanMap.length; i++) {
		redoSokoBanMap[i] = new Array(Y_SIZE);
	}
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			redoSokoBanMap[i][j] = SokoBanMap[i][j];
		}
	}
	redoList.push(redoSokoBanMap);
}
















