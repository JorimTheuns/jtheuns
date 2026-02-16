let data = [];

function preload() {
  data = loadJSON('json/lorenz.json');
}

function setup() {

  //let lorenzData = data['bubbles'];

  // Creating the output window 
  // and setting up the OPENGL renderer 
  //size(800, 600, OPENGL);
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initializing the cam object 
  //sine.play();
  //sine2.play();
  //sine3.play();
  cam = createCamera();
}

function draw() {
  background(0);
  var moveX = map(mouseX, 0, width, -300, 300);
  var moveY = map(mouseY, 0, height, -300, 300);
  //console.log(sin(moveX), cos(moveY));

  //var z = Math.cos(moveX) * Math.cos(moveY) + -150;
  //var y = Math.cos(moveX) * Math.sin(moveY) * 50;
  //var x = Math.sin(moveX) * 50;
  
  //console.log(-50,moveX,moveY, Math.cos(moveX) * Math.sin(moveY));
  
  

  //cam.camera(moveX, moveY, -100, 0, 0, 40, 0, 1, 0);
  
  rotateY((moveX/100));
  rotateX(-(moveY/100));
  //console.log(data[0][0]);
  //var index = frameCount % data.length;
  //console.log(index);
  scale(8);
  translate(0,0,-20);

  for (let i = 5; i < 5000; i = i + 5) {
    //console.log(i);
    //i %= data.length;
    //console.log(i);

    beginShape(LINES);
    strokeWeight(1);
    stroke(data[i][3], data[i][4], data[i][5]);
    //console.log(data[i - 1][0], data[i - 1][1], data[i - 1][2]);
    vertex(data[i - 5][0], data[i - 5][1], data[i - 5][2]); // plotting the 
    vertex(data[i][0], data[i][1], data[i][2]);
    endShape();
  }
}
