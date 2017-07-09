var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext('2d');
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10, paddleWidth = 75, paddleX = (canvas.width -  paddleWidth) / 2;
var rightPressed = false, leftPressed = false;
var brickRowCount = 3, brickColumnCount = 5, brickWidth = 75, brickHeight = 20, brickPadding = 10,
    brickOffsetTop = 30, brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x: x, y: y, status: 1};
    }
}

// add event listeners for handling key press events
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// keycode for left arrow key = 37
// keycode for right arrow key = 39
function keyDownHandler(e){
    if(e.keyCode === 39){
        rightPressed = true;
    } else if(e.keyCode === 37){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.keyCode === 39){
        rightPressed = false;
    } else if(e.keyCode === 37){
        leftPressed = false;
    }
}

// draw the circle(ball)
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    for (var c = 0; c < brickColumnCount; c++){
        for (var r = 0; r < brickRowCount; r++){
            if (bricks[c][r].status === 1){
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight , paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function collisionDetection(){
    for (var c = 0; c < brickColumnCount; c++){
        for (var r = 0; r < brickRowCount; r++){
            var b = bricks[c][r];
            if(b.status === 1){
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score === brickColumnCount * brickRowCount){
                        alert('YOU WIN!! Congratulations');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives(){
    console.log('Draw Lives');
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText("Lives: " + lives, canvas.width - 100, 20);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if( y + dy < ballRadius){
        dy = -dy;
    } else if (y + dy > (canvas.height - ballRadius)){
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
            /*return;*/
        }else {
            lives --;
            if(!lives){
                alert('Game Over');
                document.location.reload();
            }else{
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth)/2;
            }
        }
    }

    if(x + dx < ballRadius || x + dx > (canvas.width - ballRadius)){
        dx = -dx;
    }

    if (leftPressed && paddleX > 0){
        paddleX -= 7;
    }else if (rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += 7;
    }
    //change the values of x and y before calling function again, moving the balls
    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

document.addEventListener('mousemove', mouseMoveHandler);
function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if( relativeX > 0 + paddleWidth/2 && relativeX < canvas.width - paddleWidth/2){
        paddleX = relativeX - paddleWidth/2;
    }
}
// params(function, time in milliseconds)
draw();



