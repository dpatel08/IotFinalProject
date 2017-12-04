var socket;
var car;
var cars = [];

var gasx;
var gasy;
var arrow_width;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  tempX = 0;
  tempY = 0;

  track = new Track(); //track
  gasx = (window.innerWidth - track.outerWidth) / 2 + track.outerWidth + (window.innerWidth - track.outerWidth) / 4;
  gasy = (window.innerHeight / 2 + window.innerHeight / 4);
  brakex = (width * 1/20);
  brakey = (height * 8/10);
  arrow_width = 40;

  while (!track.isOnTrack(tempX, tempY, 20)) {
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
  fill(255, 165, 0);
  rect(width/2, height/2, 40, 40);

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
    function (data) {
      cars = data;
    });
}

function draw() {
  background(51, 51, 51);
  track.drawTrack();
  image(up, gasx, gasy - arrow_width, arrow_width, arrow_width);
  image(right, gasx + arrow_width, gasy, arrow_width, arrow_width);
  image(down, gasx, gasy + arrow_width, arrow_width, arrow_width);
  image(left, gasx - arrow_width, gasy, arrow_width, arrow_width);
  image(brake, brakex, brakey, brake.width / 4, brake.height / 4);
  if (safeMode===true) {
      fill(255, 165, 0);
      text("assisted", width/2, height/2 + 10 + 40);
  } else {
      fill(75, 156, 211);
      text("unassisted", width/2, height/2 + 10 + 40);
  }
  rect(width/2, height/2, 40, 40);

  if (safeMode === false) {
    car.update();
    car.show();

    for (var i = 0; i < touches.length; i++) {
      if ((touches[i].x > gasx && touches[i].x < gasx + arrow_width) && (touches[i].y > gasy - arrow_width && touches[i].y < gasy - arrow_width + arrow_width)) {
        car.dir(0, -.2);
      }
      if ((touches[i].x > gasx + arrow_width && touches[i].x < gasx + arrow_width + arrow_width) && (touches[i].y > gasy && touches[i].y < gasy + arrow_width)) {
        car.dir(.2, 0);
      }
      if ((touches[i].x > gasx && touches[i].x < gasx + arrow_width) && (touches[i].y > gasy + arrow_width && touches[i].y < gasy + arrow_width + arrow_width)) {
        car.dir(0, .2);
      }
      if ((touches[i].x > gasx - arrow_width && touches[i].x < gasx - arrow_width + arrow_width) && (touches[i].y > gasy && touches[i].y < gasy + arrow_width)) {
        car.dir(-.2, 0);
      }

      if ((touches[i].x > gasx - arrow_width && touches[i].x < gasx) && (touches[i].y > gasy - arrow_width && touches[i].y < gasy - arrow_width + arrow_width)) {
        car.dir(-.2, -.2);
      }
      if ((touches[i].x > gasx + arrow_width && touches[i].x < gasx + arrow_width + arrow_width) && (touches[i].y > gasy - arrow_width && touches[i].y < gasy - arrow_width + arrow_width)) {
        car.dir(.2, -.2);
      }
      if ((touches[i].x > gasx - arrow_width && touches[i].x < gasx) && (touches[i].y > gasy + arrow_width && touches[i].y < gasy + arrow_width + arrow_width)) {
        car.dir(-.2, .2);
      }
      if ((touches[i].x > gasx + arrow_width && touches[i].x < gasx + arrow_width + arrow_width) && (touches[i].y > gasy + arrow_width && touches[i].y < gasy + arrow_width + arrow_width)) {
        car.dir(.2, .2);
      }
      if ((touches[i].x > width/2 && touches[i].x < width/2 + 40) && (touches[i].y > height/2 && touches[i].y < height/2 + 40)) {
          safeMode = !safeMode;
      }
      if ((touches[i].x > brakex && touches[i].x < brakex + brake.width / 2) && (touches[i].y > brakey && touches[i].y < brakey + brake.height / 2)) {
          car.deccelerate();
      }

    }

    if (!track.isOnTrack(car.x, car.y, car.radius)) {
      car.handleBounce();
    }

    for (var i = cars.length - 1; i >= 0; i--) {
      var id = cars[i].id;
      if (id !== socket.id) {
        xRatio = car.trackWidth / cars[i].trackWidth;
        yRatio = car.trackHeight / cars[i].trackHeight;
        rRatio = car.radius / cars[i].radius;
        cars[i].xpos *= xRatio;
        cars[i].ypos *= yRatio;
        cars[i].radius *= rRatio;
        deltaX = car.x - cars[i].xpos;
        deltaY = car.y - cars[i].ypos;
        d = sqrt(deltaX * deltaX + deltaY * deltaY);
        if (d < car.radius / 2 + cars[i].radius / 2) {
          if (deltaX < 0) {
            car.x -= 3;
          } else {
            car.x += 3;
          }
          if (deltaY < 0) {
            car.y -= 3;
          } else {
            car.y += 3;
          }
          if (car.xspeed == 0) {
            car.xspeed = cars[i].xspeed * .8;
          } else {
            car.xspeed *= -.3;
          }
          if (car.yspeed == 0) {
            car.yspeed = cars[i].yspeed * .8;
          } else {
            car.yspeed *= -.3;
          }

        }

        fill(0, 0, 255);
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
      if ((touches[i].x > gasx && touches[i].x < gasx + arrow_width) && (touches[i].y > gasy - arrow_width && touches[i].y < gasy - arrow_width + arrow_width)) {
        car.dir(0, -.2);
      }
      if ((touches[i].x > gasx + arrow_width && touches[i].x < gasx + arrow_width + arrow_width) && (touches[i].y > gasy && touches[i].y < gasy + arrow_width)) {
        car.dir(.2, 0);
      }
      if ((touches[i].x > gasx && touches[i].x < gasx + arrow_width) && (touches[i].y > gasy + arrow_width && touches[i].y < gasy + arrow_width + arrow_width)) {
        car.dir(0, .2);
      }
      if ((touches[i].x > gasx - arrow_width && touches[i].x < gasx - arrow_width + arrow_width) && (touches[i].y > gasy && touches[i].y < gasy + arrow_width)) {
        car.dir(-.2, 0);
      }

      if ((touches[i].x > gasx - arrow_width && touches[i].x < gasx) && (touches[i].y > gasy - arrow_width && touches[i].y < gasy - arrow_width + arrow_width)) {
        car.dir(-.2, -.2);
      }
      if ((touches[i].x > gasx + arrow_width && touches[i].x < gasx + arrow_width + arrow_width) && (touches[i].y > gasy - arrow_width && touches[i].y < gasy - arrow_width + arrow_width)) {
        car.dir(.2, -.2);
      }
      if ((touches[i].x > gasx - arrow_width && touches[i].x < gasx) && (touches[i].y > gasy + arrow_width && touches[i].y < gasy + arrow_width + arrow_width)) {
        car.dir(-.2, .2);
      }
      if ((touches[i].x > gasx + arrow_width && touches[i].x < gasx + arrow_width + arrow_width) && (touches[i].y > gasy + arrow_width && touches[i].y < gasy + arrow_width + arrow_width)) {
        car.dir(.2, .2);
      }
      if ((touches[i].x > width/2 && touches[i].x < width/2 + 40) && (touches[i].y > height/2 && touches[i].y < height/2 + 40)) {
          safeMode = !safeMode;
      }
      if ((touches[i].x > brakex && touches[i].x < brakex + brake.width / 2) && (touches[i].y > brakey && touches[i].y < brakey + brake.height / 2)) {
          car.deccelerate();
      }
    }

    if (!track.isOnTrack(car.x, car.y, car.radius)) {
      car.handleBounce();
    }

    for (var i = cars.length - 1; i >= 0; i--) {
      var id = cars[i].id;
      if (id !== socket.id) {
        xRatio = car.trackWidth / cars[i].trackWidth;
        yRatio = car.trackHeight / cars[i].trackHeight;
        rRatio = car.radius / cars[i].radius;
        cars[i].xpos *= xRatio;
        cars[i].ypos *= yRatio;
        cars[i].radius *= rRatio;
        deltaX = car.x - cars[i].xpos;
        deltaY = car.y - cars[i].ypos;
        d = sqrt((deltaX * deltaX) + (deltaY * deltaY));
        if (d < car.radius + cars[i].radius) {
          if (deltaX < car.radius + cars[i].radius) {
            car.x -= 1;
          } else {
            car.x += 1;
          }
          if (deltaY < car.radius + cars[i].radius) {
            car.y -= 1;
          } else {
            car.y += 1;
          }
          car.xspeed *= -1;
          car.yspeed *= -1;
        }

        fill(0, 0, 255);
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
