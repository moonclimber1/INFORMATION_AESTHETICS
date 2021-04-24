// const REGIONS = ["Argentina", "Bolivia (Plurinational State of)", "Brazil", "Colombia", "Peru"];
const REGIONS = ["Argentina", "Bolivia (Plurinational State of)", "Brazil", "Ecuador", "Colombia", "Paraguay", "Peru"];

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

  values = REGIONS.map((country) => getVal(country, "2000 Proportion SDG") / 100);


  

  const spider = new CakeSpider(5)

  REGIONS.forEach(regionName => {
    const percent = getVal(regionName, "2020 Proportion SDG")
    const area = getVal(regionName, "2020 Land Area")
    spider.addWedge(regionName, percent, area)
  });
  spider.draw();
  spider.drawLabels();
}

function getVal(regionName, valueName) {
  const row = table.findRow(regionName, "Region");
  return row.getNum(valueName);
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