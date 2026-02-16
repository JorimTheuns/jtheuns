p5.disableFriendlyErrors = true;

let squareRootCells;
let cellsWide;
let cellsHigh;
let total;
let cells = [];
let cellSize;
let showfood;
let constGrowth;
let oldMouseX;
let oldMouseY;
let bkgcol;
let confidence;
let infSample;

//let sample = int(infSample/(1+((infSample-1)/n)));

let sample1;
let sample2;
let sample3;
let sizer;
let sizerHeight;

function setup() {
  //Declarations
  createCanvas(windowWidth, windowHeight);
  sizer = width/6;
  sizerHeight = 50;
  squareRootCells = 40;
  //you can change these paramenters, Smaller cellsize increases complexity non-linearly
  cellSize = (sqrt(width*(height-(sizerHeight*1.5))))/squareRootCells;
  //console.log(cellSize);
  cellsWide = ceil((width)/cellSize);
  cellsHigh = ceil((height-(sizerHeight*1.5))/cellSize);
  colorMode(RGB,1);
  //background color, dont change last value
  bkgcol = color(1,1,1,0.05);
  //dont change
  total = cellsWide*cellsHigh;
  //color[] colors = new color[total];
  showfood = false;
  constGrowth = 8;
  confidence = 1.645;
  infSample = (sq(confidence)*(0.5*(1-0.5)))/sq(0.03);

//let sample = int(infSample/(1+((infSample-1)/n)));

  sample1 = 1;
  sample2 = 12;
  sample3 = ceil(infSample/(1+((infSample-1)/total)));
  background(255);
  frameRate(30);
  //fullScreen();
  for (let i = 0; i< cellsWide; i++) {
    cells[i] = [];
    for (let j = 0; j<  cellsHigh; j++) {
      let pos = createVector(i, j);
      cells[i][j] = new Cell(cellSize, pos);
      cells[i][j].display();
    }
  }
  for (let i = 0; i< cellsWide; i++) {
    for (let j = 0; j< cellsHigh; j++) {
      cells[i][j].init();
    }
  }
  //cells[round(cellsWide/2)][round(cellsHigh/2)].clicked;
  /*oldMouseX = mouseX;
  oldMouseY = mouseY;*/
  cells[ceil(cellsWide/2)-1][ceil(cellsHigh/2)-1].clicked();
  textSize(12);
  if (width < 600){
    textSize(8)
  }
}

