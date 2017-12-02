var socket;
var car;
var cars =[];

function setup() {
  createCanvas(800, 800); //bg
  car = new Car(255, 255, 255); //car
  track = new Track(); //track
  brake = loadImage("img/brakev2.png");
  gas = loadImage("img/gasv2.png");
  fr = 24; //frameRate
  currentTheta = 0;
  safeMode = false;
  frameRate(fr);

  socket = io.connect();
  var data = {
    id: socket.id,
    xpos: car.x,
    ypos: car.y,
    xspeed: car.xspeed,
    yspeed: car.yspeed,
    xaccel: car.xaccel,
    yaccel: car.yaccel,
    radius: car.radius
  }
  socket.emit('connection', data)
  socket.on('carbeat',
  function(data) {
    cars = data;
  });
}

function newDrawing(data){
  fill(245, 245, 24);
  ellipse(data.xpos, data.ypos, data.radius, data.radius);
}

function draw() {
  background(51, 51, 51);
  track.drawTrack();

  if (safeMode === false) {
    car.update();
    car.show();
    if (keyIsDown(UP_ARROW)) {
      car.dir(0, -.2);
    }
    if (keyIsDown(DOWN_ARROW)) {
      car.dir(0, .2);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      car.dir(.2, 0);
    }
    if (keyIsDown(LEFT_ARROW)) {
      car.dir(-.2, 0);
    }

    if (keyIsDown(82) || keyIsDown(114)) { //r for reset
      setup();
    }

    if (keyIsDown(88) || keyIsDown(120)) { //x for brake
      car.deccelerate();
      image(brake, 25, 670, brake.width / 2.2, brake.height / 2.2); //make brake smaller, appear depressed
    } else {
      image(brake, 25, 670, brake.width / 2, brake.height / 2);
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
      image(gas, width - 25 - gas.width / 2, 670, gas.width / 2.2, gas.height / 2.2); //make gas smaller, appear depressed
    } else {
      image(gas, width - 25 - gas.width / 2, 670, gas.width / 2, gas.height / 2);
    }

    if (!track.isOnTrack(car.x, car.y, car.radius)) {
      car.handleBounce();
    }
  } else {
    car.calcSpeed();
    car.safemode();
    car.show();
  }

  for (var i = cars.length - 1; i >= 0; i--){
    var id = cars[i].id;
    if(id !== socket.id) {
      fill(0,0,255);
      ellipse(cars[i].xpos, cars[i].ypos, cars[i].radius, cars[i].radius);
    }
     console.log("ID:\t" + socket.id + "\tCar:\t" + cars[i].id );
  }

  var data = {
    id: socket.id,
    xpos: car.x,
    ypos: car.y,
    xspeed: car.xspeed,
    yspeed: car.yspeed,
    xaccel: car.xaccel,
    yaccel: car.yaccel,
    radius: car.radius
  }

  socket.emit('update', data);
}
