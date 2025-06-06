let canvas;
let player;
let playerImages = [];
let playerImagesUmbrella = [];
let playerHitImage;
let startPage = 1;

let umbrellas = [];
let umbrellaImage;
let heartImage;
let emptyHeartImage;

let dogs = [];
let dogImages = [];
let dogHitImage;
let black_dogs = [];
let black_dogImages = [];
// let black_dogHitImage;

let bgImage;
let treesLeft = [];
let treesRight = [];
let roadLines = [];
let treeImage, lineImage;

let lives = 10;
let gameStarted = false;
// let gameOver = false;
let gameOver = false;
let success = false;
let countdown = 3;
let buttonPressed = false;
let countdownTimer;
let gameTimer;
let timeLeft = 90;
let umbrellaCooldown = false;
let restartButton;
let pixelFont;

let startImage1;
let startImage2;
let preImage;
let preImage2;
let successImage;
let failImage;

let start_sound;
let dog_bark1;
let dog_bark2;
let dog_howl;
let dog_cry;
let get_sound;
let umbrella_sound;
let hurt_sound;
let click_sound;
let success_sound;
let fail_sound;
let endSoundPlayed = false;
let lastDogCryTime = 0;
const dogCryCooldown = 2000; // 3000 毫秒 = 3 秒




function preload() {
  playerImages[0] = loadImage("assets/player1.png");
  playerImages[1] = loadImage("assets/player2.png");
  playerImagesUmbrella[0] = loadImage('assets/player_umbrella1.png');
  playerImagesUmbrella[1] = loadImage('assets/player_umbrella2.png');
  playerHitImage = loadImage('assets/player_hit.png');
  dogImages[0] = loadImage("assets/dog1.png");
  dogImages[1] = loadImage("assets/dog2.png");
  black_dogImages[0] = loadImage("assets/black_dog1.png");
  black_dogImages[1] = loadImage("assets/black_dog2.png");
  dogHitImage = loadImage('assets/dog_hit.png');
  bgImage = loadImage("assets/street.png");
  umbrellaImage = loadImage('assets/umbrella.png');
  heartImage = loadImage('assets/heart.png');
  emptyHeartImage = loadImage('assets/heart_empty.png');

  startImage1 = loadImage('assets/start1.png');
  startImage2 = loadImage('assets/start2.png');
  preImage = loadImage('assets/preImage.png');
  preImage2 = loadImage('assets/preImage2.png');
  successImage = loadImage('assets/success.png');
  failImage = loadImage('assets/fail.png');

  treeImage = loadImage('assets/tree.png');
  lineImage = loadImage('assets/line.png');
  pixelFont = loadFont("assets/fonts/Cubic_11.ttf");

  dog_bark2 = loadSound('assets/dogs-barking.mp3');
  dog_bark1 = loadSound('assets/dog-bark.mp3');
  dog_howl = loadSound('assets/dog-howl.mp3');
  dog_cry = loadSound('assets/dog-cry.mp4');
  start_sound = loadSound('assets/race-start.mp3');
  get_sound = loadSound('assets/coin.mp3');
  hurt_sound = loadSound('assets/ough.mp3');
  umbrella_sound = loadSound('assets/umbrella.mp4');
  click_sound = loadSound('assets/point.mp3');
  success_sound = loadSound('assets/success.mp3');
  fail_sound = loadSound('assets/fail.mp3');
}

function setup() {
  canvas = createCanvas(1230, 700);
  textFont(pixelFont);
  textAlign(CENTER, CENTER);
  player = new Player();
  // startScreen();

  // 初始化左邊樹
  let yPos = 0;
  while (yPos < height) {
    treesLeft.push({ x: -200, y: yPos });
    yPos += random(150, 250); // 隨機間距
  }

  // 初始化右邊樹
  yPos = 0;
  while (yPos < height) {
    treesRight.push({ x: width - 250, y: yPos });
    yPos += random(150, 250);
  }

  // 初始化馬路中間的線
  for (let i = 0; i < 10; i++) {
    roadLines.push({ x: width / 2 - 30, y: i * 100});
  }
}

// function startScreen() {
//   let startButton = createButton("開始遊戲");
//   startButton.position(width / 2 - 20, height / 2 + 100);
//   startButton.mousePressed(() => {
//     buttonPressed = true;
//     startButton.remove();
//     startCountdown();
//   });
// }

