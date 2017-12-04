var socket;
var car;
var cars =[];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  tempX = 0;
  tempY = 0;

  track = new Track(); //track
  while(!track.isOnTrack(tempX, tempY, 20)){
    tempX = random(width);
    tempY = random(height);
  }
  car = new Car(tempX, tempY, 255, 255, 255, width, height); //car
  brake = loadImage("img/brakev2.png");
  gas = loadImage("img/gasv2.png");
  up = loadImage("img/up_Arrow.png");
  right = loadImage("img/right_Arrow.png");
  down = loadImage("img/down_Arrow.png");
  left = loadImage("img/left_Arrow.png");
  // posXmsg = "Position X:\t";
  // posYmsg = "Position Y:\t";
  // ovrVelmsg = "Velocity:\t";
  fr = 24; //frameRate
  currentTheta = 0;
  safeMode = false;
  frameRate(fr);
  checkbox = createCheckbox('Safe Mode', false);
  checkbox.position(width/2 - 20, height/2);
  checkbox.changed(myCheckedEvent);
  socket = io.connect();
  var data = {
    id: socket.id,
    xpos: car.x,
    ypos: car.y,
    xspeed: car.xspeed,
    yspeed: car.yspeed,
    radius: car.radius,
    trackWidth: car.trackWidth,
    trackHeight: car.trackHeight
  }
  socket.emit('connection', data)
  socket.on('carbeat',
  function(data) {
    cars = data;
  });
}

function myCheckedEvent() {
  if (this.checked()) {
      safeMode = true;
  } else {
      safeMode = false;
  }
}

function newDrawing(data){
  fill(245, 245, 24);
  ellipse(data.xpos, data.ypos, data.radius, data.radius);
}

