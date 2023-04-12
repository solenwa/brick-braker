window.addEventListener('load', () => {
  const canvas = document.querySelector('canvas')
  canvas.style.backgroundColor = '#302c2c'

  const ctx = canvas.getContext('2d')

  const startPage = document.querySelector('#startPage')
  const startBtn = document.querySelector('#start')
  const restartBtn = document.querySelector('#restart')
  const muteBtn = document.querySelector('#mute-button')

  canvas.style.display = 'none'
  restartBtn.style.display = 'none'
  muteBtn.style.display = 'none'
  
  // BACKGROUND INFO
  const bgImg = new Image()
  bgImg.src = './media/Space Background.png'

  // SOUND INFO
  const audio = new Audio("./media/Justin Mahar - Pumped.mp3")
  isMuted = false;
  audio.loop = true;

  // PADDLE INFO
  const paddleWidth = 100
  const paddleHeight = 28
  const paddleSpeed = 10
  let paddleX = canvas.width / 2 - paddleWidth / 2
  let paddleY = canvas.height - paddleHeight*2

  // BALL INFO
  const ballRadius = 12
  let ballX = paddleX + paddleWidth/ 2
  let ballY = paddleY - ballRadius*2
  let ballSpeedX = 5
  let ballSpeedY = 5

  // STARTING INFO
  let isMovingLeft = false
  let isMovingRight = false
  let score = 0
  let gameOver = false
  let animateId
  let bricks = []
  

  // PADDLE
  const drawPaddle = () => {
    ctx.beginPath()
    ctx.fillStyle = 'white'
    // xPos, yPos, width, height
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight)
    ctx.fill()
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath()
  }

  // BALL
  const drawBall = () => {
    ctx.beginPath()
    ctx.fillStyle = '#0077b6'
    // x, y, radius, startAngle, endAngle
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath()
  }

  // BRICK
  class Brick {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 28;
        this.counter = Math.floor(Math.random() * (4 - 1 + 1) + 1);

    }

    move() {
        if (ballY > paddleY - ballRadius &&
            ballX > paddleX &&
            ballX < paddleX + paddleWidth) {
                this.y +=28
        }
    }

    draw() {
      switch (this.counter){
        case 4: 
            ctx.fillStyle = '#0096C7';
            break;
        case 3: 
            ctx.fillStyle = '#48CAE4';
            break;
        case 2:
            ctx.fillStyle = '#90E0EF';
            break;
        case 1:
            ctx.fillStyle = '#CAF0F8';
            break;          
    }
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.font = '24px sans-serif';
        ctx.fillText(this.counter, this.x + this.width/3, this.y + this.height*0.7);
        
    }



    checkCollision() {
        // if a ball touches a brick
        if (!(ballX - ballRadius > this.x + this.width
            || ballX + ballRadius < this.x
            || ballY - ballRadius > this.y + this.height
            || ballY + ballRadius < this.y)
          ) {
              ballSpeedX *= -1
              ballSpeedY *= -1
              score += 1
              this.counter -=1
        }
      
    }

  }

  // Random function to draw between 1 and 3 bricks
  function randomfunction() {
    return Math.floor(Math.random() * (3 - 1 + 1) + 1)
  }

  // Random function to pick brick.x
  // (10 columns possible and each column is 50 wide)
  function randomXfunction () {
    return Math.floor(Math.random() * (10 - 0) + 0)*50
  }

  // ANIMATE FUNCTION
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
    drawBall()
    drawPaddle()
    

    let bricksStillInScreen = []

    bricks.forEach(brick => {
        brick.draw()
        brick.move()
        brick.checkCollision()

        // if a brick touches the floor
        if (brick.y >= canvas.height) {
            gameOver = true
            console.log('Game Over: a brick touched the floor')
        }
        // if a brick touches the paddle 
        else if (brick.y >= paddleY &&
            brick.x > paddleX &&
            brick.x < paddleX + paddleWidth) {
                gameOver = true 
                console.log('Game Over: a brick touched the paddle')
        }
        else {
            bricksStillInScreen.push(brick)
        }
    })

    
    newArray = bricksStillInScreen.filter(brick => brick.counter !== 0)
    bricks = newArray

    // When the ball touches the paddle, create a new row of bricks + increase speed
    if (!(ballX - ballRadius > paddleX + paddleWidth
      || ballX + ballRadius < paddleX
      || ballY - ballRadius > paddleY + paddleHeight
      || ballY + ballRadius < paddleY)
      ) {

          ballSpeedX= ballSpeedX*1.03
          ballSpeedY= ballSpeedY*1.03

          let randomNbr = randomfunction()
          let randomX = randomXfunction()
          let randomX2 = randomXfunction()
          let randomX3 = randomXfunction()
            if(randomNbr === 1){
              bricks.push(new Brick(randomX, 56))
            }
            else if (randomNbr === 2) {
              brick1 = new Brick(randomX, 56)
              brick2 = new Brick(randomX2, 56)
              bricks.push(brick1, brick2)
            }
            else {
              brick1 = new Brick(randomX, 56)
              brick2 = new Brick(randomX2, 56)
              brick3 = new Brick(randomX3, 56)
              bricks.push(brick1, brick2, brick3)
            }
            
    }


    // Ball bounces off right wall
    if (ballX > canvas.width - ballRadius) {
      ballSpeedX *= -1
    }
      // Ball bounces off paddle
    if (!(ballX - ballRadius > paddleX + paddleWidth
      || ballX + ballRadius < paddleX
      || ballY - ballRadius > paddleY + paddleHeight
      || ballY + ballRadius < paddleY)
      ) {
    ballSpeedY *= -1
    }
    // Ball bounces off left wall
    if (ballX < ballRadius) {
      ballSpeedX *= -1
    }
    // Ball bounces off ceiling
    if (ballY < 56 + ballRadius) {
      ballSpeedY *= -1
    }
    // But if the ball touches the floor
    if (ballY + ballRadius > canvas.height) {
      gameOver = true
      console.log('Game over: the ball touched the floor')
    }

    // Paddle Movement
    if (isMovingLeft && paddleX > 0) {
      paddleX -= paddleSpeed
    } else if (isMovingRight && paddleX < canvas.width - paddleWidth) {
      paddleX += paddleSpeed
    }

    // Ball Movement
    ballX += ballSpeedX
    ballY += ballSpeedY

    // Score Display
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.rect(0, 0, canvas.width, 56)
    ctx.fill()
    ctx.fillStyle = 'white'
    ctx.font = '15px sans-serif'
    ctx.fillText('SCORE', canvas.width / 2.19, 23)
    ctx.font = '24px sans-serif'
    ctx.fillText(score, (canvas.width / 2) - 5, 47)
    ctx.closePath()

    // Game Over
    if (gameOver) {
      cancelAnimationFrame(animateId)
      ctx.fillStyle = 'white'
      ctx.font = '48px sans-serif'
      ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2.5)
      restartBtn.style.display = 'block'
    } else {
      animateId = requestAnimationFrame(animate)
    }
  }

  // START FUNCTION
  const start = () => {
    startPage.style.display = 'none'
    canvas.style.display = 'block'
    muteBtn.style.display = 'block'
    muteBtn.style.filter = 'grayscale(60%)'
    animate()
    
  }

  startBtn.addEventListener('click', () => {
    start()
    audio.play()
  }
    )

  restartBtn.addEventListener('click', () => {
    restartBtn.style.display = 'none'

    paddleX = canvas.width / 2 - paddleWidth / 2

    isMovingLeft = false
    isMovingRight = false

    ballX = paddleX + paddleWidth/ 2
    ballY = paddleY - ballRadius*2
    ballSpeedX = 5
    ballSpeedY = 5
    bricks = []

    score = 0
    gameOver = false

    start()
  })

  // ARROWS FUNCTIONS
  document.addEventListener('keydown', event => {
    console.log(event)
    if (event.key === 'a' || event.key === 'A') {
      isMovingLeft = true
    }
    if (event.key === 'd' || event.key === 'D') {
      isMovingRight = true
    }
  })

  document.addEventListener('keyup', event => {
    console.log(event)
    if (event.key === 'a' || event.key === 'A') {
      isMovingLeft = false
    }
    if (event.key === 'd' || event.key === 'D') {
      isMovingRight = false
    }
  })

  // MUTE FUNCTION
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted
    if(isMuted) {
      audio.pause()
      muteBtn.display.filter = 'grayscale(0)'
    } else {
      audio.play()
      muteBtn.display.filter = 'grayscale(60%)'
    }  
  })

})