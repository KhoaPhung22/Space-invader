//board
let tileSize = 32;
let rows = 40;
let columns =16;

let board;
let boardWidth = tileSize*rows;
let boardHeight = tileSize*columns;
let context;
//ship
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize *rows/2-tileSize;
let shipY = tileSize*columns-tileSize*2;

let ship = {
    x:shipX,
    y:shipY,
    width:shipWidth,
    height:shipHeight
}
let shipImg;
let shipVelocityX = tileSize;
let shipVelocityY = tileSize;

//alien
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of aline to defeat
let alienVelocity = 1//aliens' movement speed
var myPix = new Array("./alien.png","./alien-cyan.png", "./alien-magenta.png", "./alien-yellow.png");

//bullets
let bulletArray = [];
let bulletVelocity = -10;//bullet moving speed

//score
let score = 0;
let gameover = false;

//sound
var shootSound = new Audio('shoot.wav');
var deathSound = new Audio('enemy-death.wav');
var backGroundMusic =new Audio('backgroundmusic.mp3');


window.onload = function(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    backGroundMusic.play();

    // context.fillStyle="blue";
    // context.fillRect(ship.x,ship.y,ship.width,ship.height);
    shipImg = new Image();
    
    shipImg.src = "./ship.png";
    shipImg.onload = function(){
        context.drawImage(shipImg,19,16,ship.width,ship.height);
    }
    alienImg = new Image();
    // alienImg.src = "./alien.png";
    
    var randomNum = Math.floor(Math.random()*myPix.length);
    alienImg.src = myPix[randomNum];
    createAlien();
 
    // alienImg.src ="./alien.png";
    // createAlien();


    requestAnimationFrame(update);
    document.addEventListener("keydown",moveShip);
    document.addEventListener("keyup",shoot);
    if(gameover){
        disPlayGameOver();
        return;
    }
}
function update(){
    requestAnimationFrame(update);
    if(gameover){
        disPlayGameOver();
        return;
    }

    context.clearRect(0,0,board.width,board.height);
    //ship
    context.drawImage(shipImg,ship.x,ship.y,ship.width,ship.height);
    //alien
    for(i = 0;i<alienArray.length;i++)
    {
        let alien =alienArray[i];
        if(alien.alive)
        {
            alien.x+=alienVelocity;

            if(alien.x + alien.width > board.width||alien.x <=0){
                alienVelocity*=-1;
            
            for(let j = 0;j<alienArray.length;j++)
            {
                alienArray[j].y+=alienHeight;
            }
        }
            
            context.drawImage(alienImg,alien.x,alien.y,alien.width,alien.height);
            if(alien.y >=ship.y&&(alien.x+32>=ship.x&&alien.x-32<=ship.x))
            {
                gameover = true;
                backGroundMusic.pause();
            }
        }
    }
    //bullet
    for(let i = 0;i<bulletArray.length;i++)
    {
       let bullet = bulletArray[i];
       bullet.y += bulletVelocity;
       context.fillStyle="red";
       context.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);

       //bullet collision
       for(let j = 0;j<alienArray.length;j++)
       {
        let alien = alienArray[j]; 
        if(!bullet.used&&alien.alive&&detectCollision(bullet,alien)){
            bullet.used = true;
            alien.alive = false;
            alienCount--;
            deathSound.play();
            score +=100;
        }
       }
    }
    //clear bullets
    while(bulletArray.length>0&&(bulletArray[0].used ||bulletArray[0].y<0))
    {
        bulletArray.shift();//remove the first bullet element
    }
//nextlevel
    if(alienCount == 0)
    {
        alienColumns = Math.min(alienColumns+1,columns/2-2);
        alienRows = Math.min(alienRows+1,rows-4);
        alienVelocity +=0.1;
        alienArray=[];
        bulletArray=[];
        randomNum = Math.floor(Math.random()*myPix.length);
        alienImg.src = myPix[randomNum];
       
        createAlien();
    }
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score,5,20);
 
}

function moveShip(e){
    if(gameover){
        return;
    }
    if(e.code =="ArrowLeft"&&ship.x - shipVelocityX>=0){
        ship.x -=shipVelocityX;
    }
    else if(e.code == "ArrowRight"&&ship.x + shipVelocityX+ship.width<=board.width){
        ship.x +=shipVelocityX;
    }
    else if(e.code =="ArrowUp"&&ship.y+shipHeight>alienY){
        ship.y-=shipVelocityY;
    }
    else if(e.code == "ArrowDown"){
        ship.y+=shipVelocityY;
    }

}
function createAlien(){
    for(let c = 0;c<alienColumns;c++)
    {
        for(let r = 0;r<alienRows;r++)
        {
            let alien = {
                img : alienImg,
                x:alienX + c*alienWidth,
                y :alienY +r*alienHeight,
                width:alienWidth,
                height:alienHeight,
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}
function shoot(e){
    if(gameover){
        return
    }
        if(e.code=="Space"){
            //shoot
            let bullet = {
                x:ship.x+shipWidth*15/32,
                y:ship.y,
                width:tileSize/8,
                height:tileSize/2,
                used:false
            }
            shootSound.play();
            bulletArray.push(bullet);
            
        }
}
function detectCollision(a,b){
    return a.x<b.x+b.width&&
    a.x+a.width>b.x&&
    a.y<b.y+b.height&&
    a.y+a.height>b.y;
} 
function disPlayGameOver()
{
    if (gameover==true) {
        const str = "GAME OVER";
        context.fillStyle = "white";
        context.font = "70px Arial";
        context.fillText(str,420,300);
      }
}