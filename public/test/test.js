let player_img;
let player2_img;
let player_sprite;

let street_img;

let plant_sprite;
let plant_img;

let life = 5; // 初始化分數為 10
let isOverlapping = false; // 記錄當前是否處於重疊狀態

let timer = 30; // 初始化計時器為 60 秒
let lastTimerUpdate = 0; // 記錄上次更新計時器的時間

let jumpStartTime = 0; // 記錄空白鍵按下的時間
let isJumping = false; // 是否處於跳躍狀態
let press = false;
let currentVelocity;



function preload(){
    player_sprite = createSprite(80, 300);
    player_img = loadAnimation('../assets/player.png');
    player2_img = loadAnimation('../assets/player2.png');
    player_sprite.addAnimation('player', player_img);
    player_sprite.addAnimation('player back', player2_img);
    player_sprite.addAnimation('explode', loadImage('../assets/explode.png'));

    street_img = loadImage('../assets/street.jpg');

    plant_sprite = createSprite(300, 350);
    plant_img = loadImage('../assets/plant.png');
    plant_sprite.addImage('plant', plant_img);
   
}

let plant_x = 200;

function setup() {
    createCanvas(800, 400);
    background('gray');
    imageMode(CORNER);

    //植物
    plant_sprite.scale = 0.1;

    //玩家
    player_sprite.scale = 0.2;

    // 获取当前速度
    currentVelocity = player_sprite.velocity;
    currentVelocity.x = 0;
    currentVelocity.y = 0; 
}


function draw() {

     //背景
     image(street_img, 0, 0);

     // 更新計時器
    let currentTime = millis(); // 取得當前時間
    if (currentTime - lastTimerUpdate >= 1000 && timer > 0) { // 每秒更新一次
        timer--; // 倒數一秒
        lastTimerUpdate = currentTime; // 更新上次計時器更新的時間
    }

    // 顯示計時器
    fill(255); // 設定文字顏色為白色
    textSize(32);
    text('Time: ' + timer, 10, 40); // 在畫面左上方顯示計時器
    
    // 顯示分數
    fill(255); // 設定文字顏色為白色
    textSize(32);
    text('Life: ' + life, 10, 100); // 在畫面左上方顯示分數
    
    
    // 顯示遊戲結束
    if(life == 0){
        fill(255); // 設定文字顏色為白色
        textSize(80);
        text('Game Over', 180, 200); // 在畫面左上方顯示分數
        timer = 0;
    }
   else if(timer == 0 && life != 0){
        fill(255); // 設定文字顏色為白色
        textSize(80);
        text('YOU WIN', 180, 200); // 在畫面左上方顯示分數
    }


    // 玩家控制
    if (keyIsDown(RIGHT_ARROW)) {
        player_sprite.changeImage('player'); 
        player_sprite.setVelocity(5, currentVelocity.y);
        // isJumping = false; // 停止跳躍
    } else if (keyIsDown(32)) { // 空白鍵
        if (!isJumping) { // 如果不在跳躍狀態
            player_sprite.setVelocity(0, -5);
            jumpStartTime = millis(); // 記錄開始跳躍的時間
            isJumping = true; // 設定為跳躍狀態
            press = true;
        }
    } else if (keyIsDown(LEFT_ARROW)) {  
        player_sprite.changeImage('player back'); 
        player_sprite.setVelocity(-5, currentVelocity.y);
        // isJumping = false; // 停止跳躍
    }else if (keyIsDown(DOWN_ARROW)) {  
        // player_sprite.changeImage('player back'); 
        player_sprite.setVelocity(currentVelocity.x, 2);
        // isJumping = false; // 停止跳躍 
    }else {            
        player_sprite.setVelocity(0, 0);
        press = false;
    }

    let duration = millis() - jumpStartTime;
    

    // 檢查跳躍時間是否超過1秒
    if (isJumping && duration >= 800) {
        player_sprite.setVelocity(currentVelocity.x, 5); // 向下移動
       
        setTimeout(() => {
            player_sprite.setVelocity(currentVelocity.x, 0); // 停止移動，回到原來位置後
            // player_sprite.setPosition(300, 350);
            
            isJumping = false; // 重置跳躍狀態
        }, 800); // 0 毫秒表示這個操作會在當前調用堆棧清空後執行
        
    }else if(isJumping && duration < 800 && !press){
        player_sprite.setVelocity(currentVelocity.x, 5); // 向下移動
       
        setTimeout(() => {
            player_sprite.setVelocity(currentVelocity.x, 0); // 停止移動，回到原來位置後
            // player_sprite.setPosition(300, 350);
            
            isJumping = false; // 重置跳躍狀態
        }, duration); // 0 毫秒表示這個操作會在當前調用堆棧清空後執行
    }


    // player_sprite.collide(plant_sprite);

    if (player_sprite.overlap(plant_sprite)) {
        player_sprite.changeImage('explode');
        if (isOverlapping == false) { // 前一秒還沒overlap
            if (life > 0) {
                life--;
            }
            isOverlapping = true; // 設置為重疊狀態
        }
    } else{
        // player_sprite.changeAnimation('player');
        isOverlapping = false; // 離開重疊狀態
    }

    drawSprites();
    
    // console.log(jumpStartTime);
    // console.log(millis());
    
}
