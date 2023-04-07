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
  const paddleSpeed = 2

  let paddleX = canvas.width / 2 - paddleWidth / 2

  let isMovingLeft = false
  let isMovingRight = false

  let ballX = 100
  let ballY = 100
  let ballSpeedX = 2
  let ballSpeedY = 2

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
        this.width = 50;
        this.height = 50;
        this.counter = 0;
    }

    //ctx.font = '48px sans-serif'
    //ctx.fillText(`${this.counter}`, this.width/2, this.height/2)

    move() {
        this.y +=1
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    checkCollision() {
        if (ballX < this.x + this.width &&
            ballX + ballRadius > this.x &&
            ballY < this.y + this.height &&
            ballY + ballRadius > this.y
        ) {
            this.counter -= 1
            score += 1

            //if (counter = 0) {
                //remove brick
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
        if (brick.y >= canvas.height - brick.height) {
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

    if (animateId % 100 === 0) {
        bricks.push(new Brick(Math.random() * canvas.width, Math.random() * canvas.height/5))
    }


    // Bounce off right wall
    if (ballX > canvas.width - ballRadius) {
      ballSpeedX *= -1
    }
    // Bounce off paddle
    if (
        ballY > canvas.height - paddleHeight - ballRadius &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
      ) {
        ballY -= 1
        ballSpeedY *= -1
      }
    // Bounce off left wall
    if (ballX < ballRadius) {
      ballSpeedX *= -1
    }
    // Bounce off ceiling
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

    paddleWidth = 100

    paddleX = canvas.width / 2 - paddleWidth / 2

    isMovingLeft = false
    isMovingRight = false

    ballX = 100
    ballY = 100
    ballSpeedX = 2
    ballSpeedY = 2

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