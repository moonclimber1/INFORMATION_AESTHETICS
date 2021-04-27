// const REGIONS = ["Argentina", "Bolivia (Plurinational State of)", "Brazil", "Colombia", "Peru"];
// const REGIONS = ["Argentina", "Bolivia (Plurinational State of)", "Brazil", "Ecuador", "Colombia", "Paraguay", "Peru"];

// const REGIONS = ['Asia', 'Africa', 'Europe', 'South America'];
// const REGIONS = ['Russian Federation', 'China', 'United States of America', 'Canada', 'Brazil', 'Australia', 'India', 'Argentina']; // grösste Länder der Weld
// const REGIONS = ['China', 'Russian Federation', 'Democratic Republic of the Congo', 'Australia', 'United States of America', 'Canada', 'Brazil', 'Indonesia']; // waldreichste Länder
// const REGIONS = ['China', 'Russian Federation', 'Democratic Republic of the Congo', 'Australia', 'United States of America', 'Canada', 'Brazil', ]; // waldreichste Länder


// const REGIONS = ['Democratic Republic of the Congo', 'China',  'Indonesia', 'United States of America', 'Russian Federation', 'Canada', 'Brazil'];  // Grösste Waldflächen der Welt
const REGIONS = ['United Republic of Tanzania', 'Nicaragua', 'Cambodia',  'Myanmar', 'Angola', 'Paraguay', 'Malawi'] // %Loosers  
// const REGIONS = ['Bulgaria','Bhutan', 'Montenegro','Cuba', 'Jamaica', 'Viet Nam', 'Fiji' ] //%Winners
// const REGIONS = ['Bulgaria', 'Viet Nam', 'Jamaica', 'Bhutan', 'Fiji' ,'Cuba'] //%Winners

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

  let totalForestArea = 0
  REGIONS.forEach(regionName => {
    const forestArea2020 = getVal(regionName, "2020 Forest Area")
    const percent2020 = getVal(regionName, "2020 Proportion SDG")
    // const percent2010 = getVal(regionName, "2010 Proportion SDG")
    const percent2000 = getVal(regionName, "2000 Proportion SDG")

    spider.addWedge(regionName, forestArea2020, percent2020, [ percent2000])

    totalForestArea += forestArea2020;
  });
  console.log("🚀 ~ file: sketch3.js ~ line 42 ~ setup ~ totalForestArea", totalForestArea)

  spider.drawGuide(25)
  spider.drawGuide(50)
  spider.drawGuide(75)
  spider.drawGuide(100)

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