function startCountdown() {
  start_sound.play();
  countdown = 3;

  countdownTimer = setInterval(() => {
    countdown--;
    if (countdown < 0) {
      clearInterval(countdownTimer);

      // 開始遊戲
      gameStarted = true;

      gameTimer = setInterval(() => {
        timeLeft--;

        // 90~50 秒：每5秒播放 dog_bark1
        if (timeLeft <= 90 && timeLeft > 30 && timeLeft % 5 === 0) {
          if (dog_bark1.isPlaying()) dog_bark1.stop();
          dog_bark1.play();
        }

        // 50~10 秒：每20秒播放 dog_bark2
        if (timeLeft <= 30 && timeLeft > 10 && timeLeft % 20 === 0) {
          if (dog_bark2.isPlaying()) dog_bark2.stop();
          dog_bark2.play();
        }

        // 10~0 秒：一次播放 dog_howl
        if (timeLeft === 10) {
          if (dog_howl.isPlaying()) dog_howl.stop();
          dog_howl.play();
        }

        // 遊戲結束
        if (timeLeft <= 0) {
          clearInterval(gameTimer);
          gameOver = true;
          success = true;
        }

      }, 1000);
    }
  }, 1000);
}




function resetGame() {
  lives = 10;
  dogs = [];
  black_dogs = [];
  player = new Player();
  // startScreen();

  // 要歸零的
  startPage = 1;
  lives = 10;
  gameStarted = false;
  gameOver = false;
  success = false;
  countdown = 3;
  buttonPressed = false;
  countdownTimer;
  gameTimer;
  timeLeft = 90;
  umbrellaCooldown = false;
  endSoundPlayed = false;
}