function draw() {
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  let number = 0;
  let mousePosX = mouseX;
  let mousePosY = mouseY;

  /*if (mousePosX == oldMouseX){
    mousePosX = width/2;
  }
  if (mousePosY == oldMouseY){
    mousePosY = height/2;
  }*/
  let x = floor(mousePosX/cellSize);
  let y = floor(mousePosY/cellSize);
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i<cellsWide; i++) {
    for (let j = 0; j<cellsHigh; j++) {
      cells[i][j].next();
      cells[i][j].display();
      //let dist = toroidalDistance(i,j,x,y)
      //console.log(dist);
      //cells[i][j].growthMod = 4-(dist/5);
      if (cells[i][j].life != null){
        number++;
        //console.log(number);
      }
    }
  }
  //prletln(cells[i][j].pos, cells[i][j].life);
  
  x = constrain(x, 0, cellsWide-1);
  y = constrain(y, 0, cellsHigh-1);
  
  
  if (mousePosX != oldMouseX && mousePosY != oldMouseY){
   cells[x][y].clicked();
    push();
  fill(0,0,0,0.5);
  noStroke()
  ellipse((x*cellSize)+cellSize/2,(y*cellSize)+cellSize/2,cellSize,cellSize);
  pop();
    //console.log("clicked");
  } else if (number == 0){
    console.log(number);
    cells[ceil(cellsWide/2)-1][ceil(cellsHigh/2)-1].clicked();
    //console.log("time clicker");
  }
  
  //console.log(i,j);
  oldMouseX = mouseX;
  oldMouseY = mouseY;
  sample3 = ceil(infSample/(1+((infSample-1)/number)));
  //real average
  //translate(-20, 0);
  push();
  translate(width/2, height-(sizerHeight*1.25));
  fill(average());
  rect(0, 0, sizer*6, sizerHeight/2);
  fill(invert(average()));
  text("Real Average n=" + number, 0, 0);
  pop();

  push();
  translate(width/2, height-(sizerHeight*0.5));
  push();
  translate(-sizer*2.5, 0);
  fill(dumbBin());
  rect(0, 0, sizer, sizerHeight);
  fill(invert(dumbBin()));
  text("RGB Parties \n Winner takes all", 0, 0);
  pop();

  push();
  translate(-sizer*1.5, 0);
  fill(CMYKbin());
  rect(0, 0, sizer, sizerHeight);
  fill(invert(CMYKbin()));
  text("CMY Parties \n Winner takes all", 0, 0);
  pop();

  push();
  translate(-sizer*0.5, 0);
  fill(bin());
  rect(0, 0, sizer, sizerHeight);
  fill(invert(bin()));
  text("RGB Parties \n Proportional \n Representation", 0, 0);
  pop();

  push();
  translate(sizer*1.5, 0);
  fill(sortition(sample3, number));
  rect(-(sizer), 0, sizer, sizerHeight);
  fill(invert(sortition(sample3, number)));
  text("Sortition \n n=" + sample3, -sizer, 0);
  fill(sortition(sample2, number));
  rect(0, 0, sizer, sizerHeight);
  fill(invert(sortition(sample2, number)));
  text("Jury \n n=" + sample2, 0, 0);
  fill(sortition(sample1, number));
  rect(sizer, 0, sizer, sizerHeight);
  fill(invert(sortition(sample1, number)));
  text("Lottery \n n=" + sample1, sizer, 0);
  pop();
  pop();

  fill(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
    cellSize = (sqrt(width*(height-(sizerHeight*2))))/squareRootCells;
  //console.log(cellSize);
  cellsWide = ceil((width)/cellSize);
  cellsHigh = ceil((height-(sizerHeight*1.5))/cellSize);
  sizer = width/6;
    total = cellsWide*cellsHigh;
  for (let i = 0; i< cellsWide; i++) {
    cells[i] = [];
    for (let j = 0; j<  cellsHigh; j++) {
      let pos = createVector(i, j);
      cells[i][j] = new Cell(cellSize, pos);
      cells[i][j].display();
    }
  }
  for (let i = 0; i< cellsWide; i++) {
    for (let j = 0; j< cellsHigh; j++) {
      cells[i][j].init();
    }
  }
  textSize(12);
  if (width < 600){
    textSize(8)
  }
}

function average() {
  colorMode(RGB, 1);
  let r = 0;
  let g = 0;
  let b = 0;
  let num = 0;
  for (let i = 0; i<cellsWide; i++) {
    for (let j = 0; j<cellsHigh; j++) {
      if (cells[i][j].life != null) {
        r += red(cells[i][j].life.c);
        g += green(cells[i][j].life.c);
        b += blue(cells[i][j].life.c);
        num++;
      }
    }
  }
  return color(r/num, g/num, b/num);
}

function sortition(s, n) {
  if (n > s) {
    let coords = [];
    colorMode(RGB, 1);
    let num = 0;
    for (let i = 0; i<cellsWide; i++) {
      for (let j = 0; j<cellsHigh; j++) {
        if (cells[i][j].life != null) {
          /*
          let redcol = red(cells[i][j].life.c);
          let greencol = green(cells[i][j].life.c);
          let bluecol = blue(cells[i][j].life.c);*/
          //console.log(redcol,greencol,bluecol);
          coords[num] = createVector(i,j);
          num++;
        }
      }
    }
    let r = 0;
    let g = 0;
    let b = 0;
/*
    let colorsPop = [];

    for (let i; i < colors.length; i++) {
      colorsPop.push(colors[i]);
    }*/

    for (let i = 0; i < s; ++i) {
      let select = floor(random(n-i));
      let removed = coords.splice(select,1);
      //console.log(removed);
      selectedColor = cells[removed[0].x][removed[0].y].life.c;
      r += red(selectedColor);
      g += green(selectedColor);
      b += blue(selectedColor);
      //println(i);
    }
    //println(n, s, r/s, g/s, b/s);
    return color(r/s, g/s, b/s);
  } else {
    //println(n, s);
    return color(0);
  }
}

