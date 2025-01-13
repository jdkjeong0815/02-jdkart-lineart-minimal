// jdk - 2025sus 1

// 매 10초마다 업데이트
// 랜덤 타입
// 1) 컬러 팔레트  2) Shape 타입  3) 배경: 단색, 그라디언트


let colors;
let colorData;
let shapeType;

function preload() {
  // Load color data from external JSON file
  colorData = loadJSON("colors.json");
}

function setup() {
  //createCanvas(1040, 1040);
  createCanvas(windowWidth, windowHeight);
  colors = [];
  noLoop(); // `draw`는 명시적으로 호출될 때만 실행
  // Select a random set of colors from the JSON data
  selectPalette();
  draw();
  // let keys = Object.keys(colorData);
  // let randomKey = random(keys);
  // console.log("Selected color set: " + randomKey); // Log the selected set
  // colorData[randomKey].forEach(hex => {
  //   let col = color(hex); // Convert hex to color
  //   //col.setAlpha(128);  // Set alpha for transparency
  //   colors.push(col);
  // });

  // 10초마다 업데이트
  setInterval(() => {
    clear();
    selectPalette();
   
    redraw();
  }, 30000);

  
}

function selectPalette() {
    // Select a random set of colors from the JSON data
  colors = [];
  let keys = Object.keys(colorData);
  let randomKey = random(keys);
  console.log("Selected color set: " + randomKey); // Log the selected set
  colorData[randomKey].forEach(hex => {
    let col = color(hex); // Convert hex to color
    //col.setAlpha(128);  // Set alpha for transparency
    colors.push(col);
  });
  
  // 셰입 선택 - 라인 / 일립스 
  if (random() < 0.5) { 
    shapeType = "line";
  } else {
    shapeType = "ellipse";
  }
  
}


function draw() {
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = random(35, 135); // 초기 반지름
  let angleIncrement = PI / random(5, 5); // 각도 증가량
  let maxRadius = sqrt(sq(width / 2) + sq(height / 2)); // 대각선 거리 계산하여 최대 반지름 설정

  // 배경 선택
  if (random() < 0.5) { 
    background(random(0, 255));   // 단색 배경
  } else {
    drawHSLGradientBackground();  // 그라디언트 배경
  }

  while (radius < maxRadius) {
    let angle = radius * angleIncrement;
    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);

    // 스파이럴 안에 있는 점만 칠함
    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      let brushColor = random(colors);
      watercolorBrush(x, y, brushColor);
    }

    // 반지름 증가 / 점 간격 조정
    radius += 10;  // default: 10
  }
}  // Draw() END

function watercolorBrush(x, y, c) {
  let randomNum = random(0, 300);
  push();
    noStroke();
    for (let i = 0; i < 500; i++) {
      let offsetX = random(-50, 50);
      let offsetY = random(-50, 50);
      let alpha = random(50, 150); // Random alpha value for scratch effect
      // Create a new color with transparency
      // let brushColorWithAlpha = color(c.levels[0], c.levels[1], c.levels[2], alpha);
      // fill(brushColorWithAlpha); // Apply the color with alpha
      c.setAlpha(alpha);
      fill(c);
      //console.log("c: ", c);
      
      let lineWidth = random(1, 15); // Random line thickness
      let lineLength = random(55, 855);
      let angle = random(TWO_PI/random(1, 35));
      //console.log(offsetX, offsetY, alpha, lineWidth, lineLength, angle); 
      
      // let randomNum = random(0, 300);
      translate(x + offsetX + randomNum, y + offsetY + randomNum);
      rotate(angle);

      // 셰입 선택 - 라인 / 일립스 
      if (shapeType == "line") { 
        rect(0, 0, lineLength, lineWidth); // Draw small lines for scratch effect
      } else {
        ellipse(0, 0, lineLength, lineWidth); // 타원으로 브러시 변경
      }
      resetMatrix();
    }
  pop();
}

function drawHSLGradientBackground() {
  colorMode(HSL, 360, 100, 100);

  let gradientType = random() < 0.5 ? "linear" : "radial"; // 랜덤으로 선형 또는 래디얼 선택

  if (gradientType === "linear") {
    // 랜덤 방향의 선형 그라디언트 설정
    let x1, y1, x2, y2;
    let direction = floor(random(4)); // 0: top-to-bottom, 1: left-to-right, 2: diagonal1, 3: diagonal2

    if (direction === 0) {
      x1 = 0; y1 = 0; x2 = 0; y2 = height;
    } else if (direction === 1) {
      x1 = 0; y1 = 0; x2 = width; y2 = 0;
    } else if (direction === 2) {
      x1 = 0; y1 = 0; x2 = width; y2 = height;
    } else if (direction === 3) {
      x1 = width; y1 = 0; x2 = 0; y2 = height;
    }

    let gradient = drawingContext.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, 'hsl(0, 0%, 0%)');
    gradient.addColorStop(1, 'hsl(0, 0%, 80%)');
    drawingContext.fillStyle = gradient;

  } else {
    // 래디얼 그라디언트 설정
    let cx = width / 2;
    let cy = height / 2;
    let r1 = 0;
    let r2 = max(width, height) / 2;

    let gradient = drawingContext.createRadialGradient(cx, cy, r1, cx, cy, r2);
    gradient.addColorStop(0, 'hsl(0, 0%, 80%)'); // 중심부 밝은 색
    gradient.addColorStop(1, 'hsl(0, 0%, 0%)'); // 외곽 어두운 색
    drawingContext.fillStyle = gradient;
  }

  // 배경 채우기
  rect(0, 0, width, height);
  
  // color 모드 변경 to RGB. 없으면 투명 효과가 사라짐
  colorMode(RGB);
}


// function drawHSLGradientBackground() {
//   colorMode(HSL, 360, 100, 100);

//   let x1, y1, x2, y2;
//   let direction = floor(random(4)); // 0: top-to-bottom, 1: left-to-right, 2: diagonal1, 3: diagonal2

//   if (direction === 0) {
//     // Top-to-bottom
//     x1 = 0; y1 = 0; x2 = 0; y2 = height;
//   } else if (direction === 1) {
//     // Left-to-right
//     x1 = 0; y1 = 0; x2 = width; y2 = 0;
//   } else if (direction === 2) {
//     // Diagonal (top-left to bottom-right)
//     x1 = 0; y1 = 0; x2 = width; y2 = height;
//   } else if (direction === 3) {
//     // Diagonal (top-right to bottom-left)
//     x1 = width; y1 = 0; x2 = 0; y2 = height;
//   }

//   // Create gradient
//   let gradient = drawingContext.createLinearGradient(x1, y1, x2, y2);
//   gradient.addColorStop(0, 'hsl(0, 0%, 0%)');
//   gradient.addColorStop(0.6, 'hsl(0,0%,51%)');
//   gradient.addColorStop(1, 'hsl(0, 0%, 100%)');
//   drawingContext.fillStyle = gradient;

//   // Draw the gradient background
//   rect(0, 0, width, height);
// }


// function drawHSLGradientBackground() {
//   colorMode(HSL, 360, 100, 100);
//   let gradient = drawingContext.createLinearGradient(0, 0, width, height);
//   gradient.addColorStop(0, 'hsl(0,0%,0%)');
//   gradient.addColorStop(1, 'hsl(0, 0%, 80%)');
//   drawingContext.fillStyle = gradient;
//   rect(0, 0, width, height);
  
// }





