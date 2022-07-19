function setup() {
    createCanvas(2000, 2000);
}
var RowsNum;
var ColsNum;
var MovesNum = 0;
var board = [];

var boardX = 10;
var boardY = 10;
var squareSize = 175;
function ask() {
    RowsNum = parseInt(prompt("Enter the number of Rows you want:"));
    ColsNum = parseInt(prompt("Enter the number of Columns you want:"));
    clear();
    MovesNum = 0;
    generateBoard();
    drawBoard();
    displayStats();
    resetTimer();
    counting();
}

function generateBoard() {
    board = [];

    var n = RowsNum * ColsNum;
    for (var i = 0; i < n; i++) {
        board.push(i);
    }

    shuffleArray(board);
}

function shuffleArray(arr) {
    var n = arr.length;
    for (var i = 0; i < n; i++) {
        var i2 = generateRandomNum(0, n - 1);
        var t = arr[i];
        arr[i] = arr[i2];
        arr[i2] = t;
    }
}

function generateRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawBoard() {
    for (var row = 0; row < RowsNum; row++) {
        for (var col = 0; col < ColsNum; col++) {
            var value = getTileValue(row, col);

            var x = boardX + col * squareSize;
            var y = boardY + row * squareSize;

            drawTile(x, y, value);
        }
    }
}

function drawTile(x, y, value) {
    fill(value != 0 ? "tan" : "white");
    stroke("black");
    strokeWeight(1);

    rect(x, y, squareSize, squareSize);

    if (value != 0) {
        push();
        textAlign(CENTER);
        textSize(24);
        noStroke();
        fill("black");
        text(value, x + squareSize / 2, y + squareSize / 2);
        pop();
    }
}

function getTileValue(row, col) {
    var index = row * ColsNum + col;
    return board[index];
}

function setTileValue(row, col, value) {
    var index = row * ColsNum + col;
    board[index] = value;
}

function loopp() {
    clear();

    drawBoard();
    displayStats();
}

function findClickedTile(x, y) {
    var col = Math.floor((x - boardX) / squareSize);
    var row = Math.floor((y - boardY) / squareSize);

    if (col < 0 || col >= ColsNum || row < 0 || row >= RowsNum) {
        return null;
    }

    return { row: row, col: col }
}

function findEmptyTile(row, col) {
    let i = 0;
    while (i < ColsNum && getTileValue(row, i) != 0) {
        i++;
    }
    if (col < i && i < ColsNum) {
        for (let j = i; j > col; j--) {
            exchange_in_same_row(row, j, j - 1);
        }
        MovesNum++;
    }
    else if (col > i) {
        for (let j = i; j < col; j++) {
            exchange_in_same_row(row, j, j + 1);
        }
        MovesNum++;
    }

    i = 0;
    while (i < RowsNum && getTileValue(i, col) != 0) {
        i++;
    }
    if (row < i && i < RowsNum) {
        for (let j = i; j > row; j--) {
            exchange_in_same_column(col, j, j - 1);
        }
        MovesNum++;
    }
    else if (row > i) {
        for (let j = i; j < row; j++) {
            exchange_in_same_column(col, j, j + 1);
        }
        MovesNum++;
    }
}

function exchange_in_same_row(row, m, n) {
    let M = getTileValue(row, m);
    let N = getTileValue(row, n);
    setTileValue(row, m, N);
    setTileValue(row, n, M);
}
function exchange_in_same_column(col, m, n) {
    let M = getTileValue(m, col);
    let N = getTileValue(n, col);
    setTileValue(m, col, N);
    setTileValue(n, col, M);
}
function switchTiles() {
    var tile = findClickedTile(mouseX, mouseY);
    if (!tile)
        return;
    findEmptyTile(tile.row, tile.col);

    loopp();
    displayStats();
}
function mouseClicked() {
    switchTiles();

    if (checkWin()) {
        enter();
    }
}

function enter() {
    clear();

    textSize(24);
    text("You win!", displayWidth / 2, 300);

    textSize(14);
    text("... in " + MovesNum + " moves!", displayWidth / 2, 350);
    textSize(14);
    text("...within " + sec + " seconds!", displayWidth / 2, 400);
    textAlign(CENTER);
    resetTimer();
}

function displayStats() {
    fill(0);
    noStroke();
    document.getElementById("show").innerHTML = "Moves: " + MovesNum;
}


function checkWin() {
    for (var i = 0; i < board.length - 1; i++) {
        if (board[i] != i + 1)
            return false;
    }
    return true;
}

// debugging method...
function keyPressed() {
    if (key.toUpperCase() === "X") {
        for (let i = 0; i < RowsNum; i++) {
            for (let j = 0; j < ColsNum; j++) {
                if ((i != RowsNum - 1 || j != ColsNum - 1) && (i != RowsNum - 1 || j != ColsNum - 2)) {
                    setTileValue(i, j, j + i * ColsNum + 1);
                }
                else if (i == RowsNum - 1 && j == ColsNum - 2) {
                    setTileValue(i, j, 0);
                }
                else if (i == RowsNum - 1 && j == ColsNum - 1) {
                    setTileValue(i, j, RowsNum * ColsNum - 1);
                }
            }
        }
        loopp();
    }
}

var timerr;
var sec = null;
function counting() {
    sec = 0;
    timerr = setInterval(() => {
        document.getElementById('timer').innerHTML = "Timer: 00:00:" + sec;
        sec++;
        if (sec > 60) {
            var min = sec / 60;
            document.getElementById('timer').innerHTML = "Timer: 00:" + Math.floor(sec / 60) + ":" + sec % 60;
            if (min > 60) {
                document.getElementById('timer').innerHTML = "Timer: " + Math.floor(min / 60) + ":" + min % 60 + ":" + sec % 60;
            }
        }
    }, 1000);

}
function resetTimer() {
    clearInterval(timerr);
    sec = 0;
    document.getElementById('timer').innerHTML = "Timer: 00:00:" + sec;
}