function draw() {
  image(bgImage, 0, 0, width, height);
  // image(playerImages[0], 0, 0, width, height);

  if (keyIsDown(LEFT_ARROW)) {
    player.x -= player.speed;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.x += player.speed;
  }

  let isHoveringNext = (mouseX >= 870 && mouseX <= 970 &&
    mouseY >= 520 && mouseY <= 540);
  let isHoveringStart = (mouseX >= 820 && mouseX <= 980 &&
      mouseY >= 500 && mouseY <= 540);
  let isHoveringRestart = (mouseX >= 1010 && mouseX <= 1180 &&
      mouseY >= 585 && mouseY <= 620)
    
  canvas.style('cursor', 'default');
  // if (isHoveringNext || isHoveringStart) {
  // canvas.style('cursor', 'pointer');
  // } else {
  // canvas.style('cursor', 'default');
  // }

  // fill(isHoveringNext ? 'red' : 0);
  // text("下一頁", 870, 520);

  // fill(isHoveringStart ? 'red' : 0);
  // text("開始遊戲", 820, 500);



  /////開頭的字
  if (!gameStarted && countdown > 0 && !buttonPressed && startPage === 1) {

    if (isHoveringNext) {
      canvas.style('cursor', 'pointer');
      } else {
      canvas.style('cursor', 'default');
      }
    image(preImage, 0, 0, width, height);
    image(startImage1, width/2 - width/3, height/2 - height/3, width/1.5, height/1.5);
    fill(isHoveringNext ? 'red' : 'white');
    textSize(32);
    text("next >", 920, 520);
    return;

  }
  else if (!gameStarted && countdown > 0 && !buttonPressed && startPage === 2) {
    if (isHoveringStart) {
      canvas.style('cursor', 'pointer');
      } else {
      canvas.style('cursor', 'default');
      }

    image(preImage, 0, 0, width, height);
    image(startImage2, width/2 - width/3, height/2 - height/3, width/1.5, height/1.5);
    fill(isHoveringStart ? 'red' : 'white');
    textSize(28);
    text("開始遊戲 >", 900, 520);
    return;
  }
  else if (!gameStarted && countdown > 0 && buttonPressed) {

    image(preImage2, 0, 0, width, height);
    textSize(64);
    fill(0);
    text(countdown, width / 2, height / 2);
    // console.log("倒數中")
    return;
  }
  else if (!gameStarted && countdown === 0) {

    image(preImage2, 0, 0, width, height);
    textSize(48);
    fill(0);
    text("開始！", width / 2, height / 2);
    return;
  }
  else if(gameStarted){

    /////移動的樹跟馬路線
    let sceneSpeed = 1.5;
  
    // 更新左邊樹
    for (let i = 0; i < treesLeft.length; i++) {
      let tree = treesLeft[i];
      image(treeImage, tree.x, tree.y, 420, 350);
      tree.y += sceneSpeed;
      tree.x -= 0.6;
      // console.log(treesLeft.length)
  
      if (tree.y > height) {
        // 重生時給隨機間距
        tree.y = -random(200, 250);
        tree.x = -50
      }
    }
  
    // 更新右邊樹
    for (let i = 0; i < treesRight.length; i++) {
      let tree = treesRight[i];
      image(treeImage, tree.x, tree.y, 420, 350);
      tree.y += sceneSpeed;
      tree.x += 0.6
  
      if (tree.y > height) {
        tree.y = -random(200, 250);
        tree.x = width - 400;
      }
    }
  
    // 更新虛線
    for (let line of roadLines) {
      image(lineImage, line.x, line.y, 80, 100);
      line.y += sceneSpeed;
  
      if (line.y > height) {
        line.y = -100;
      }
    }
  }

  textAlign(CENTER, CENTER);
  // textSize(40);
  // fill('white');

  if (gameOver) {
    dog_bark2.stop();
    if (!endSoundPlayed) {
      // 第一次 gameOver 進入時才播放一次音效
      if (success) {
        success_sound.play();
      } else {
        fail_sound.play();
      }
      endSoundPlayed = true; // 音效已播放
    }
    if(success){
      // success_sound.play();
      if (isHoveringRestart) {
        canvas.style('cursor', 'pointer');
        } else {
        canvas.style('cursor', 'default');
        }
      fill(isHoveringRestart ? 'red' : 'white');
      image(successImage, 0, 0, width, height);
      textSize(32);
      text("重新開始 >", 1100, 600);
      textSize(40);
      fill('white');
      text("成功抵達宿舍", width / 2, height / 2);
    } else {
      // fail_sound.play();
      if (isHoveringRestart) {
        canvas.style('cursor', 'pointer');
        } else {
        canvas.style('cursor', 'default');
        }
      fill(isHoveringRestart ? 'red' : 'white');
      image(failImage, 0, 0, width, height);
      textSize(32);
      text("重新開始 >", 1100, 600);
      textSize(40);
      fill('white');
      text("遊戲失敗", width / 2, height / 2);
    }
    
    // if (!restartButton) {
    //   restartButton = createButton("重新開始");
    //   restartButton.style('font-size', '18px');
    //   let buttonWidth = restartButton.width || restartButton.size().width;
    //   restartButton.position((width - buttonWidth) / 2, height / 2 + 60);

    //   restartButton.mousePressed(() => {
    //     restartButton.remove();
    //     restartButton = null;
    //     resetGame();
    //   });
    // }
    return;
  }


  // 更新遊戲狀態
  player.update();
  player.display();

  //加入關卡 遊戲進行越久狗越多
  if(timeLeft >=70){
    if (random(1) < 0.01) {
      dogs.push(new Dog());
      console.log('level1');
    }
  }
  else if(timeLeft >= 50 && timeLeft < 70){
    if (random(1) < 0.015) {
      dogs.push(new Dog());
      console.log('level2');

      //黑狗
      if (random(1) < 0.1){
        black_dogs.push(new black_Dog())
        console.log('黑狗出現')
      }
    }
  }
  else if(timeLeft >= 30 && timeLeft < 50){
    if (random(1) < 0.02) {
      dogs.push(new Dog());
      console.log('level3');

      //黑狗
      if (random(1) < 0.1){
        black_dogs.push(new black_Dog())
        console.log('黑狗出現')
      }
    }
  }
  else if(timeLeft >= 10 && timeLeft < 30){
    if (random(1) < 0.025) {
      dogs.push(new Dog());
      console.log('level4');

      //黑狗
      if (random(1) < 0.2){
        black_dogs.push(new black_Dog())
        console.log('黑狗出現')
      }
    }
  }
  else if(timeLeft < 10){
    if (random(1) < 0.08) {
      dogs.push(new Dog());
      console.log('level5');

      //黑狗
      if (random(1) < 0.5){
        black_dogs.push(new black_Dog())
        console.log('黑狗出現')
      }
    }
  }


  //隨機出現的傘
  if (random(1) < 0.015 && !umbrellaCooldown) {
    umbrellas.push(new Umbrella());
    umbrellaCooldown = true;
    setTimeout(() => umbrellaCooldown = false, 8000);
  }

  //dogs
  for (let i = dogs.length - 1; i >= 0; i--) {
    dogs[i].update();
    dogs[i].display();
    // dog_bark.play();
  
    if (dogs[i].hits(player)) {
      if (player.isUmbrellaActive) {
        console.log("雨傘抵擋攻擊");
        dogs[i].getHitByUmbrella(); // 執行「被傘撞飛」
        // dog_cry.play();

        // 撞飛音效：檢查 3 秒冷卻
        let now = millis();
        if (now - lastDogCryTime > dogCryCooldown) {
          dog_cry.play();
          lastDogCryTime = now;
        }
      } else {
        player.hit();
        hurt_sound.play();
        lives--;
        dogs.splice(i, 1);
        continue;
      }
    }
  
    // 撞飛完畢或飛出畫面就刪掉
    if (dogs[i].offscreen() || (dogs[i].hitByUmbrella && dogs[i].hitTimer <= 0)) {
      dogs.splice(i, 1);
    }
  }

  //black dogs
  for (let i = black_dogs.length - 1; i >= 0; i--) {
    black_dogs[i].update();
    black_dogs[i].display();
    // dog_howl.play();
  
    if (black_dogs[i].hits(player)) {
      if (player.isUmbrellaActive) {
        console.log("雨傘抵擋攻擊");
        black_dogs[i].getHitByUmbrella(); // 執行「被傘撞飛」
        // dog_cry.play();
      } else {
        player.hit();
        hurt_sound.play();
        lives--;
        black_dogs.splice(i, 1);
        continue;
      }
    }
  
    // 撞飛完畢或飛出畫面就刪掉
    if (black_dogs[i].offscreen() || (black_dogs[i].hitByUmbrella && black_dogs[i].hitTimer <= 0)) {
      black_dogs.splice(i, 1);
    }
  }
  /////
  

  for (let i = umbrellas.length - 1; i >= 0; i--) {
    let umbrella = umbrellas[i];
    umbrella.update();
    umbrella.display();
  
    if (umbrella.hits(player)) {
      // 撐傘邏輯已在 Umbrella 類內部處理，這裡不用再寫
      umbrellas.splice(i, 1); // 撞到後從陣列移除
      get_sound.play();
    } else if (umbrella.offscreen()) {
      umbrellas.splice(i, 1);
    }
  }
  
  // 生命 & 傘狀態
  // 顯示生命（愛心）
  let heartX = 80;
  let heartY = 10;
  let heartSize = 25;

  fill('white');
  textSize(24);
  textAlign(LEFT);

  text("生命: ", 10, 20);
  for (let i = 0; i < 10; i++) {
    if (i < lives) {
      image(heartImage, heartX + i * (heartSize + 5), heartY, heartSize, heartSize);
    } else {
      image(emptyHeartImage, heartX + i * (heartSize + 5), heartY, heartSize, heartSize);
    }
  }

  if (lives <= 0) {
    gameOver = true;
    clearInterval(gameTimer);
  } 

  // 顯示時間
  text("剩餘時間: " + timeLeft + "秒", 10, 55);

  // HUD: 顯示雨傘數
  let umbrellaX = 125;
  let umbrellaY = 75;
  let umbrellaSize = 30;

  text("可用道具: ", 10, 90);
  for (let i = 0; i < player.umbrellaCount; i++) {
    image(umbrellaImage, umbrellaX + i * (umbrellaSize + 5), umbrellaY, umbrellaSize, umbrellaSize);
  }

  if (player.isUmbrellaActive) {
    let secondsLeft = ceil(player.umbrellaTimer / 60);
    fill('blue');
    text(`雨傘啟動中：${secondsLeft} `, width/2 - 80, 60);
  }
  if(timeLeft < 10){
    // 計算 alpha 值，週期為 60 frames (1秒)
    let alpha = map(sin(frameCount * 0.2), -1, 1, 50, 255);
    fill(255, 0, 0, alpha);

    textAlign(CENTER, CENTER);
    textSize(40);
    text("注意!狗后召喚大量狗群!", width / 2, height / 2);
  }
}

