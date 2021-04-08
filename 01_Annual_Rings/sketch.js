
const COUNTRIES = ['Argentina', 'Bolivia (Plurinational State of)', 'Brazil', 'Ecuador', 'Guyana', 'Colombia', 'Paraguay', 'Peru' ]

const CANVAS_SIZE = 800
const MAX_RADIUS = 350;
let CENTER;

let table

function preload() {
    table = loadTable('data/forest2.csv', 'tsv', 'header');
}

function setup() {

        // c1 = color(34,193,195);
    // c2 = color(253,187,45);

    print(table.getRowCount() + ' total rows in table');
    print(table.getColumnCount() + ' total columns in table');
    print(table)


    // Setup
    createCanvas(CANVAS_SIZE, CANVAS_SIZE, SVG);
    CENTER = createVector(width/2, height/2)

    // Background 
    background(40)
    noFill();
    stroke(150)
    strokeWeight(5)
    rect(0,0,width-2.5,height-2.5)
    
    // Spider
    drawSpiderWeb();


    COUNTRIES.forEach((country, index) => {
        const proportion2000 = getVal(country, '2000 Proportion SDG') / 100
        // console.log("🚀 ~ file: sketch.js ~ line 42 ~ setup ~ proportion2000", country, proportion2000)
    })

    const values = COUNTRIES.map(country => getVal(country, '2000 Proportion SDG')/100)
    console.log("🚀 ~ file: sketch.js ~ line 43 ~ setup ~ values", values)
    
    drawCurve(values);
    

    
    curveTightness(0)
    stroke(250)
    strokeWeight(5)

    noFill()

    beginShape();
    
    
    curveVertex(200, 500); // C 
    curveVertex(100, 100); // A |
    curveVertex(340, 190); // B |
    curveVertex(200, 500); // C |
    curveVertex(100, 100); // A |
    curveVertex(340, 190); // B
  

    endShape()

    // save();
}

function drawCurve(values){
    
    const points = getCurvePoints(values)
    const curvePoints = [points[points.length-1], ...points, points[0], points[1]]

    // curveTightness(-0.5)
    noFill()
    stroke(160)
    strokeWeight(5)

    beginShape()
    curvePoints.forEach(point => {
        curveVertex(point.x, point.y)
    })
    endShape()

    points.forEach(point => {
        noStroke()
        fill(255)
        ellipse(point.x, point.y, 10, 10)
    })
}

function getCurvePoints(values){
    return values.map((val, index) => {
        const angle = TWO_PI * (index/values.length)
        const unitVec = createVector(sin(angle), -cos(angle))
        const pos = unitVec.mult(MAX_RADIUS).mult(val)
        return createVector(CENTER.x + pos.x, CENTER.y + pos.y)
    })
}



function getArea(a, b, c){
    return Math.sqrt((a+b+c)*(a+b-c)*(b+c-a)*(c+a-b))/4
}

function drawSpiderWeb(){
    noFill()
    strokeWeight(1)
    stroke(150)

    const RINGS = 2
    const step = MAX_RADIUS/RINGS


    for(let r = 0; r<= MAX_RADIUS; r+= step){
        ellipse(width/2, height/2, r*2, r*2)
    }
}

function getVal(regionName, valueName){
    const row = table.findRow(regionName, 'Region')
    return row.getNum(valueName)
}