function CMYKbin() {
  colorMode(RGB, 1);
  let col = color(0.33, 0.33, 0.33);
  let cy = 0;
  let m = 0;
  let y = 0;
  for (let i = 0; i<cellsWide; i++) {
    for (let j = 0; j<cellsHigh; j++) {
      if (cells[i][j].life != null) {
        let c = cells[i][j].life.c;
        let cyan = blue(c) + green(c);
        let magenta = red(c) + blue(c);
        let yellow = red(c) + green(c);

        if (cyan > magenta && cyan > yellow) {
          cy++;
        } else if (magenta > cyan && magenta > yellow) {
          m++;
        } else if (yellow > cyan && yellow > magenta) {
          y++;
        }
      }
      if (cy > m && cy > y) {
        col = color(0, 0.5, 0.5);
      }
      if (m > cy && m > y) {
        col = color(0.5, 0, 0.5);
      }
      if (y > cy && y > m) {
        col = color(0.5, 0.5, 0);
      }
    }
  }
  return col;
}



function bin() {
  colorMode(RGB, 1);
  let r = 0;
  let g = 0;
  let b = 0;
  let num = 0;
  for (let i = 0; i<cellsWide; i++) {
    for (let j = 0; j<cellsHigh; j++) {
      if (cells[i][j].life != null) {
        let c = cells[i][j].life.c;
        num++;
        if ( red(c) > green(c) && red(c) > blue(c)) {
          r++;
        } else if (green(c) > red(c) && green(c) > blue(c)) {
          g++;
        } else if (blue(c) > red(c) && blue(c) > green(c)) {
          b++;
        }
      }
    }
  }
  //println(r, g, b, r+g+b);
  let col = color(r/num, g/num, b/num);
  return col;
}

function dumbBin() {
  colorMode(RGB, 1);
  let col = color(0.33, 0.33, 0.33);
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i<cellsWide; i++) {
    for (let j = 0; j<cellsHigh; j++) {
      if (cells[i][j].life != null) {
        let c = cells[i][j].life.c;
        if ( red(c) > green(c) && red(c) > blue(c)) {
          r++;
        } else if (green(c) > red(c) && green(c) > blue(c)) {
          g++;
        } else if (blue(c) > red(c) && blue(c) > green(c)) {
          b++;
        }
      }
    }
  }
  if (r > g && r > b) {
    col = color(1, 0, 0);
  }
  if (g > r && g > b) {
    col = color(0, 1, 0);
  }
  if (b > g && b > r) {
    col = color(0, 0, 1);
  }
  return col;
}

function toroidalDistance (x1, y1, x2, y2)
{
    let dx = abs(x2 - x1);
    let dy = abs(y2 - y1);
 
    if (dx > (cellsWide/2))
        dx = cellsWide - dx;
 
    if (dy > (cellsHigh/2))
        dy = cellsHigh - dy;
 
    return sqrt(dx*dx + dy*dy);
}

function invert(c) {
  colorMode(RGB, 1);
  let redcol = 1 - red(c);
  let greencol = 1 - green(c);
  let bluecol = 1 - blue(c);
  var col = color(redcol, greencol, bluecol);
  if (red(c)+green(c)+blue(c) > 1.5) {
    col = color(0, 0, 0);
  } else {
    col = color(1, 1, 1);
  }

  return col;
}

