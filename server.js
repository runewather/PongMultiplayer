var express = require('express');
var path = require('path');
var app = express();

var http = require('http');
var server = http.Server(app);

var io = require('socket.io')(server);

var id1 = 8080;
var id2 = 9090;

var serverData = 
{
    x1: 30,
    y1: 200,
    x2: 750,
    y2: 200,
};

var clientResponse = 
{
  id: null,
  cmd: null
}

app.use(express.static('Game'));

app.get('/', function(req, res){
  res.sendfile(path.resolve(__dirname+'/game.html'));
});

app.get('/controller', function(req, res){
  res.sendfile(path.resolve(__dirname+'/controller.html'));
});

io.on('connection', function(socket) {
    socket.on('event', function(cmd) {
      //console.log("Y1: " + serverData.y1);
    if(cmd.id == id1 && cmd.cmd == 'up')
    {
      serverData.y1 = serverData.y1 - 3; 
    }
    if(cmd.id == id1 && cmd.cmd == 'down')
    {
      serverData.y1 = serverData.y1 + 3; 
    }
    
    if(cmd.id == id2 && cmd.cmd == 'up')
    {
      serverData.y2 = serverData.y2 - 3; 
    }
    if(cmd.id == id2 && cmd.cmd == 'down')
    {
      serverData.y2 = serverData.y2 + 3; 
    }
    
    socket.emit('update' ,serverData);
  });
  
  socket.on('start', function () {
    io.emit('start', serverData);
  });
  
  socket.on('disconnect', function () {
    io.emit('message', "User disconnected");
  });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Chat server running at", addr.address + ":" + addr.port);
});
