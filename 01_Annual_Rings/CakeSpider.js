

function CakeSpider(unitRadius, baseRadius, baseVal) {

  let wedges = [];

  const colors = [color('#3180BD'), color('#3BC4A8'), color('#3DAD4A'), color('#99C43B'), color('#BDA838')]
  console.log("🚀 ~ file: CakeSpider.js ~ line 8 ~ CakeSpider ~ colors", colors)

  this.addWedge = (name, area, value, additionalValues) => {
    wedges.push({
      name: name,
      area: area,
      value: value,
      additionalValues: additionalValues,
    });
  };

  this.draw = function () {

    // shuffleArray(wedges)
    initWedgesProps();
    calculateDistribution();

    drawWedges()

    stroke(200)
    const points = wedges.map((wedge) => wedge.markerPoint);
    drawMarkerLines();
    drawCurve(points);

    for(let i = 0; i < wedges[0].additionalValues.length; i+=1){
      const points = wedges.map((wedge) => getSpiderPoint(wedge.markerPointAngle, wedge.additionalValues[i]));
      console.log("🚀 ~ file: CakeSpider.js ~ line 24 ~ CakeSpider ~ points", points)
      stroke(100)
      drawCurve(points)
    }

    // const p1 = getSpiderPoint(0.7 *  TWO_PI, 40)
    // console.log("🚀 ~ file: CakeSpider.js ~ line 24 ~ CakeSpider ~ testPoint", p1)
    // fill('green')
    // ellipse(p1.x, p1.y, 15, 15)
    // console.log("🚀 ~ file: CakeSpider.js ~ line 35 ~ CakeSpider ~ getIndexOfPoint(testPoint)", getIndexOfPoint(p1))
    // const p2 = getInterPoint(getIndexOfPoint(p1))
    // fill('red')
    // ellipse(p2.x, p2.y, 10, 10)

    // fill('blue')
    // const p3 = getInterPoint(getIndexFromAngle(0.7 * TWO_PI))
    // ellipse(p3.x, p3.y, 5, 5)

    // console.log("🚀 ~ file: CakeSpider.js ~ line 42 ~ CakeSpider ~ getIndexFromAngle(0)", getIndexFromAngle(TWO_PI * 0.5))
  };

  this.drawLabels = function () {

    wedges.forEach((wedge) => {

      // text aligment setting
      noStroke();
      fill(255)
      textAlign(CENTER, CENTER);

      const textPoint = getSpiderPoint(wedge.markerPointAngle, wedge.value + 5);

      // draw rotated text at position
      push();
      translate(textPoint.x, textPoint.y);
      rotate(wedge.markerPointAngle - PI / 2);
      text(wedge.name, 0, 0);
      pop();
    });
  };

  function drawMarkerLines(){
    wedges.forEach(wedge => {
      // draw spider line
      strokeWeight(3);
      stroke(200);
      line(CENTER.x, CENTER.y, wedge.markerPoint.x, wedge.markerPoint.y);
    })
  }

  this.drawGuide = function(val){
    noFill();
    strokeWeight(1);
    stroke(150);

    const d = val * unitRadius * 2;

    ellipse(CENTER.x, CENTER.y, d, d);
  }

  

  function initWedgesProps() {
    // calculate area portions and save index
    const totalArea = wedges.reduce((acc, current) => acc + current.area, 0);
    wedges.forEach((wedge, index) => {
      wedge.index = index;
      wedge.size = 100
      wedge.areaPortion = wedge.area / totalArea;
    });
  }

  function calculateDistribution() {
    // Initialize with same angles for every wedge
    wedges.forEach((wedge) => {
      wedge.angle = TWO_PI / wedges.length;
    });
    updateWedgesProps();
    printWedgesAreas();

    let i = 0
    while(i < 1000){
      wedges.forEach(wedge => {
        if(wedge.curvedAreaPortion > wedge.areaPortion){
          wedge.size -= 1
        } else if(wedge.curvedAreaPortion === wedge.areaPortion){
          console.log("Pareil")
        }else{
            wedge.size += 1
        }
      })
      updateWedgesProps();
      i+=1
    }

    printWedgesAreas();
    console.log(wedges)
  }

  function printWedgesAreas(){
    console.log('---------------------')
    wedges.forEach(wedge => {
      console.log(wedge.name, 'areaPortion', pc(wedge.areaPortion), 'curvedAreaPortion', pc(wedge.curvedAreaPortion), 'curvedArea', rd(wedge.curvedArea), 'size', rd(wedge.size), 'angle', rd(wedge.angle))
    })
    
  }

  function updateWedgesProps() {

    const totalSize = wedges.reduce((acc, current) => acc + current.size, 0);
    
    let angleSum = 0;
    wedges.forEach((wedge) => {
      wedge.angle = TWO_PI * (wedge.size / totalSize)
      wedge.startAngle = angleSum;
      wedge.endAngle = angleSum + wedge.angle;
      wedge.markerPointAngle = (wedge.endAngle - wedge.startAngle) / 2 + wedge.startAngle;
      wedge.markerPoint = getSpiderPoint(wedge.markerPointAngle, wedge.value);
      angleSum += wedge.angle; 
    });

    wedges.forEach(wedge => {
      wedge.startIndex = getIndexFromAngle(wedge.startAngle)
      wedge.endIndex = getIndexFromAngle(wedge.endAngle)
      wedge.curvedArea = getCurvedArea(wedge)
    })
    const totalCurvedArea = wedges.reduce((acc, current) => acc + current.curvedArea, 0);
    wedges.forEach(wedge => {
      wedge.curvedAreaPortion = wedge.curvedArea / totalCurvedArea
    })
  }

  function getIndexOfPoint(point){
    const resolution = 0.005

    const pointVec = p5.Vector.sub(point, CENTER)
    let bestIndex = 0;
    let bestAngle = TWO_PI;
    for(let i = 0; i < wedges.length; i += resolution){
      const interPoint = getInterPoint(i)
      const interPointVec = p5.Vector.sub(interPoint, CENTER)

      const angle =  Math.abs(p5.Vector.angleBetween(pointVec, interPointVec))
      if(angle < bestAngle){
        bestIndex = i
        bestAngle = angle
      }
    }
    return bestIndex
  }

  // FIXME: hacky implementation
  function getIndexFromAngle(angle){
    return getIndexOfPoint(getSpiderPoint(angle, 1))
  }

  // Draft Code (not working yet)

  // function getIndexFromAngle(angle){
  //   const resolution = 0.01

  //   const zeroVec = createVector(0,1)
  //   let bestIndex = 0;
  //   let minDiff = TWO_PI;
  //   for(let i = 0; i < wedges.length; i += resolution){
  //     const interPointVec = p5.Vector.sub(getInterPoint(i), CENTER)
  //     const interPointAngle = p5.Vector.angleBetween(zeroVec, interPointVec)

  //     const diff = Math.abs(angle - interPointAngle)

  //     if(diff < minDiff){
  //       bestIndex = i
  //       minDiff = diff
  //     }
  //   }
  //   return bestIndex
  // }


  function getCurvedArea(wedge) {
    const resolution = 0.01

    let totalArea = 0

    // deal with overflow
    const start = wedge.startIndex > wedge.endIndex ? (wedge.startIndex % wedges.length) - wedges.length : wedge.startIndex;

    for(let t = start; t < wedge.endIndex; t += resolution){
    
      // Coordinates
      const A = getInterPoint(t)
      const B = getInterPoint(t + resolution)
      const C = CENTER

      // Edges
      const a = dist(B.x, B.y, C.x, C.y)
      const b = dist(A.x, A.y, C.x, C.y)
      const c = dist(A.x, A.y, B.x, B.y)

      totalArea += getTriangleArea(a,b,c)
    }
    return totalArea
  }

  function getTriangleArea(a, b, c) {
    return Math.sqrt((a + b + c) * (a + b - c) * (b + c - a) * (c + a - b)) / 4;
  }

  function getSpiderPoint(angle, val) {
    const unitVec = createVector(sin(angle), -cos(angle));
    const pos = unitVec.mult(unitRadius).mult(val);
    return createVector(CENTER.x + pos.x, CENTER.y + pos.y);
    // return {x: CENTER.x + pos.x, y:  CENTER.y + pos.y}
  }

  function getWedgeAt(index) {
    let i = index % wedges.length;
    i = i < 0 ? i + wedges.length : i;
    return wedges[i];
  }
    

  function getInterPoint(position) {

    // deal with negative positions and overflow
    position = position % wedges.length
    position = position < 0 ? position + wedges.length : position;
    const index = Math.floor(position);

    const interPoint = createVector(0, 0);
    interPoint.x = curvePoint(
      getWedgeAt(index - 1).markerPoint.x,
      getWedgeAt(index).markerPoint.x,
      getWedgeAt(index + 1).markerPoint.x,
      getWedgeAt(index + 2).markerPoint.x,
      position % 1
    );
    interPoint.y = curvePoint(
      getWedgeAt(index - 1).markerPoint.y,
      getWedgeAt(index).markerPoint.y,
      getWedgeAt(index + 1).markerPoint.y,
      getWedgeAt(index + 2).markerPoint.y,
      position % 1
    );

    return interPoint;
  }

  function drawCurve(points) {
    
    const curvePoints = [points[points.length - 1], ...points, points[0], points[1]];

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
  }

  function drawWedge(wedge) {

    const resolution = 0.001
  
    strokeWeight(0);
    beginShape();
    vertex(CENTER.x, CENTER.y);

    const start = wedge.startIndex > wedge.endIndex ? (wedge.startIndex % wedges.length) - wedges.length : wedge.startIndex;

    for (let t of range(start, wedge.endIndex + resolution, resolution)) {
      const point = getInterPoint(t);
      vertex(point.x, point.y);
      // ellipse(point.x, point.y, 3, 3);
    }
    vertex(CENTER.x, CENTER.y);
    endShape();

    // strokeWeight(2);
    // stroke(200);
    // const p1 = getInterPoint(wedge.startIndex)
    // line(CENTER.x, CENTER.y, p1.x, p1.y);
    // const p2 = getInterPoint(wedge.endIndex)
    // line(CENTER.x, CENTER.y, p2.x, p2.y);
  }

  function drawWedges(){
    const c1 = colors[1]
    const c2 = colors[4]

    wedges.forEach((wedge, index) => {
      const c = lerpColor(c1, c2, index/wedges.length);
      fill(c)
      drawWedge(wedge)
    })
  }
}



function* range(start, end, stepSize) {
  stepSize = stepSize ? stepSize : 1;
  let steps = (end - start) / stepSize;
  for (let i = 0; i <= steps; i++) {
    yield i * stepSize + start;
  }
}

function pc(num){
  return Math.round(num * 10000) / 100
}

function rd(num){
  return Math.round(num * 100) / 100
}

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
