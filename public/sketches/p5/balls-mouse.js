//let squareRootCells = 100;
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

function setup() {
  //Declarations
  createCanvas(windowWidth, windowHeight);
  //you can change these paramenters, Smaller cellsize increases complexity non-linearly
  cellSize = 40;
  console.log(width,height);
  cellsWide = ceil(width/cellSize);
  cellsHigh = ceil(height/cellSize);
  console.log(cellsWide,cellsHigh);
  colorMode(RGB,1);
  //background color, dont change last value
  bkgcol = color(1,1,1,0.05);
  //dont change
  total = cellsWide*cellsHigh;
  //color[] colors = new color[total];
  showfood = false;
  constGrowth = 8;
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
  oldMouseX = mouseX;
  oldMouseY = mouseY;
}

function draw() {
  rectMode(CENTER);
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
  for (let i = 0; i<cellsWide; i++) {
    for (let j = 0; j<cellsHigh; j++) {
      cells[i][j].next();
      cells[i][j].display();
      let dist = toroidalDistance(i,j,x,y)
      //console.log(dist);
      cells[i][j].growthMod = 4-(dist/5);
      if (cells[i][j].life != null){
        //number++;
      }
    }
  }
  //prletln(cells[i][j].pos, cells[i][j].life);
  x = constrain(x, 0, cellsWide-1);
  y = constrain(y, 0, cellsHigh-1);
  if (mousePosX != oldMouseX && mousePosY != oldMouseY){
   cells[x][y].clicked();
  } else if (frameCount%15 == 0){
    cells[x][y].clicked();
    //console.log("time clicker");
  }
  //console.log(i,j);
  oldMouseX = mouseX;
  oldMouseY = mouseY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellsWide = ceil(width/cellSize);
  cellsHigh = ceil(height/cellSize);
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
    this.growthMod = 1;
    this.pos = createVector(p.x,p.y);
    this.food = random(1);
    this.occupied = false;
    this.life = null;
    this.north = null;
    this.east = null;
    this.south = null;
    this.west = null;
    //this.growth = (noise((p.x/10)+second()/100, (p.y/10)+second()/100)*constGrowth*this.growthMod);
    this.growth=this.growthMod;
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
    //this.growth = (noise((this.pos.x/10)+second()/100, (this.pos.y/10)+second()/100)*constGrowth*this.growthMod);
    this.growth=this.growthMod;
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