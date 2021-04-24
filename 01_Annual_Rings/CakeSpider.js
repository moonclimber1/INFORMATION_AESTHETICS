function CakeSpider(unitRadius, baseRadius, baseVal) {
  let wedges = [];

  this.addWedge = (name, value, area) => {
    wedges.push({
      name: name,
      value: value,
      area: area,
    });
  };

  this.draw = function () {
    initWedgesProps();
    calculateDistribution();

    // drawWedge(getWedgeAt(0), color('red'))
    // drawWedge(getWedgeAt(1), color('blue'))
    // drawWedge(getWedgeAt(2), color('green'))
    // drawWedge(getWedgeAt(3), color('cyan'))
    // drawWedge(getWedgeAt(4), color('purple'))
    drawCurve();

    const p1 = getSpiderPoint(0.7 *  TWO_PI, 40)
    console.log("🚀 ~ file: CakeSpider.js ~ line 24 ~ CakeSpider ~ testPoint", p1)
    fill('green')
    ellipse(p1.x, p1.y, 15, 15)
    console.log("🚀 ~ file: CakeSpider.js ~ line 35 ~ CakeSpider ~ getIndexOfPoint(testPoint)", getIndexOfPoint(p1))
    const p2 = getInterPoint(getIndexOfPoint(p1))
    fill('red')
    ellipse(p2.x, p2.y, 10, 10)

    fill('blue')
    const p3 = getInterPoint(getIndexFromAngle(0.7 * TWO_PI))
    ellipse(p3.x, p3.y, 10, 10)

    // console.log("🚀 ~ file: CakeSpider.js ~ line 42 ~ CakeSpider ~ getIndexFromAngle(0)", getIndexFromAngle(TWO_PI * 0.5))
  };

  this.drawLabels = function () {
    // text aligment setting
    noStroke();
    fill(255)
    textAlign(CENTER, CENTER);

    wedges.forEach((wedge) => {
    
    
    
      // draw spider line

      strokeWeight(1);
      stroke(150);
      // line(CENTER.x, CENTER.y, wedge.markerPoint.x, wedge.markerPoint.y);

      const lineEnd = getSpiderPoint(wedge.startAngle, 1000)
      line(CENTER.x, CENTER.y, lineEnd.x, lineEnd.y);
      

      const textPoint = getSpiderPoint(wedge.markerPointAngle, wedge.value + 5);

      // draw rotated text at position
      push();
      translate(textPoint.x, textPoint.y);
      rotate(wedge.markerPointAngle - PI / 2);
      text(wedge.name, 0, 0);
      pop();
    });
  };

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
    while(i < 70){
      let totalAngle = 0
      wedges.forEach(wedge => {
        if(wedge.curvedAreaPortion > wedge.areaPortion){
          wedge.size -= 1
        } else if(wedge.curvedAreaPortion === wedge.areaPortion){
          console.log("Pareil")
        }else{
            wedge.size +=1
        }
        totalAngle += wedge.angle
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
      console.log(wedge.name, 'areaPortion', wedge.areaPortion, 'curvedAreaPortion', wedge.curvedAreaPortion, 'curvedArea', wedge.curvedArea, 'size', wedge.size, 'angle', wedge.angle)
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
      wedge.startIndex = null
      wedge.endIndex = null
      angleSum += wedge.angle; 
    });

    wedges.forEach(wedge => {
      wedge.curvedArea = getCurvedArea(wedge)
    })
    const totalCurvedArea = wedges.reduce((acc, current) => acc + current.curvedArea, 0);
    // console.log("🚀 ~ file: CakeSpider.js ~ line 109 ~ updateWedgesProps ~ totalCurvedArea", totalCurvedArea)
    wedges.forEach(wedge => {
      wedge.curvedAreaPortion = wedge.curvedArea / totalCurvedArea
    })
  }

  function getIndexOfPoint(point){
    const resolution = 0.01

    const pointVec = p5.Vector.sub(point, CENTER)
    let bestIndex = 0;
    let bestAngle = TWO_PI;
    for(let i = 0; i < wedges.length; i += resolution){
      const interPoint = getInterPoint(i)
      const interPointVec = p5.Vector.sub(interPoint, CENTER)


      const angle =  Math.abs(p5.Vector.angleBetween(pointVec, interPointVec))
    
      // console.log("🚀 ~ file: CakeSpider.js ~ line 132 ~ getIndexOfPoint ~ angle", i,angle)

      if(angle < bestAngle){
        bestIndex = i
        bestAngle = angle
      }
    }
    return bestIndex
  }

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
    const resolution = 0.001

    let totalArea = 0

    for(let t = wedge.index - 0.5; t < wedge.index + 0.5; t += resolution){
    
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

  function drawCurve() {
    const points = wedges.map((wedge) => wedge.markerPoint);
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

  function drawWedge(wedge, color) {

    const resolution = 0.01
  
    strokeWeight(0);
    fill(color)
    beginShape();
    vertex(CENTER.x, CENTER.y);
    for (let t of range(wedge.index -0.5, wedge.index + 0.5, resolution)) {
      const point = getInterPoint(t);
      vertex(point.x, point.y);
      // ellipse(point.x, point.y, 3, 3);
    }
    vertex(CENTER.x, CENTER.y);
    endShape();
  }
}



function* range(start, end, stepSize) {
  stepSize = stepSize ? stepSize : 1;
  let steps = (end - start) / stepSize;
  for (let i = 0; i <= steps; i++) {
    yield i * stepSize + start;
  }
}
