let data;
let theta;
let current = 0;
let sectionSize;
let size = 125;
let colors = [];
let spinning = false;
let spinButton, removeButton;
let CCDIV;
let backC, prevC;
let selected;
let total
let prevTheta = 0;
let numbers = [];
let selectedIndex = 0;

const mouse = () => createVector(mouseX - width / 2, mouseY - height / 2);
const pmouse = () => createVector(pmouseX - width / 2, pmouseY - height / 2);

function preload() {
  data = loadJSON("assets/data.json", (j)=>total=Number(j.length));
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  size = (height * .8) / 4
  //total = data.rows.length;
  numbers = [...Array(total).keys()].map(val => val + 1);
  sectionSize = (TWO_PI / total);
  current = random(TWO_PI);
  theta = 0

  spinButton = createButton("Spin The Wheel").mousePressed(() => {
    if (!spinning) {
      let force = random(0.4, 0.5);
      
      if (random(1) > 0.5)
        force *= -1;
      
      theta += force;
    }
    spinning = true;
  }).addClass("button").position(20, windowHeight - 40);
  removeButton = createButton("Remove Selected").mousePressed(() => {
    total--;
    // print(selectedIndex);
    (numbers.splice(selectedIndex, 1)[0]);
    sectionSize = (TWO_PI / total);
    loadColors();
  }).addClass("button").position(20, windowHeight - 70);;
  CCDIV = createDiv("copy of <a href = 'http://shiffman.github.io/randomizer/spin/index.html?id=-Lpud6LpelY04t5yqzny' target=_blank>Class Randomizer</a> by Dan Shiffman")
  CCDIV.position(windowWidth - CCDIV.width - 10, windowHeight - CCDIV.height - 10);
  loadColors();
  backC = color(51);
}

function mouseReleased() {
  if (mouse().mag() < size*2) {
    var h1 = mouse().heading();
    var h2 = pmouse().heading();
    var mag = h1 - h2;
    mag = constrain(mag, -0.5, 0.5);
    theta = mag;
  }
}

function draw() {
  if (prevC) {
    backC = lerpColor(backC, prevC, .04);
  }

  if (backC); {
    backC.setAlpha(200);
    background(backC);
  }
  translate(width / 2, height / 2);
  stroke(255);
  fill(190);
  noStroke();
  fill(255);
  strokeWeight(1);
  if (mouseIsPressed) {
    if (mouse().mag() < size * 2) {
      current = angleLerp(current, mouse().heading() + (TWO_PI), .25);
      current %= TWO_PI;
      // theta = mouse().heading();
    }

  }
  // current += constrain(radians(theta - current), -QUARTER_PI / 4, QUARTER_PI / 4);
  current += theta;
  
  theta *= .99
  
  if (theta < 0.001 && theta > -0.001) {theta = 0; spinning = false}
  
  current %= TWO_PI;


  if (similar(current, theta, .01)) {
    spinning = false;
    // current = theta;
  }

  strokeWeight(8);
  stroke(360);


  fill((190));

  circle(0, 0, size * 4, size * 4);
  drawArcs();
  drawSpinner();

}

function drawSpinner() {
  let spinner = (size * 4) * .35
  strokeWeight(1);
  rotate(current);

  stroke(255);
  fill(255);
  strokeWeight(8);
  line(-spinner, -0, spinner, 0);
  strokeWeight(1);
  circle(0, 0, 20);
  fill(0);
  circle(0, 0, 5);
  fill(255);

  push();
  translate(spinner - 5, 0);
  rotate(QUARTER_PI);
  triangle(7.5, 7.5, 15, -15, -7.5, -7.5);
  pop();

  rectMode(CENTER);
  rect(-spinner, 0, 16, 16);
}


function drawArcs() {
  for (let i = 0; i < total; i++) {
    push();
    let t = ((i) / total) * TWO_PI;
    let prev = t - sectionSize;
    rotate(t);
    let c = colors[i];
    c.setAlpha(255);
    let cot = current + (120 * TWO_PI);
    let me = ((cot) % TWO_PI) - sectionSize;
    let txtSize = 15;
    let sw = 4;
    let astroke = 1;
    let strokeCol = 200;
    let thisSize = size;


    if (me > prev && me < t) {
      prevC = c;
      selectedIndex = i;
      c.setAlpha(190);
      txtSize = 25;
      thisSize += 7;
      sw = 6;
      astroke = 4;
      strokeCol = color(0, 0, 0, 0);
    }
    textSize(txtSize);
    push();
    textAlign(CENTER, CENTER);
    rotate(-QUARTER_PI);
    let txt = numbers[i];
    let n = 0;
    if (typeof(txt) == 'string') {
      n = txt.length * 2 + (txtSize) + 2;
      if (str(int(txt)) == txt) n = txt.length * 2;
    }
    // print(txt.length);

    rotate(sectionSize / 2);
    translate(size * 1.6 + n, size * 1.6 + n);
    rotate(-QUARTER_PI);
    rotate(PI);
    rotate(HALF_PI);
    // rotate(t);
    stroke(0);
    strokeWeight(sw);
    fill(255);

    text(txt, 0, 0);
    pop();
    fill(c);
    stroke(strokeCol);
    strokeWeight(astroke);
    arc(0, 0, thisSize * 4, thisSize * 4, 0, sectionSize, PIE);
    pop();
  }
}


function similar(a, b, epsilon = .01) {
  return abs(a - b) <= epsilon;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function shortAngleDist(a0, a1) {
  let max = TWO_PI;
  let da = (a1 - a0) % max;
  return 2 * da % max - da;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function angleLerp(a0, a1, t) {
  return a0 + shortAngleDist(a0, a1) * t;
}

function loadColors() {
  // TODO: set better colors with RGB
  colors = [];
  var rainbowColors = [
    createVector(0, 0, 0).set(color('red').levels),
    createVector(0, 0, 0).set(color('orange').levels),
    createVector(0, 0, 0).set(color('yellow').levels),
    createVector(0, 0, 0).set(color('green').levels),
    createVector(38, 58, 150), // blue
    createVector(0, 0, 0).set(color('indigo').levels),
    createVector(0, 0, 0).set(color('violet').levels)
  ];
  for (var i = 0; i < total; i++) {
    var colorPosition = i / total;
    var scaledColorPosition = colorPosition * (rainbowColors.length - 1);

    var colorIndex = floor(scaledColorPosition);
    var colorPercentage = scaledColorPosition - colorIndex;
    // print(colorPercentage);

    var nameColor = p5.Vector.lerp(
      rainbowColors[colorIndex],
      rainbowColors[colorIndex + 1],
      colorPercentage
    );
    colors.push(color(nameColor.x, nameColor.y, nameColor.z))
  }
}