//LIFE CLASS

class Life {
  constructor(parent) {
    this.cell = parent;
    this.hue = random(1);
    this.metabolism = random(1);
    this.size = random(1);
    this.agression = random(1);
    let mappedS = map((this.metabolism),0,1,0.5,1);
    let mappedL = map(1-(this.agression),0,1,0.5,1);
    colorMode(HSB,1);
    this.c = color(this.hue, mappedS, mappedL);
  }

  lifestats(h, m, a) {
    this.hue = h;
    this.metabolism = m;
    this.size = this.cell.food/2;
    this.agression = a;
    let mappedS = map((this.metabolism),0,1,0.5,1);
    let mappedL = map(1-(this.agression),0,1,0.5,1);
    colorMode(HSB,1);
    this.c = color(this.hue, mappedS, mappedL);
  }

  update() {
    this.cell.food = this.cell.food-(this.metabolism*this.size);
    //food in cell goes down in proportion to metablism and createCanvas
    this.size *= this.cell.food/this.size;
    // size change is proportional to excess or surplus food
    this.size = constrain(this.size,0,1);
    if (this.size < 0.2) {
      this.cell.killLife();
    }
    //console.log(metabolism, cell.food, createCanvas);
    if (random(1)*random(1) < this.metabolism) {
    //if (random(0.5) < metabolism) {  
      this.haveChild();
    }
    let n = 0;
    let e = 0;
    let s = 0;
    let w = 0;
    if (this.cell.north != null) {
      if (this.cell.north.life != null) {
        n = 1-this.cell.north.life.agression;
      }
    }
    if (this.cell.east != null) {
      if (this.cell.east.life != null) {
        e = 1-this.cell.east.life.agression;
      }
    }
    if (this.cell.south != null) {
      if (this.cell.south.life != null) {
        s = 1-this.cell.south.life.agression;
      }
    }
    if (this.cell.west != null) {
      if (this.cell.west.life != null) {
        w = 1-this.cell.west.life.agression;
      }
    }
    this.resistance = ((n+e+s+w)/4)/this.agression;
  }

  haveChild() {
    let i = round(random(4));
    //console.log(i);
    //prletln("i: " + i);
    let h = this.hue*(random(0.95, 1.05));
    //let h = resistance;
    if (h<0) {
      h+=1;
    }
    if (h>1) {
      h-=1;
    }
    let a = this.agression*(random(0.95, 1.05));
    if (a<0) {
      a+=1;
    }
    if (a>1) {
      a-=1;
    }
    let m = this.metabolism*(random(0.95, 1.05));
    if (m<0) {
      m+=1;
    }
    if (m>1) {
      m-=1;
    }
    //prletln(h, m, a);
    switch(i) {
    case 0:
      if (this.cell.north != null) {
        let l = new Life(this.cell.north);
        l.lifestats(h, m, a);
        this.cell.north.addExistingLife(l);
        //console.log(h,m,a);
      }
      break;
    case 1:
      if (this.cell.east != null) {
        let l = new Life(this.cell.east);
        l.lifestats(h, m, a);
        this.cell.east.addExistingLife(l);
        //console.log(h,m,a);
      }
      break;
    case 2:
      if (this.cell.south != null) {
        let l = new Life(this.cell.south);
        l.lifestats(h, m, a);
        this.cell.south.addExistingLife(l);
        //console.log(h,m,a);
      }
      break;
    case 3:
      if (this.cell.west != null) {
        let l = new Life(this.cell.west);
        l.lifestats(h, m, a);
        this.cell.west.addExistingLife(l);
        //console.log(h,m,a);
      }
    }
  }
}

//Cell CLASS

