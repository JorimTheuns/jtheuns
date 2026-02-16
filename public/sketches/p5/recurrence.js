//import peasy.*;

//PeasyCam camera;

let r = 1;
let aout = 0.5;
let aout1 = 0.5;
let aout2 = 0.5;

let aOut = [];
let bOut = [];
let cOut = [];

let bout = 0.5;
let bout1 = 0.5;
let bout2 = 0.5;

let cout = 0.5;
let cout1 = 0.5;
let cout2 = 0.5;

//PFont font;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1.0);
  background(0, 0.1);
  strokeWeight(2);
  aOut[0] = 0;
  bOut[0] = 0.1;
  cOut[0] = 0.1;
}

function draw() {
  background(0, 0.03);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  push();
  noStroke();
  textSize(12);
  fill(0);
  rect(width / 2, height - 50, width, 100);
  fill(255);
  text("Perlin noise", width / 6, height - 50);
  text("Logistic function", 2 * width / 4, height - 50);
  text("Randomness", (width / 6) * 5, height - 50);
  pop();
  //push();
  //translate(0, 0, 800);
  //translate(50, 50, 50);
  //rotateY(millis()/1000.0);
  //translate(-50, -50, -50);
  let picker = (floor(mouseX / 100))+1;
  for (let j = 20; j < 80; j++) {
    r = (j / 20.0);
    let strokeHue = r / 4.0;
    stroke(strokeHue, 1, 1);
    for (let i = 0; i < 7; i++) {
      for (let j = floor(width / 100) + 1; j > 0; j--) {
        aOut[j] = aOut[j - 1];
      }
      aOut[0] = noise(millis() / (r * 1000.0));
      point(aOut[0] * width / 3, aOut[picker] * (height - 100));
    }
  }
  for (let j = 100; j < 400; j++) {
    let timeComp = (sin(millis())+1)*0.001;
    //console.log(timeComp);
    r = (j / 100.0)+timeComp;
    let strokeHue = r / 4.0;
    stroke(strokeHue, 1, 1);
    for (let i = 0; i < 7; i++) {
      for (let j = floor(width / 100) + 1; j > 0; j--) {
        bOut[j] = bOut[j - 1];
      }
      bOut[0] = r * bOut[0] * (1 - bOut[0]);
      point(bOut[0] * (width / 3) + (width / 3), bOut[picker] * (height - 100));
    }
  }
  //pop();
  //push();
  //translate(1500, 0, 0);
  //translate(500, 500, 500);
  //rotateY(millis()/10000.0);
  //translate(-500, -500, -500);
  for (let j = 20; j < 80; j++) {
    r = (j / 20.0);
    let strokeHue = r / 4.0;
    stroke(strokeHue, 1, 1);
    for (let i = 0; i < 7; i++) {
      for (let j = floor(width / 100) + 1; j > 0; j--) {
        cOut[j] = cOut[j - 1];
      }
      cOut[0] = random(1);
      point(cOut[0] * (width / 3) + (width / 3) + (width / 3), cOut[picker] * (height - 100));
    }
  }
  //pop();
  //pop();*/
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
