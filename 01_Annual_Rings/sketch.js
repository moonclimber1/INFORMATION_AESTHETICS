

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

  stroke("SkyBlue");
  noFill();
  values = COUNTRIES.map((country) => getVal(country, "2000 Proportion SDG") / 100);
  drawCurve(getSpiderPoints(values));

  stroke("SteelBlue");
  noFill();
  values = COUNTRIES.map((country) => getVal(country, "2010 Proportion SDG") / 100);
  drawCurve(getSpiderPoints(values));

  stroke("SlateBlue");
  fill("Indigo");
  values = COUNTRIES.map((country) => getVal(country, "2020 Proportion SDG") / 100);

  fill('hsl(200, 55%, 20%)')
  drawWedge(-0.2, 0.2, getSpiderPoints(values), 0.001)
  fill('hsl(200, 55%, 30%)')
  drawWedge(0.2, 0.4, getSpiderPoints(values), 0.001)
  fill('hsl(200, 55%, 40%)')
  drawWedge(0.4, 0.6, getSpiderPoints(values), 0.001)
  fill('hsl(200, 55%, 50%)')
  drawWedge(0.6, 0.8, getSpiderPoints(values), 0.001)

  drawCurve(getSpiderPoints(values));

  addLabels();
}

function addLabels() {
  // text aligment setting
  noStroke()
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

function drawCurve(points) {
  const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];
  console.log("🚀 ~ file: sketch.js ~ line 83 ~ drawCurve ~ curvePoints", curvePoints);

  // Settings
  strokeWeight(3);
  // curveTightness(-0.5)

  noFill()
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

function getSpiderPoints(values) {
  return values.map((val, index) => {
    const angle = TWO_PI * (index / values.length);
    const unitVec = createVector(sin(angle), -cos(angle));
    const pos = unitVec.mult(MAX_RADIUS).mult(val);
    return createVector(CENTER.x + pos.x, CENTER.y + pos.y);
  });
}

function drawInterPoints(points){
    const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];


    const interPoints = []
    for (let t of range(0,1, 0.01)){
        const point = getInterPoint(points, curvePoints, t)
        interPoints.push(point)
    }

    beginShape()
    curveVertex(interPoints[9].x, interPoints[9].y)

    for (let i of range(10,20)){
        const p = interPoints[i]
        ellipse(p.x,p.y,5,5)
        curveVertex(p.x, p.y)
    }
    curveVertex(interPoints[21].x, interPoints[21].y)
    endShape()

    
    beginShape()
    vertex(CENTER.x, CENTER.y)
    vertex(interPoints[10].x, interPoints[10].y)
    vertex(interPoints[20].x, interPoints[20].y)
    endShape(CLOSE)

    strokeWeight(2)
    stroke(255)
    line(interPoints[10].x, interPoints[10].y, interPoints[20].x, interPoints[20].y)
    

}
// drawWedge(-0.1, 0.1, points, 0.01)

function drawWedge( t1, t2, points, resolution){
    const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];

    const interPoints = []
    for (let t of range(t1-resolution,t2+resolution, resolution)){
        const point = getInterPoint(points, curvePoints, t)
        interPoints.push(point)
    }

    strokeWeight(0)
    beginShape()
    vertex(CENTER.x, CENTER.y)
    interPoints.forEach((point) => {
        vertex(point.x, point.y)
    })
    vertex(CENTER.x, CENTER.y)
    endShape()
}

function getInterPoint(points, curvePoints, t){
    
    // points index
    
    let index = t * points.length % points.length
    index = index >= 0 ? index : points.length + index

    // indices on curve points
    const lowIndex = Math.floor(index) + 1
    const highIndex = lowIndex + 1
    const location = index % 1

  
    const interPoint = createVector(0,0)
    interPoint.x = curvePoint(curvePoints[lowIndex-1].x, curvePoints[lowIndex].x, curvePoints[highIndex].x, curvePoints[highIndex + 1].x, location)
    interPoint.y = curvePoint(curvePoints[lowIndex-1].y, curvePoints[lowIndex].y, curvePoints[highIndex].y, curvePoints[highIndex + 1].y, location)
    
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


