const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.height = innerWidth - 30
canvas.width = innerHeight - 30
let canvasBoundary = canvas.getBoundingClientRect()

let birdImageArray = [
  'skeleton-animation_00.png',
  'skeleton-animation_01.png',
  'skeleton-animation_02.png',
  'skeleton-animation_03.png',
  'skeleton-animation_04.png',
  'skeleton-animation_05.png',
  'skeleton-animation_06.png',
  'skeleton-animation_07.png',
  'skeleton-animation_08.png',
  'skeleton-animation_09.png',
  'skeleton-animation_10.png',
  'skeleton-animation_11.png',
  'skeleton-animation_12.png',
  'skeleton-animation_13.png',
  'skeleton-animation_14.png'
]

let fps =0
let gameSpeed =0
let gameOver = false
let startTimer = 5
let gameStarted = false

let topMap = [
  '|'    ,   '||'   ,   '|'    ,    '|||'  ,    '||'  , 
  '|||'  ,   ' '    ,   '|'    ,    '||'   ,    '|'   ,
  '||'   ,   '||'   ,   '||'   ,    '|'    ,    '|||' , 
  '||'   ,   '|||'  ,   '|||'  ,    '||'   ,    '|'   
]
let bottomMap =[
  '||'   ,    '|'   ,   '||'   ,    ' '    ,    '|'    , 
  ' '    ,   '|||'  ,   '||'   ,    '|'    ,    '||'   , 
  '|'    ,    '|'   ,    '|'   ,    '||'   ,    ' '    , 
  '|'    ,    ' '   ,    ' '   ,    '|'    ,    '|'    
]

class Bird{
  constructor(y){
    this.x = 0
    this.y = 180
    this.speed = 1
    this.fallingSpeed = 5
    this.image = new Image()
    this.spriteWidth = 266
    this.spriteHeight = 207
    this.width = this.spriteWidth /5
    this.height = this.spriteHeight /5
    this.spriteX =0
    this.spriteY =0
  }
  draw(){
    if (fps % 5 === 0) {
      this.image.src = birdImageArray[this.spriteX]
      this.spriteX++
      if (this.spriteX > 13) {
        this.spriteX = 0
      }
    }
    
    ctx.drawImage(this.image, this.x , this.y, this.width, this.height)
  }
  update(){
    if (this.x< 250) {
      this.x ++
    }
    
    this.y += this.fallingSpeed
  }
  
}
let bird = new Bird()

let obstaclesArray = []
let topExtend = 0
let bottomExtend =0
class Obstacles{
  constructor(height, y, extend){
    this.x =  canvas.width+ extend
    this.y = y
    this.width = 45
    this.height = height
    this.speed
  }
  draw(){
    ctx.fillRect(this.x , this.y , this.width, this.height)
  }
  update(){
    this.speed= gameSpeed
    this.x -= this.speed
  }
}

topMap.forEach((elem) =>{
  let width
  topExtend += 400
  switch (elem) {
    case '|':
      height = 100
      obstaclesArray.push(new Obstacles(height, 0, topExtend))
      break;
    case '||':
      height = 200
      obstaclesArray.push(new Obstacles(height, 0, topExtend))
      break;
    case '|||':
      height = 300
      obstaclesArray.push(new Obstacles(height, 0, topExtend))
      break;
    case ' ':
      height = 0
      break;
  }
})
bottomMap.forEach((elem) =>{
  let width
  bottomExtend += 400
  switch (elem) {
    case '|':
      height = 100
      y =canvas.height - height
      obstaclesArray.push(new Obstacles(height, y, bottomExtend))
      break;
    case '||':
      height = 200
      y =canvas.height - height
      obstaclesArray.push(new Obstacles(height, y, bottomExtend))
      break;
    case '|||':
      height = 300
      y =canvas.height - height
      obstaclesArray.push(new Obstacles(height, y, bottomExtend))
      break;
    case ' ':
      height = 0
      break;
  }
})


window.addEventListener("touchstart", (e)=>{
  if (gameOver === false && gameStarted) {
    if (e.touches[0].clientY < canvas.width/2) {
      bird.fallingSpeed = -6
    }
    else bird.fallingSpeed = -2.8
  }
})



window.addEventListener("load", ()=>{
  
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    
    ctx.font='200px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle';
    if (fps%50 ===0) {
      if (startTimer >1) startTimer --
      else if (startTimer == 1) {
        startTimer = 'Go'
        gameSpeed = 3
        gameStarted = true
      }else{
        startTimer = ''
      }
    }
    ctx.fillText(startTimer, canvas.width/2 -25 , canvas.height/2 )
    
    bird.update()
    bird.draw()
    obstaclesArray.forEach((elem) =>{
      elem.draw()
      elem.update()
    if (elem.x + elem.width < 0 ) {
        elem.x = topExtend
      }
      //collision detection
    if (
        bird.x < elem.x + elem.width &&
        bird.x + bird.width > elem.x &&
        bird.y < elem.y +elem.height &&
        bird.y + bird.height > elem.y
      ) {
        gameSpeed = 0
        gameOver =true
      }
    })
    
    if (bird.fallingSpeed < 5 && fps %10 ===0 && gameStarted) {
      bird.fallingSpeed ++
    }
    
    if (bird.y + bird.height > canvas.height*3) {
      bird.fallingSpeed = 0
      bird.speed = 0
      gameOver = true
      gameSpeed = 0
    }
    fps ++
    
    if (gameStarted ===false && bird.y > canvas.height + bird.height) bird.fallingSpeed = -2
    if (gameStarted ===false && bird.y <180) bird.fallingSpeed =0
    
    requestAnimationFrame(animate)
  }
  animate()
})