function draw() {
  var arrow_width = 40;
  background(51, 51, 51);
  track.drawTrack();
  gasx=(window.innerWidth-track.outerWidth)/2+track.outerWidth+(window.innerWidth-track.outerWidth)/4;
    var gasy=(window.innerHeight/2);
    var arrow_width=40;
    image(up, gasx, gasy-arrow_width, arrow_width, arrow_width);
    image(right, gasx+arrow_width, gasy, arrow_width, arrow_width);
    image(down, gasx, gasy+arrow_width, arrow_width, arrow_width);
    image(left, gasx-arrow_width, gasy, arrow_width, arrow_width);

  if (safeMode === false) {
    car.update();
    car.show();

    for (var i = 0; i < touches.length; i++) {
        if ((touches[i].x > gasx && touches[i].x < gasx+arrow_width) && (touches[i].y > gasy-arrow_width && touches[i].y < gasy-arrow_width + arrow_width)) {
            car.dir(0, -.2);
        }
        if ((touches[i].x > gasx+arrow_width && touches[i].x < gasx+arrow_width + arrow_width) && (touches[i].y > gasy && touches[i].y < gasy + arrow_width)) {
            car.dir(.2, 0);
        }
        if ((touches[i].x > gasx && touches[i].x < gasx + arrow_width) && (touches[i].y > gasy+arrow_width && touches[i].y < gasy+arrow_width+arrow_width)) {
            car.dir(0, .2);
        }
        if ((touches[i].x > gasx-arrow_width && touches[i].x < gasx-arrow_width + arrow_width) && (touches[i].y > gasy && touches[i].y < gasy+arrow_width)) {
            car.dir(-.2, 0);
        }

        if ((touches[i].x > gasx-arrow_width && touches[i].x < gasx) && (touches[i].y > gasy-arrow_width && touches[i].y < gasy-arrow_width + arrow_width)) {
            car.dir(-.2, -.2);
        }
        if ((touches[i].x > gasx+arrow_width && touches[i].x < gasx+arrow_width+arrow_width) && (touches[i].y > gasy-arrow_width && touches[i].y < gasy-arrow_width + arrow_width)) {
            car.dir(.2, -.2);
        }
        if ((touches[i].x > gasx-arrow_width && touches[i].x < gasx) && (touches[i].y > gasy+arrow_width && touches[i].y < gasy+arrow_width+arrow_width)) {
          car.dir(-.2, .2);
        }
        if ((touches[i].x > gasx+arrow_width && touches[i].x < gasx+arrow_width+arrow_width) && (touches[i].y > gasy+arrow_width && touches[i].y < gasy+arrow_width+arrow_width)) {
          car.dir(.2, .2);
        }
      }


    if (keyIsDown(88) || keyIsDown(120)) { //x for brake
      car.deccelerate();
      image(brake, 25, 670, brake.width / 2.2, brake.height / 2.2); //make brake smaller, appear depressed
    } else {
      image(brake, 25, 670, brake.width / 2, brake.height / 2);
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
      // text(posXmsg + round(car.x), 300, 350);
      // text(posYmsg + round(car.y), 300, 375);
      // text(ovrVelmsg + parseFloat(sqrt(car.xspeed * car.xspeed + car.yspeed * car.yspeed)).toFixed(2), 300, 400);
       // console.log("ID:\t" + socket.id + "\tCar:\t" + cars[i].id );
    }

  } else {
    car.update();
    car.show();
    for (var i = 0; i < touches.length; i++) {
        if ((touches[i].x > gasx && touches[i].x < gasx+arrow_width) && (touches[i].y > gasy-arrow_width && touches[i].y < gasy-arrow_width + arrow_width)) {
            car.dir(0, -.2);
        }
        if ((touches[i].x > gasx+arrow_width && touches[i].x < gasx+arrow_width + arrow_width) && (touches[i].y > gasy && touches[i].y < gasy + arrow_width)) {
            car.dir(.2, 0);
        }
        if ((touches[i].x > gasx && touches[i].x < gasx + arrow_width) && (touches[i].y > gasy+arrow_width && touches[i].y < gasy+arrow_width+arrow_width)) {
            car.dir(0, .2);
        }
        if ((touches[i].x > gasx-arrow_width && touches[i].x < gasx-arrow_width + arrow_width) && (touches[i].y > gasy && touches[i].y < gasy+arrow_width)) {
            car.dir(-.2, 0);
        }

        if ((touches[i].x > gasx-arrow_width && touches[i].x < gasx) && (touches[i].y > gasy-arrow_width && touches[i].y < gasy-arrow_width + arrow_width)) {
            car.dir(-.2, -.2);
        }
        if ((touches[i].x > gasx+arrow_width && touches[i].x < gasx+arrow_width+arrow_width) && (touches[i].y > gasy-arrow_width && touches[i].y < gasy-arrow_width + arrow_width)) {
            car.dir(.2, -.2);
        }
        if ((touches[i].x > gasx-arrow_width && touches[i].x < gasx) && (touches[i].y > gasy+arrow_width && touches[i].y < gasy+arrow_width+arrow_width)) {
          car.dir(-.2, .2);
        }
        if ((touches[i].x > gasx+arrow_width && touches[i].x < gasx+arrow_width+arrow_width) && (touches[i].y > gasy+arrow_width && touches[i].y < gasy+arrow_width+arrow_width)) {
          car.dir(.2, .2);
        }
      }

    if (keyIsDown(88) || keyIsDown(120)) { //x for brake
      car.deccelerate();
      image(brake, 25, 670, brake.width / 2.2, brake.height / 2.2); //make brake smaller, appear depressed
    } else {
      image(brake, 25, 670, brake.width / 2, brake.height / 2);
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
      // text(posXmsg + round(car.x), 300, 350);
      // text(posYmsg + round(car.y), 300, 375);
      // text(ovrVelmsg + round(sqrt(car.xspeed * car.xspeed + car.yspeed * car.yspeed)), 300, 400);
       // console.log("ID:\t" + socket.id + "\tCar:\t" + cars[i].id );
    }
  }


  var data = {
    id: socket.id,
    xpos: car.x,
    ypos: car.y,
    xspeed: car.xspeed,
    yspeed: car.yspeed,
    radius: car.radius,
    trackWidth: car.trackWidth,
    trackHeight: car.trackHeight
  }
  // car.carCollision(cars);
  socket.emit('update', data);
}
