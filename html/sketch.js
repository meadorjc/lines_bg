let showLine = []
//let lineWidth = 6
let diagonal = false
let showGrid = true
let colorInput
let hexToRgbValue = [255, 255, 255];
// const clear = { color: { r: 0, g: 0, b: 0, a: 0 } }

var grid
var loopState = true
var nodes = []
var nodes_aa = {}
var cnv
// var user = {
//  name: '',
//  s_id: '',
//  color: { r: 255,
//    g: 0,
//    b: 0,
//    a: 100
//  }
// }
var initLoad = {
  s_id: '',
  m_id: '',
  color: { r: 255,
    g: 0,
    b: 0,
    a: 100
  },
  width: 0,
  height: 0,
  lineWidth : 0
}

function setup () {
  frameRate(30)
  cnv = createCanvas(initLoad.width, initLoad.height)
  grid = new Grid(initLoad.width, initLoad.height, initLoad.spacing, 1)

  cnv.mouseMoved(findNodes)
  initButtons();

  colorInput =	createInput('#ffffff', 'color');
  colorInput.position(500, 10);
  colorInput.mousePressed(function () {
    //console.log(colorInput.value())
   // socket.emit('clearlines')
  });
  cnv.elt.onmouseover = function () {
	hexToRgbValue = hexToRgb(colorInput.value())
	  //console.log(hexToRgbValue)
	socket.emit('colorInput', { m_id: initLoad.m_id, color : { r : hexToRgbValue[0], g : hexToRgbValue[1], b : hexToRgbValue[2], a : 255}})
  }
}

function draw () {
  //console.log(hexToRgb(colorInput.value())) // [0, 51, 255]
  //console.log(colorInput.value())
  background(200)
  if (showGrid) grid.show()

  Object.keys(gridLines).forEach(function (key) {
    // split the key into array
    key_coords = key.split(',');
    strokeWeight(gridLines[key].lineWidth);
    stroke(gridLines[key].color.r, gridLines[key].color.g, gridLines[key].color.b, gridLines[key].color.a);
    line(key_coords[0], key_coords[1], key_coords[2], key_coords[3]);
  });

  text(key, 33, 65);
  text(keyCode, 53, 65);

  // show preview line
  //stroke(initLoad.color.r, initLoad.color.g, initLoad.color.b, initLoad.color.a);
  //console.log(colorInput.value());
  stroke(hexToRgbValue[0], hexToRgbValue[1], hexToRgbValue[2], initLoad.color.a);
  strokeWeight(initLoad.lineWidth);
  fill(255, 0, 0);


  // alter preview line and send events for key codes
  // shift to clear
  if (keyIsDown(SHIFT)) {
    // change color of line
    stroke(0, 0, 0, 255);
      strokeWeight(1);
  }
  // diagonal
  if (keyIsDown(CONTROL)) { diagonal = true } else { diagonal = false }

  if (keyIsDown(SHIFT) && keyIsDown(CONTROL) && mouseIsPressed) {
    diagonal = true;
    // clearLine();
    socket.emit('clearline', [showLine.x1, showLine.y1, showLine.x2, showLine.y2].join(','));
  }

  // when placing lines
  if (keyIsDown(SHIFT) && mouseIsPressed) {
    socket.emit('clearline', [showLine.x1, showLine.y1, showLine.x2, showLine.y2].join(','));
  } else if (mouseIsPressed) {
    socket.emit('placeline', showLine);
  }

  // draw line
  line(showLine.x1, showLine.y1, showLine.x2, showLine.y2)
}

function mousePressed () {

}
function keyPressed () {

}
function processKeys () {

}
function findNodes () {
  if (mouseX >= initLoad.spacing && mouseX <= width - initLoad.spacing && mouseY >= initLoad.spacing && mouseY <= height - initLoad.spacing) {
    // Origin Node
    d1x = (mouseX % initLoad.spacing) >= (initLoad.spacing / 4) ? (Math.ceil(mouseX / initLoad.spacing) * initLoad.spacing) : (Math.floor(mouseX / initLoad.spacing) * initLoad.spacing)
    d1y = (mouseY % initLoad.spacing) >= (initLoad.spacing / 4) ? (Math.ceil(mouseY / initLoad.spacing) * initLoad.spacing) : (Math.floor(mouseY / initLoad.spacing) * initLoad.spacing)

    // Connecting Node
    d2x = (mouseX % initLoad.spacing) <= (initLoad.spacing / 4) ? (Math.ceil(mouseX / initLoad.spacing) * initLoad.spacing) : (Math.floor(mouseX / initLoad.spacing) * initLoad.spacing)
    d2y = (mouseY % initLoad.spacing) <= (initLoad.spacing / 4) ? (Math.ceil(mouseY / initLoad.spacing) * initLoad.spacing) : (Math.floor(mouseY / initLoad.spacing) * initLoad.spacing)

    // Decide connecting node direction
    if (diagonal === false) {
      if ((mouseX - d1x) > (mouseY - d1y)) {
        d2x = d1x
      } else { d2y = d1y }
    }
     //console.log(mouseX, mouseY, d1x, d1y, d2x, d2y, 3, initLoad.s_id, initLoad.m_id);
    //	showLine = new Line(d1x, d1y, d2x, d2y, 6, initLoad.s_id, initLoad.m_id);
    showLine = new Line(d1x, d1y, d2x, d2y, initLoad.lineWidth, initLoad.s_id, initLoad.m_id)
  }
}

function placeLine () {
  // socket.emit('placeline', showLine);
}

function clearLine () {
}