/////

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 250;
    this.w = 280;
    this.h = 250;
    this.speed = 5;

    this.frame = 0;
    this.frameCounter = 0;

    this.isHit = false; // 是否被撞到
    this.hitTimer = 0;  // 被撞後的計時器

    // 傘相關
    this.umbrellaCount = 0;       // 擁有的雨傘數量
    this.isUmbrellaActive = false; // 是否啟用傘中
    this.umbrellaTimer = 0;        // 傘倒數計時（單位: frame）
  }

  update() {
    // 限制範圍
    this.x = constrain(this.x, 50, 900);

    // ➜ 更新 umbrellaTimer
    if (this.isUmbrellaActive) {
      this.umbrellaTimer--;
      if (this.umbrellaTimer <= 0) {
        this.isUmbrellaActive = false;
        this.umbrellaTimer = 0;
      }
    }

    // ➜ 更新 hitTimer
    if (this.isHit) {
      this.hitTimer--;
      if (this.hitTimer <= 0) {
        this.isHit = false;
      }
    } else {
      // 沒被撞，跑動畫
      this.frameCounter++;
      if (this.frameCounter > 10) {
        this.frame = (this.frame + 1) % this.getCurrentImages().length;
        this.frameCounter = 0;
      }
    }
  }

  display() {
    let w = this.w;
    let h = this.h;

    // ➜ 如果傘有啟用，變大
    if (this.isUmbrellaActive) {
      w *= 1.2;
      h *= 1.2;
    }

    let offsetX = (w - this.w) / 2;
    let offsetY = (h - this.h) / 2;

    if (this.isHit) {
      // ➜ 被撞
      image(playerHitImage, this.x - offsetX, this.y - offsetY, w, h);
    } else {
      // ➜ 沒被撞，顯示正常動畫
      const currentImages = this.getCurrentImages();
      if (currentImages[this.frame]) {
        image(currentImages[this.frame], this.x - offsetX, this.y - offsetY, w, h);
      }
    }
  }

  move(dir) {
    this.x += dir * this.speed;
  }

  getCurrentImages() {
    return this.isUmbrellaActive ? playerImagesUmbrella : playerImages;
  }

  // ➜ 被撞
  hit() {
    this.isHit = true;
    this.hitTimer = 30; // 約 0.5 秒
  }

  // ➜ 按空白鍵啟用傘（只在這裡做 umbrellaTimer 5 秒倒數）
  activateUmbrella() {
    if (this.umbrellaCount > 0 && !this.isUmbrellaActive) {
      this.isUmbrellaActive = true;
      this.umbrellaCount--;    // 使用一把雨傘
      this.umbrellaTimer = 300; // 5 秒 (60fps)

      console.log("使用雨傘抵禦狗狗！");
    }
  }
}



