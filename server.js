var cars = [];
function Car(id, xpos, ypos, xvel, yvel, xacc, yacc, radius){
  this.id = id;
  this.xpos = xpos;
  this.ypos = ypos;
  this.xvel = xvel;
  this.yvel = yvel;
  this.xacc = xacc;
  this.yacc = yacc;
  this.radius = radius;
}
var express = require('express');
var app = express();
var server = app.listen(8080);
app.use(express.static('public'));
console.log("Server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

setInterval(carbeat, 8);

function carbeat(){
  io.sockets.emit('carbeat', cars);
}
function newConnection(socket){
  var car = new Car(socket.id, socket.xpos, socket.ypos, socket.xvel, socket.yvel, socket.xacc, socket.yacc, socket.radius);
  cars.push(car);
  //console.log('New connection: ' + socket.id);

socket.on('update', carMsg);

function carMsg(data) {
  var car;
  for(var i= 0; i<cars.length; i++){
    if(socket.id == cars[i].id){
      car = cars[i];
    }
  }

  car.xpos = data.xpos;
  car.ypos = data.ypos;
  car.xvel = data.xvel;
  car.yvel = data.yvel;
  car.xacc = data.xacc;
  car.yacc = data.yacc;
  car.radius = data.radius;

  socket.broadcast.emit('carbeat', data);
  //io.sockets.emit('carbeat', data);
  console.log(data);
};
}
