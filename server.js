
import { Server } from 'socket.io';
const server = new Server({ port: '8080'})

server.on('connection', socket => {
  console.log('Server connected')

  server.on ('img_update', (data) =>
		socket.broadcast.emit('img_update',{ x : data.x, y : data.y, type: data.type}
		
    )
)}).call(this);






/*
import { Server } from 'ws'
const server = new Server({port: '8080'})

server.on('connection', socket => {

  console.log('Connection found.')
})
*/
/*
(function() {
    var io;
    io = require('socket.io').listen(8080);
    io.sockets.on('connection', function(socket) {
      socket.on('drawClick', function(data) {
        socket.broadcast.emit('ev_canvas', {
          x: data.x,
          y: data.y,
          type: data.type
        });
      });
    });
  }).call(this);
  */
/*

import { Server } from 'ws';
const server = new Server({port: '8080'})

server.on('connection', socket => {
    socket.on('blackboardPlaceholder', canvas => {
        socket.emit(canvas)
    });
});

*/
/*
(function() {
  var io;
  io = require('socket.io').listen(8080);
  io.sockets.on('connection', function(socket) {
    socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type
      });
    });
  });
}).call(this);






const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('draw', (draw) => {
        console.log(draw);
        io.emit('draw', `${socket.id.substr(0,2)} said ${draw}`);
    });
});

http.listen(8080, () => console.log('listening on http://localhost:8080'));
*/
