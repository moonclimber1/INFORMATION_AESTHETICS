const REGIONS = ["Argentina", "Bolivia (Plurinational State of)", "Brazil", "Ecuador", "Guyana", "Colombia", "Paraguay", "Peru"];

const CANVAS_SIZE = 800;
const MAX_RADIUS = 380;
let CENTER;

let table;

function preload() {
  table = loadTable("data/forest2.csv", "tsv", "header");
}

function setup() {

  // Setup
  createCanvas(CANVAS_SIZE, CANVAS_SIZE, SVG);
  CENTER = createVector(width / 2, height / 2);

  // Background
  background(40);

  // // Spider
  // drawSpiderWeb();

  // let values;

  const spider1 = new CakeSpider(1);
  const spider2 = new CakeSpider(2);
  spider2.val = 77;

  spider1.draw();
  spider2.draw();

  // console.log("🚀 ~ file: sketch2.js ~ line 28 ~ setup ~ spider", spider)
  // spider.draw();
}

function addLabels() {
  // text aligment setting
  noStroke();
  textAlign(CENTER, CENTER);

  REGIONS.forEach((country, index) => {
    // calculate angle & point
    const angle = TWO_PI * (index / REGIONS.length);
    const p = createVector(sin(angle), -cos(angle)).mult(MAX_RADIUS * 0.75);

    // draw spider line
    strokeWeight(1);
    stroke(150);
    line(CENTER.x, CENTER.y, CENTER.x + p.x, CENTER.y + p.y);

    // draw rotated text at position
    push();
    translate(CENTER.x + p.x, CENTER.y + p.y);
    rotate(angle - PI / 2);
    text(country, 0, 0);
    pop();
  });
}

function drawCurve(points) {
  const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];
  console.log("🚀 ~ file: sketch.js ~ line 83 ~ drawCurve ~ curvePoints", curvePoints);

  // Settings
  strokeWeight(3);
  // curveTightness(-0.5)

  noFill();
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

  //   drawInterPoints(points)
}

function drawWedgesDiagram() {
  const totalArea = getTotal("2020 Land Area");
  const angles = REGIONS.map((region) => {
    const regionArea = getVal(region, "2020 Land Area");
    return getWedgeAngle(regionArea, totalArea);
  });
  console.log("🚀 ~ file: sketch.js ~ line 119 ~ angles ~ angles", angles);

  let angle = 0;
  const points = angles.map((regionAngle, index) => {
    angle += regionAngle;

    const p = getSpiderPoint(angle, 1);
    line(CENTER.x, CENTER.y, p.x, p.y);

    return getSpiderPoint(angle - regionAngle / 2, getVal(REGIONS[index], "2020 Proportion SDG") / 100);
  });

  console.log("🚀 ~ file: sketch.js ~ line 122 ~ points ~ points", points);
  points.forEach((point, index) => {
    fill(255);
    ellipse(point.x, point.y, 10, 10);
    text(REGIONS[index], point.x, point.y);

    const colorStr = "hsl(200, 20%, " + (10 + index * 10) + "%)";
    fill(colorStr);
    const t = index / points.length;

    const percent = angles[index] / TWO_PI;
    console.log("🚀 ~ file: sketch.js ~ line 140 ~ points.forEach ~ percent", percent);
    drawWedge(t - percent, t + percent, points, 0.001);
  });

  drawCurve(points);
}

function getSpiderPoints(values) {
  return values.map((val, index) => {
    const angle = TWO_PI * (index / values.length);
    const unitVec = createVector(sin(angle), -cos(angle));
    const pos = unitVec.mult(MAX_RADIUS).mult(val);
    return createVector(CENTER.x + pos.x, CENTER.y + pos.y);
  });
}

function getSpiderPoint(angle, val) {
  const unitVec = createVector(sin(angle), -cos(angle));
  const pos = unitVec.mult(MAX_RADIUS).mult(val);
  return createVector(CENTER.x + pos.x, CENTER.y + pos.y);
}

function drawInterPoints(points) {
  const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];

  const interPoints = [];
  for (let t of range(0, 1, 0.01)) {
    const point = getInterPoint(points, curvePoints, t);
    interPoints.push(point);
  }

  beginShape();
  curveVertex(interPoints[9].x, interPoints[9].y);

  for (let i of range(10, 20)) {
    const p = interPoints[i];
    ellipse(p.x, p.y, 5, 5);
    curveVertex(p.x, p.y);
  }
  curveVertex(interPoints[21].x, interPoints[21].y);
  endShape();

  beginShape();
  vertex(CENTER.x, CENTER.y);
  vertex(interPoints[10].x, interPoints[10].y);
  vertex(interPoints[20].x, interPoints[20].y);
  endShape(CLOSE);

  strokeWeight(2);
  stroke(255);
  line(interPoints[10].x, interPoints[10].y, interPoints[20].x, interPoints[20].y);
}
// drawWedge(-0.1, 0.1, points, 0.01)

function drawWedge(t1, t2, points, resolution) {
  const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];

  const interPoints = [];
  for (let t of range(t1 - resolution, t2 + resolution, resolution)) {
    const point = getInterPoint(points, curvePoints, t);
    interPoints.push(point);
  }

  strokeWeight(0);
  beginShape();
  vertex(CENTER.x, CENTER.y);
  interPoints.forEach((point) => {
    vertex(point.x, point.y);
  });
  vertex(CENTER.x, CENTER.y);
  endShape();
}

function getInterPoint(points, curvePoints, t) {
  // points index

  let index = (t * points.length) % points.length;
  index = index >= 0 ? index : points.length + index;

  // indices on curve points
  const lowIndex = Math.floor(index) + 1;
  const highIndex = lowIndex + 1;
  const location = index % 1;

  const interPoint = createVector(0, 0);
  interPoint.x = curvePoint(
    curvePoints[lowIndex - 1].x,
    curvePoints[lowIndex].x,
    curvePoints[highIndex].x,
    curvePoints[highIndex + 1].x,
    location
  );
  interPoint.y = curvePoint(
    curvePoints[lowIndex - 1].y,
    curvePoints[lowIndex].y,
    curvePoints[highIndex].y,
    curvePoints[highIndex + 1].y,
    location
  );

  return interPoint;
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

function getWedgeAngle(regionArea, totalArea) {
  return (regionArea / totalArea) * TWO_PI;
}

function getAverage(valueName) {
  let total = 0;
  REGIONS.forEach((region) => {
    total += getVal(region, valueName);
  });
  return total / REGIONS.length;
}

function getTotal(valueName) {
  let total = 0;
  REGIONS.forEach((region) => {
    total += getVal(region, valueName);
  });
  return total;
}

function keyPressed() {
  if (key === "S") {
    save();
  }
}

function* range(start, end, stepSize) {
  stepSize = stepSize ? stepSize : 1;
  let steps = (end - start) / stepSize;
  for (let i = 0; i <= steps; i++) {
    yield i * stepSize + start;
  }
}

function* range(start, end, stepSize) {
  stepSize = stepSize ? stepSize : 1;
  let steps = (end - start) / stepSize;
  for (let i = 0; i <= steps; i++) {
    yield i * stepSize + start;
  }
}
