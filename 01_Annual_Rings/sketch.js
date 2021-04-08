
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
const MAX_RADIUS = 350;
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
  values = COUNTRIES.map((country) => getVal(country, "2000 Proportion SDG") / 100);
  drawCurve(values);

  stroke("SteelBlue");
  values = COUNTRIES.map((country) => getVal(country, "2010 Proportion SDG") / 100);
  drawCurve(values);

  stroke("SlateBlue");
  values = COUNTRIES.map((country) => getVal(country, "2020 Proportion SDG") / 100);
  drawCurve(values);

  addLabels();
}

function addLabels(){
    COUNTRIES.forEach((country, index) => {
        const angle = TWO_PI * (index / COUNTRIES.length);

        push()

        
        console.log("🚀 ~ file: sketch.js ~ line 65 ~ COUNTRIES.forEach ~ angle", angle)
        // translate(CENTER.x , CENTER.y - MAX_RADIUS)

        const p = createVector(sin(angle), -cos(angle)).mult(MAX_RADIUS* 0.75);
        strokeWeight(5)
        translate(CENTER.x + p.x, CENTER.y + p.y)

        rotate(angle - PI/2)
        // ellipse(0,0, 30,30)
        textAlign(CENTER, CENTER);
        text(country)
    
        pop()
    })
}

function drawCurve(values) {
  const points = getCurvePoints(values);
  const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];

  // curveTightness(-0.5)
  noFill();
  strokeWeight(3);

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

function getCurvePoints(values) {
  return values.map((val, index) => {
    const angle = TWO_PI * (index / values.length);
    const unitVec = createVector(sin(angle), -cos(angle));
    const pos = unitVec.mult(MAX_RADIUS).mult(val);
    return createVector(CENTER.x + pos.x, CENTER.y + pos.y);
  });
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
