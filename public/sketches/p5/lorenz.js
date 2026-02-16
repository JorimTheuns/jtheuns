// Initialization 
let x = 0.01;
let y = 0.0;
let z = 0;

let a = 10;
let b = 28;
let c = 8.0 / 3.0;

let minX = 0;
let minY = 0;
let minZ = 0;
let maxX = 0;
let maxY = 0;
let maxZ = 0;

let mindX = 0;
let mindY = 0;
let mindZ = 0;

let maxdX = 0;
let maxdY = 0;
let maxdZ = 0;

// ArrayList of PVector objects to store 
// the position vectors of the points to be plotted. 
//ArrayList<PVector> points = new ArrayList<PVector>(); 

let points = [];
//Camera cam; // Declaring PeasyCam object 

function setup() {
  // Creating the output window 
  // and setting up the OPENGL renderer 
  //size(800, 600, OPENGL);
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initializing the cam object 
  //sine.play();
  //sine2.play();
  //sine3.play();
  for (let i = 0; i < 100000; i++) {
    let dt = 0.005;
    let dx = (a * (y - x)) * dt;
    let dy = (x * (b - z) - y) * dt;
    let dz = (x * y - c * z) * dt;
    x += dx;
    y += dy;
    z += dz;

    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
    if (z < minZ) {
      minZ = z;
    }
    if (z > maxZ) {
      maxZ = z;
    }
    //println(maxX, maxY, maxZ, minX, minY, minZ);

    // Adding the position vectors to points ArrayList 
    let point = createVector(x, y, z)
    points[points.length] = point;
    translate(0, 0, -80);
    // Beginning plotting of points 
    scale(2);
    strokeWeight(1);
    //stroke(255);
    let oldX = 0;
    let oldY = 0;
    let oldZ = 0;
    let xCol = 0;
    let yCol = 0;
    let zCol = 0;
    for (let i = 1; i < points.length; i++) {
      oldX = xCol;
      oldY = yCol;
      oldZ = zCol;
      // Adding color to the structure in each frame 
      xCol = points[i].x;
      yCol = points[i].y;
      zCol = points[i].z;
      let dX = sqrt((xCol - oldX) * (xCol - oldX));
      let dY = sqrt((yCol - oldY) * (yCol - oldY));
      let dZ = sqrt((zCol - oldZ) * (zCol - oldZ));
      if (dX < mindX) {
        mindX = dX;
      }
      if (dX > maxdX) {
        maxdX = dX;
      }
      if (dY < mindY) {
        mindY = dY;
      }
      if (dY > maxdY) {
        maxdY = dY;
      }
      if (dZ < mindZ) {
        mindZ = dZ;
      }
      if (dZ > maxdZ) {
        maxdZ = dZ;
      }
      let xColor = map(dX, mindX, maxdX, 100, 255);
      let yColor = map(dY, mindY, maxdY, 100, 255);
      let zColor = map(dZ, mindZ, maxdZ, 100, 255);
      stroke(xColor, yColor, zColor);
      noFill();
      beginShape(LINES);
      strokeWeight(.5);
      vertex(points[i - 1].x, points[i - 1].y, points[i - 1].z); // plotting the 
      vertex(points[i].x, points[i].y, points[i].z);
      endShape();
    } // Drawing ends
  }
}

function draw() {
  background(0);
  var moveX = map(mouseX, 0, width, -300, 300);
  var moveY = map(mouseY, 0, height, -300, 300);
  camera(moveX, moveY, -100, 0, 0, 0, 0, 1, 0);

}
