var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var banner = document.getElementById("banner");
var ballRadius = 25;
var x ;
var y ;

var dx = 2;
var dy = -2;
var paddleHeight = 20;
var paddleWidth = 150;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 10;
var brickColumnCount = 14;
var brickWidth = 100;
var brickHeight = 25;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;



var colorPallet = ['#A7FFEB','#64FFDA','#1DE9B6','#00BFA5']

var bricks = [];


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#FF9800";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {

    roundedRect(ctx,paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight,10);

}
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: "+score, 8, 20);
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.fillStyle="#00BFA5"
  ctx.fill();
  ctx.closePath();
}

function draw() {
   
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#CDDC39"
    ctx.fill()
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
   
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            //alert("GAME OVER");
            //console.log("game over")
            //document.location.reload();
            var message = "GAME OVER"
            reloadGame(message);

        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    dx = (dx+score/100)
    dy =  (dy+score/100)
    x += dx;
    y += dy;

}
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                   score++;
                   if(score == brickRowCount*brickColumnCount) {
                      // alert("YOU WIN, CONGRATULATIONS!");
                      // document.location.reload();
                      var message = "YOU WIN, CONGRATULATIONS!"
                      reloadGame(message);
                }
            }
        }
    }
}
}
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        if((brickX + brickWidth +brickPadding + brickOffsetLeft) >= window.innerWidth)
        {
            break;
        }
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = colorPallet[(r+c)%4];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

(()=>{
canvas.width = window.innerWidth - 10; 
canvas.height = window.innerHeight - 10;
x = canvas.width/2;
y = canvas.height - 50
})()


function startGame()
{
banner.style.display = 'none';
x = canvas.width/2;
y = canvas.height - 50;
paddleX = (canvas.width-paddleWidth)/2;
dx=2;
dy=-2;
rightPressed = false;
leftPressed = false;
brickRowCount = 10;
brickColumnCount = 14;
score = 0;
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1  };
    }
}

setInt = setInterval(draw, 10);
}

function reloadGame(message)
{
    clearInterval(setInt);
    banner.style.display = 'block';
    var banText = document.getElementById("banner-header");
    banText.textContent = message;
    
}