class Dog {
  constructor() {
    this.x = random(150, 950);
    this.y = -40;
    this.w = 140;
    this.h = 210;
    this.speed = 3;
    this.frame = floor(random(2));
    this.frameCounter = 0;

    this.isHit = false; // 被撞的狀態（顯示 dog_hit.png）
    this.hitTimer = 0;  // 計時器
    this.hitByUmbrella = false; // 是否被傘撞到
  }

  update() {
    // 如果被傘撞到，往上移動
    if (this.hitByUmbrella) {
      this.y -= 5; // 速度可以調整
      this.hitTimer--;
    } else {
      // 正常往下掉落
      this.y += this.speed;
    }

    this.frameCounter++;
    if (this.frameCounter > 10) {
      this.frame = (this.frame + 1) % dogImages.length;
      this.frameCounter = 0;
    }
  }

  display() {
    let img;
    if (this.isHit) {
      img = dogHitImage;
    } else {
      img = dogImages[this.frame];
    }

    if (img) {
      image(img, this.x, this.y, this.w, this.h);
    }
  }

  hits(player) {
    // 縮小碰撞框
    let shrink = 0.2;
    let playerX = player.x + player.w * shrink / 2;
    let playerY = player.y + player.h * shrink / 2;
  
    // 根據是否撐傘，決定碰撞寬度
    let playerW;
    if (player.isUmbrellaActive) {
      // 撐傘時，寬度比較大
      playerW = player.w * 0.8;
    } else {
      // 不撐傘時，維持 0.5
      playerW = player.w * 0.5;
    }
  
    let playerH = player.h * (1 - shrink);
  
    let dogX = this.x + this.w * shrink / 2;
    let dogY = this.y + this.h * shrink / 2;
    let dogW = this.w * (1 - shrink);
    let dogH = this.h * (1 - shrink);
  
    return collideRectRect(dogX, dogY, dogW, dogH, playerX, playerY, playerW, playerH);
  }
  

  offscreen() {
    return this.y > height || this.y < -this.h; // 加上「往上飛出畫面」也算消失
  }

  // 撞到傘後執行
  getHitByUmbrella() {
    this.isHit = true;
    this.hitByUmbrella = true;
    this.hitTimer = 15; // 撞飛時間（大概 0.25 秒）
  }
}

