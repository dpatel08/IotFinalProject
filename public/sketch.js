var socket;
var car;
var cars =[];

function setup() {
  createCanvas(800, 800); //bg
  tempCarX = 0;
  tempCarY = 0;
  track = new Track(); //track
  while(!track.isOnTrack(tempCarX, tempCarY, 20)){
    tempCarX = random(width);
    tempCarY = random(height);
  }
  car = new Car(tempCarX, tempCarY, 255, 255, 255); //car
  brake = loadImage("img/brakev2.png");
  gas = loadImage("img/gasv2.png");
  fr = 24; //frameRate
  currentTheta = 0;
  safeMode = true;
  frameRate(fr);

  socket = io.connect();
  var data = {
    id: socket.id,
    xpos: car.x,
    ypos: car.y,
    xspeed: car.xspeed,
    yspeed: car.yspeed,
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

    for (var i = cars.length - 1; i >= 0; i--){
      var id = cars[i].id;
      if(id !== socket.id) {
        deltaX = car.x - cars[i].xpos;
        deltaY = car.y - cars[i].ypos;
        d = sqrt(deltaX * deltaX + deltaY * deltaY);
        if(d < car.radius/2 + cars[i].radius/2){
          if(deltaX < 0){
            car.x -= 3;
          }
          else {
            car.x += 3;
          }
          if(deltaY < 0){
            car.y -= 3;
          }
          else {
            car.y += 3;
          }
          if(car.xspeed == 0){
            car.xspeed = cars[i].xspeed * .8;
          }
          else {
            car.xspeed *= -.3;
          }
          if(car.yspeed == 0){
            car.yspeed = cars[i].yspeed * .8;
          }
          else {
            car.yspeed *= -.3;
          }


        }

        fill(0,0,255);
        ellipse(cars[i].xpos, cars[i].ypos, cars[i].radius, cars[i].radius);
      }
       // console.log("ID:\t" + socket.id + "\tCar:\t" + cars[i].id );
    }

  } else {
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

    for (var i = cars.length - 1; i >= 0; i--){
      var id = cars[i].id;
      if(id !== socket.id) {
        deltaX = car.x - cars[i].xpos;
        deltaY = car.y - cars[i].ypos;
        d = sqrt((deltaX * deltaX) + (deltaY * deltaY));
        if(d < car.radius + cars[i].radius){
          if(deltaX  <  car.radius + cars[i].radius){
            car.x -= 1;
          }
          else {
            car.x += 1;
          }
          if(deltaY <  car.radius + cars[i].radius){
            car.y -= 1;
          }
          else {
            car.y += 1;
          }
          car.xspeed *= -1;
          car.yspeed *= -1;
        }

        fill(0,0,255);
        ellipse(cars[i].xpos, cars[i].ypos, cars[i].radius, cars[i].radius);
      }
       // console.log("ID:\t" + socket.id + "\tCar:\t" + cars[i].id );
    }
  }



  var data = {
    id: socket.id,
    xpos: car.x,
    ypos: car.y,
    xspeed: car.xspeed,
    yspeed: car.yspeed,
    radius: car.radius
  }
  // car.carCollision(cars);
  socket.emit('update', data);
}
