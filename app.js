// 貪吃蛇的畫布
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); // 會回傳一個 drawing context，作畫圖使用
const unit = 20;
let row;
let column;

// 在視窗大小改變時調整canvas大小
window.addEventListener("resize", setCanvasSize);
setCanvasSize();
function setCanvasSize() {
  // 設定canvas的寬度為螢幕寬度的0.9
  canvas.width = Math.floor((window.innerWidth * 0.9) / 320) * 320;
  // 設定canvas的高度為320的倍數，但不超過320
  canvas.height = Math.min(Math.ceil(window.innerHeight / 320) * 320, 320);
  // 計算行數和列數
  row = canvas.height / unit;
  column = canvas.width / unit;
}

// 製作蛇
let snake = [];
function createSnake() {
  //起始位置
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 果實物件
class Fruit {
  // 設定果實位置
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  // 將果實放在畫布上
  drawFruit() {
    ctx.fillStyle = "#e8bad8";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  // 選擇新的果實位置
  pickLocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// 位置方向設定
let direction = "Right";
function changeDirection(e) {
  if (e.key == "ArrowLeft" && direction !== "Right") {
    direction = "Left";
  } else if (e.key == "ArrowRight" && direction !== "Left") {
    direction = "Right";
  } else if (e.key == "ArrowUp" && direction !== "Down") {
    direction = "Up";
  } else if (e.key == "ArrowDown" && direction !== "Up") {
    direction = "Down";
  }
  // 防止在draw之前，有兩次按鍵的動作
  window.removeEventListener("keydown", changeDirection);
}
window.addEventListener("keydown", changeDirection);

// 初始化設定
createSnake();
let myFruit = new Fruit();
let score = 0;
let highScore;
document.getElementById("myScore").innerHTML = "Current Game Score : " + score;
loadHighestScore();
document.getElementById("highScore").innerHTML =
  "Highest Game Score : " + highScore;

// 執行畫布
function draw() {
  // 先確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  //每次執行時，都讓背景變黑，不然畫過的會一直留在上面
  ctx.fillStyle = "#050a0f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 畫果實
  myFruit.drawFruit();

  // 畫蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "#b23ed5";
    } else {
      ctx.fillStyle = "#93779c";
    }

    ctx.strokeStyle = "white";

    // 讓蛇不會超出畫布
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // x, y, width, height
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); // x, y, width, height
  }

  //決定蛇怎麼走
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (direction == "Left") {
    snakeX -= unit;
  } else if (direction == "Up") {
    snakeY -= unit;
  } else if (direction == "Right") {
    snakeX += unit;
  } else {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認有沒有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickLocation();
    score++;
    adjustInterval();
    setHighScore(score);
    document.getElementById("myScore").innerHTML =
      "Current Game Score : " + score;
    document.getElementById("highScore").innerHTML =
      "Highest Game Score : " + highScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

// 開始遊戲
let myGame = setInterval(draw, 100);

// 根據得分調整間隔時間
function adjustInterval() {
  console.log(score);
  if (score <= 10) {
    clearInterval(myGame);
    myGame = setInterval(draw, 90);
  } else if (score > 10) {
    clearInterval(myGame);
    myGame = setInterval(draw, 80);
  } else if (score > 20) {
    clearInterval(myGame);
    myGame = setInterval(draw, 70);
  } else if (score > 30) {
    clearInterval(myGame);
    myGame = setInterval(draw, 60);
  } else {
    clearInterval(myGame);
    myGame = setInterval(draw, 50);
  }
}

function loadHighestScore() {
  if (localStorage.getItem("highScore") == null) {
    highScore = 0;
  } else {
    highScore = Number(localStorage.getItem("highScore"));
  }
}

function setHighScore(score) {
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScore = score;
  }
}
