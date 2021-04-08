const COUNTRIES = [
  "Argentina",
  "Bolivia (Plurinational State of)",
  "Brazil",
  "Ecuador",
  "Guyana",
  "Colombia",
  "Paraguay",
  "Peru",
];

const CANVAS_SIZE = 800;
const MAX_RADIUS = 380;
let CENTER;

let table;

function preload() {
  table = loadTable("data/forest2.csv", "tsv", "header");
}

function setup() {
  // c1 = color(34,193,195);
  // c2 = color(253,187,45);

  print(table.getRowCount() + " total rows in table");
  print(table.getColumnCount() + " total columns in table");
  print(table);

  // Setup
  createCanvas(CANVAS_SIZE, CANVAS_SIZE, SVG);
  CENTER = createVector(width / 2, height / 2);

  // Background
  background(40);

  // Spider
  drawSpiderWeb();

  let values;

//   stroke("SkyBlue");
//   noFill();
//   values = COUNTRIES.map((country) => getVal(country, "2000 Proportion SDG") / 100);
//   drawCurve(values);

//   stroke("SteelBlue");
//   noFill();
//   values = COUNTRIES.map((country) => getVal(country, "2010 Proportion SDG") / 100);
//   drawCurve(values);

  stroke("SlateBlue");
  fill("Indigo");
  values = COUNTRIES.map((country) => getVal(country, "2020 Proportion SDG") / 100);
  drawCurve(values);

  addLabels();
}

function addLabels() {
  // text aligment setting
  textAlign(CENTER, CENTER);

  COUNTRIES.forEach((country, index) => {
    // calculate angle & point
    const angle = TWO_PI * (index / COUNTRIES.length);
    const p = createVector(sin(angle), -cos(angle)).mult(MAX_RADIUS * 0.75);
    // draw rotated text at position
    push();
    translate(CENTER.x + p.x, CENTER.y + p.y);
    rotate(angle - PI / 2);
    text(country, 0, 0);
    pop();
  });
}

function drawCurve(values) {
  // Settings
  strokeWeight(3);
  // curveTightness(-0.5)

  const points = getSpiderPoints(values);
  const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];
  console.log("🚀 ~ file: sketch.js ~ line 83 ~ drawCurve ~ curvePoints", curvePoints);

  drawInterPoints(points)

  beginShape();
  curvePoints.forEach((point) => {
    curveVertex(point.x, point.y);
  });
  endShape();

  points.forEach((point) => {
    noStroke();
    fill(255);
    ellipse(point.x, point.y, 10, 10);
  });
}

function getSpiderPoints(values) {
  return values.map((val, index) => {
    const angle = TWO_PI * (index / values.length);
    const unitVec = createVector(sin(angle), -cos(angle));
    const pos = unitVec.mult(MAX_RADIUS).mult(val);
    return createVector(CENTER.x + pos.x, CENTER.y + pos.y);
  });
}

function drawInterPoints(points){
   

    const t1 = performance.now()
    for (let i of range(0,100000000)){
     
    }
    // for(let i = 0; i <= 100000000; i++){

    // }
    const t2 = performance.now()
    console.log('time', t2-t1)

    
}

function getInterPoint(points, t){
    const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];
    map
}

function getArea(a, b, c) {
  return Math.sqrt((a + b + c) * (a + b - c) * (b + c - a) * (c + a - b)) / 4;
}

function drawSpiderWeb() {
  noFill();
  strokeWeight(1);
  stroke(150);

  const RINGS = 2;
  const step = MAX_RADIUS / RINGS;

  for (let r = 0; r <= MAX_RADIUS; r += step) {
    ellipse(width / 2, height / 2, r * 2, r * 2);
  }
}

function getVal(regionName, valueName) {
  const row = table.findRow(regionName, "Region");
  return row.getNum(valueName);
}

function keyPressed() {
  if (key === "S") {
    save();
  }
}

function* range(start, end, stepSize) {
    stepSize = stepSize ? stepSize : 1
    let steps = (end - start) / stepSize
    for(let i = 0; i<= steps; i++){
        yield i * stepSize + start;
    }
}

function* range(start, end, stepSize) {
    stepSize = stepSize ? stepSize : 1
    let steps = (end - start) / stepSize
    for(let i = 0; i<= steps; i++){
        yield i * stepSize + start;
    }
}