//黑狗
class black_Dog {
  constructor() {
    this.x = random(150, 950);
    this.y = -40;
    this.w = 140;
    this.h = 210;
    this.speed = 5;
    this.frame = floor(random(2));
    this.frameCounter = 0;

    this.isHit = false; // 被撞的狀態（顯示 dog_hit.png）
    this.hitTimer = 0;  // 計時器
    this.hitByUmbrella = false; // 是否被傘撞到
  }

  update() {
    // 如果被傘撞到，往上移動
    if (this.hitByUmbrella) {
      this.y -= 5; // 速度可以調整
      this.hitTimer--;
    } else {
      // 正常往下掉落
      this.y += this.speed;
    }

    this.frameCounter++;
    if (this.frameCounter > 10) {
      this.frame = (this.frame + 1) % black_dogImages.length;
      this.frameCounter = 0;
    }
  }

  display() {
    let img;
    if (this.isHit) {
      img = dogHitImage;
    } else {
      img = black_dogImages[this.frame];
    }

    if (img) {
      image(img, this.x, this.y, this.w, this.h);
    }
  }

  hits(player) {
    // 縮小碰撞框
    let shrink = 0.2;
    let playerX = player.x + player.w * shrink / 2;
    let playerY = player.y + player.h * shrink / 2;
  
    // 根據是否撐傘，決定碰撞寬度
    let playerW;
    if (player.isUmbrellaActive) {
      // 撐傘時，寬度比較大
      playerW = player.w * 0.8;
    } else {
      // 不撐傘時，維持 0.5
      playerW = player.w * 0.5;
    }
  
    let playerH = player.h * (1 - shrink);
  
    let dogX = this.x + this.w * shrink / 2;
    let dogY = this.y + this.h * shrink / 2;
    let dogW = this.w * (1 - shrink);
    let dogH = this.h * (1 - shrink);
  
    return collideRectRect(dogX, dogY, dogW, dogH, playerX, playerY, playerW, playerH);
  }
  

  offscreen() {
    return this.y > height || this.y < -this.h; // 加上「往上飛出畫面」也算消失
  }

  // 撞到傘後執行
  getHitByUmbrella() {
    this.isHit = true;
    this.hitByUmbrella = true;
    this.hitTimer = 15; // 撞飛時間（大概 0.25 秒）
  }
}


class Umbrella {
  constructor() {
    this.x = random(150, 950);
    this.y = -20;
    this.w = 140; // 擴大雨傘圖片的可視範圍
    this.h = 140;
    this.speed = 2;
    this.active = true; // 防止重複啟動
  }

  update() {
    this.y += this.speed;
  }

  display() {
    if (umbrellaImage) {
      image(umbrellaImage, this.x, this.y, this.w, this.h);
    } else {
      fill(0, 200, 200);
      ellipse(this.x + 10, this.y + 10, this.w, this.h);
    }
  }

  hits(player) {
    if (this.active && collideRectRect(this.x, this.y, this.w, this.h, player.x, player.y, player.w, player.h)) {
      this.active = false;
      player.umbrellaCount++; // 收集到一把雨傘
      return true;
    }
    return false;
  }
  
  offscreen() {
    return this.y > height;
  }
}

function keyPressed() {
  if (key === ' ') {
    player.activateUmbrella();
    umbrella_sound.play();
  }
}

// function mousePressed() {
//   console.log("Mouse clicked at:", mouseX, mouseY);
// }

function mousePressed() {
  console.log("Mouse clicked at:", mouseX, mouseY);

  if(startPage === 1){
    if (!gameStarted) {
      // 確認是否點到 下一頁 區域
      if (
        mouseX >= 870 &&
        mouseX <= 970 &&
        mouseY >= 520 &&
        mouseY <= 540
      ) {
        click_sound.play();
        startPage = 2;
        // buttonPressed = true;
        // startCountdown();
      }
    }
  }
  else if(startPage === 2){
    if (!gameStarted) {
      // 確認是否點到 開始遊戲 區域 790 500, 965 500, 965 530, 790 530
  
      if (
        mouseX >= 820 &&
        mouseX <= 980 &&
        mouseY >= 500 &&
        mouseY <= 540
      ) {
        // click_sound.play();
        buttonPressed = true;
        startCountdown();
      }
    }
  }
  if(gameOver === true){
    if (
      mouseX >= 1010 &&
      mouseX <= 1180 &&
      mouseY >= 585 &&
      mouseY <= 620
    ) {
      resetGame();
    }
  }
}


