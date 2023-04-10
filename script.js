window.addEventListener('load', () => {
  const canvas = document.querySelector('canvas')
  canvas.style.backgroundColor = '#302c2c'

  const ctx = canvas.getContext('2d')

  const startBtn = document.querySelector('#start')
  const restartBtn = document.querySelector('#restart')

  canvas.style.display = 'none'
  restartBtn.style.display = 'none'

  const bgImg = new Image()
  bgImg.src = '/background.jpg'
  const ballRadius = 20
  const paddleWidth = 100
  const paddleHeight = 20
  const paddleSpeed = 6

  let paddleX = canvas.width / 2 - paddleWidth / 2

  let isMovingLeft = false
  let isMovingRight = false

  let ballX = paddleX + paddleWidth/ 2
  let ballY = canvas.height - paddleHeight - ballRadius*2
  let ballSpeedX = 5
  let ballSpeedY = 5

  let score = 0
  let gameOver = false
  let animateId
  let bricks = []

  const drawBall = () => {
    ctx.beginPath()
    ctx.fillStyle = 'red'
    // x, y, radius, startAngle, endAngle
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }

  const drawPaddle = () => {
    ctx.beginPath()
    ctx.fillStyle = 'white'
    // xPos, yPos, width, height
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fill()
    ctx.closePath()
  }

  class Brick {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
        this.counter = 2;
    }

    move() {
        if (ballY > canvas.height - paddleHeight - ballRadius &&
            ballX > paddleX &&
            ballX < paddleX + paddleWidth) {
                this.y +=45
        }
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.font = '24px sans-serif'
        ctx.fillText(this.counter, this.x, this.y)
    }

    checkCollision() {
        if (ballX - ballRadius < this.x + this.width &&
            ballX > this.x &&
            ballY - ballRadius < this.y + this.height &&
            ballY > this.y
        ) {
            ballSpeedX *= -1
            ballSpeedY *= -1
            score += 1
            this.counter -=1

            //if (this.counter == 0) {
            //    clearRect(this.x, this.y, this.width, this.height)
            //}
        }

    }

  }


  const animate = () => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
    drawBall()
    drawPaddle()

    const bricksStillInScreen = []

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
        else if (brick.y >= canvas.height - paddleHeight - brick.height &&
            brick.x > paddleX &&
            brick.x < paddleX + paddleWidth) {
                gameOver = true 
                console.log('Game Over: a brick touched the paddle')
        }
        else {
            bricksStillInScreen.push(brick)
        }
    })

    bricks = bricksStillInScreen

    if (ballY > canvas.height - paddleHeight - ballRadius &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth) {
            bricks.push(new Brick(Math.random() * (canvas.width-45), 3))
    }


    // Ball bounces off right wall
    if (ballX > canvas.width - ballRadius) {
      ballSpeedX *= -1
    }
    // Ball bounces off paddle
    if (
        ballY > canvas.height - paddleHeight - ballRadius &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth + ballRadius
      ) {        
        ballSpeedY *= -1
      }
    // Ball bounces off left wall
    if (ballX < ballRadius) {
      ballSpeedX *= -1
    }
    // Ball bounces off ceiling
    if (ballY < ballRadius) {
      ballSpeedY *= -1
    }
    // But if the ball touches the floor
    if (ballY + ballRadius > canvas.height) {
        gameOver = true
        console.log('Game over: the ball touched the floor')
    }

    if (isMovingLeft && paddleX > 0) {
      paddleX -= paddleSpeed
    } else if (isMovingRight && paddleX < canvas.width - paddleWidth) {
      paddleX += paddleSpeed
    }

    ballX += ballSpeedX
    ballY += ballSpeedY

    ctx.font = '24px sans-serif'
    ctx.fillText(score, 10, 30)

    if (gameOver) {
      cancelAnimationFrame(animateId)
      //Display gameover text
      ctx.font = '48px sans-serif'
      ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2)
      restartBtn.style.display = 'block'
    } else {
      animateId = requestAnimationFrame(animate)
    }
  }

  const start = () => {
    startBtn.style.display = 'none'
    canvas.style.display = 'block'
    animate()
  }

  startBtn.addEventListener('click', start)

  restartBtn.addEventListener('click', () => {
    restartBtn.style.display = 'none'

    paddleX = canvas.width / 2 - paddleWidth / 2

    isMovingLeft = false
    isMovingRight = false

    ballX = paddleX + paddleWidth/ 2
    ballY = canvas.height - paddleHeight - ballRadius*2
    ballSpeedX = 5
    ballSpeedY = 5

    score = 0
    gameOver = false

    start()
  })

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
})