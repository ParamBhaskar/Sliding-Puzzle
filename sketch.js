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
    MovesNum=0;
    generateBoard();
    drawBoard();
    displayStats();
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

function drawBoard()
{
    for(var row = 0; row < RowsNum; row++)
    {
        for(var col = 0; col < ColsNum; col++)
        {
            var value = getTileValue(row, col);
            
            var x = boardX + col * squareSize;
            var y = boardY + row * squareSize;

            drawTile(x, y, value);
        }
    }
}

function drawTile(x, y, value)
{
    fill( value != 0 ? "tan" : "white" );
    stroke("black");
    strokeWeight(1);
    
    rect(x, y, squareSize, squareSize);
    
    if (value != 0)
    {
        push();
        textAlign(CENTER);
        textSize(24);
        noStroke();
        fill("black");
        text(value, x + squareSize / 2, y + squareSize / 2);
        pop();
    }
}

function getTileValue(row, col)
{
    var index = row * ColsNum + col;
    return board[index];
}

function setTileValue(row, col, value)
{
    var index = row * ColsNum + col;
    board[index] = value;
}

function loopp()
{
    clear();
    
    drawBoard();
    displayStats();
}

function findClickedTile(x, y)
{
    var col = Math.floor( (x - boardX) / squareSize );
    var row = Math.floor( (y - boardY) / squareSize );
    
    if (col < 0 || col >= ColsNum || row < 0 || row >= RowsNum )
    {
        return null;
    }
    
    return { row : row, col : col }
}

function findEmptyTile(row, col)
{
    // check left tile if exists
    if (col > 0)
    {
        if (getTileValue(row, col - 1) == 0)
            return { row : row, col : col - 1 };
    }
    
    // check right tile if exists
    if (col < ColsNum - 1)
    {
        if (getTileValue(row, col + 1) == 0)
            return { row : row, col : col + 1 };
        
    }
    
    // check up tile
    if (row > 0)
    {
        if (getTileValue(row - 1, col) == 0)
            return { row : row - 1, col : col };
    }
    
    // check down tile
    if (row < RowsNum - 1)
    {
        if (getTileValue(row + 1, col) == 0)
            return { row : row + 1, col : col };
    }

    return null;
}

function switchTiles()
{
    var tile = findClickedTile(mouseX, mouseY);
    if (!tile)
        return;
    
    var emptyTile = findEmptyTile(tile.row, tile.col);
    if (!emptyTile)
        return;
        
    var tileValue = getTileValue(tile.row, tile.col);
    setTileValue(emptyTile.row, emptyTile.col, tileValue);
    setTileValue(tile.row, tile.col, 0);
    MovesNum++;
    loopp();
    displayStats();
}
function mouseClicked()
{
    switchTiles();
    
    if (checkWin())
    {
        enter();
    }
}

function enter()
{
    clear();
    textAlign(CENTER);
    
    textSize(24);
    text("You win!", width / 2, 300);
    
    textSize(14);
    text("... in " + MovesNum + " moves!", width / 2, 350 );
}

function displayStats()
{
    fill(0);
    noStroke();
    document.getElementById("show").innerHTML="Moves: " + MovesNum;
}


function checkWin()
{
    for(var i = 0; i < board.length - 1; i++)
    {
        if (board[i] != i + 1)
            return false;
    }
    
    return true;
}



// debugging method...
function keyPressed()
{
    if (key.toUpperCase() === "X")
    {
        board = [1, 2, 3, 4, 5, 6, 7, 0, 8];
    }
    loopp();
}