class Cell {
  constructor(s, p) {
    this.size = s;
    //this.growthMod = 1;
    this.pos = createVector(p.x,p.y);
    this.food = random(1);
    this.occupied = false;
    this.life = null;
    this.north = null;
    this.east = null;
    this.south = null;
    this.west = null;
    this.growth = (noise((p.x/10)+second()/100, (p.y/10)+second()/100)*constGrowth);
    //this.growth=this.growthMod;
    this.agro = 0;
    this.defence = 0;
    this.lifeMargin = 0;
  }

  foodOccupied(f, o) {
    this.food = f;
    this.occupied = o;
  }


  init() {
    if (this.pos.y-1 > -1) {
      this.north = cells[this.pos.x][this.pos.y-1];
    } else {
      this.north = cells[this.pos.x][cellsHigh-1];
    }
    if (this.pos.x+1 < cellsWide) {
      this.east = cells[this.pos.x+1][this.pos.y];
    } else {
      this.east = cells[0][this.pos.y];
    }
    if (this.pos.y+1 < cellsHigh) {
      this.south = cells[this.pos.x][this.pos.y+1];
    } else {
      this.south = cells[this.pos.x][0];
    }
    if (this.pos.x-1 > -1) {
      this.west = cells[this.pos.x-1][this.pos.y];
    } else {
      this.west = cells[cellsWide-1][this.pos.y];
    }
  } 
  
  displayLife() {
    if (this.life != null) {
      push(); // isolate translation
      strokeWeight(0);
      colorMode(HSB, 1);
      //fill(life.hue, life.metabolism, 1-life.agression);
      //fill(life.hue, map((1-life.agression),0,1,0.2,0.8), map(life.metabolism,0,1,0.2,0.8));
      fill(this.life.c);
      rectMode(CENTER); // draw from centre
      ellipseMode(CENTER);
      translate(this.size/2, this.size/2); //translate by half the createCanvas
      translate(this.size*this.pos.x, this.size*this.pos.y);
      ellipse(0,0,(this.size*this.life.size)+2, (this.size*this.life.size)+2);
      //rect(0, 0, (createCanvas*life.createCanvas)+2, (createCanvas*life.createCanvas)+2); // draw the square
      pop(); // out
    }
  }

  display() {
    push(); // isolate translation
    noStroke();
    strokeWeight(0);
    colorMode(HSB, 1);
    if (showfood == true) {
      fill(this.food/2, 0.5);
    } else {
      fill(bkgcol);
    }
    rectMode(CENTER); // draw from centre
    translate(this.size/2, this.size/2); //translate by half the size
    translate(this.size*this.pos.x, this.size*this.pos.y);
    rect(0, 0, this.size, this.size); // draw the square
    pop(); // out
    this.displayLife();
  }



  addLife() {
    if (this.life == null) {
      this.life = new Life(this);
      this.displayLife();
    }
  }

  addExistingLife(l) {
    if (this.life == null) {
      this.life = l;
      this.displayLife();
    } else if (this.life.resistance > l.agression) {
      this.defence++;
      this.life.resistance *= 1.01;
      this.displayLife();
    } else if (this.life.resistance < l.agression) {
      this.agro++;
      this.food *= this.life.size;
      l.agression *= 1.01;
      this.life = l;
      this.displayLife();
    }
  }

  killLife() {
    if (this.life != null) {
      //prletln(agro, defence);
      //prletln(food);
      this.food += this.life.size/2;
      //growth += 0.1;
      //prletln(growth);
      this.life = null;
      this.displayLife();
    }
  }

  clicked() {
    if (this.life == null) {
      this.addLife();
    } else {
      this.killLife();
    }
  }

  next() {
    this.growth = (noise((this.pos.x/10)+second()/100, (this.pos.y/10)+second()/100)*constGrowth);
    //this.growth=this.growthMod;
    if (this.life != null) {
      this.life.update();
    } else {
      this.food = this.growth*this.food*(1-this.food);
    }
    this.food = constrain(this.food, 0.01, 1);
    if (this.food == 0 && this.growth > 1 && random(1) > 0.99) {
      this.food+=0.01;
    }
  }
}