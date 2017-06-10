const express = require('express');
const app = express();
const socketIo = require('socket.io');


const http = require('http');
const server = http.Server(app);
const io = socketIo(server);
// websocket

//io class Server
//io.of(namespace) pour se connecter sur un namespace class Namespace


const getQuestion = require('./question/QuestionController.js');
const Api = require('./api.js');
require('dotenv').config()


server.listen(3100, function () {
  console.log('Example app listening on port 3100!');
});
/*
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
*/

app.get(['/','/question','/question/:category'], getQuestion);

const rooms = {
  smash_lab: [],
  lock: false
}
io.on('connection', (socket) => {
  if(rooms.lock || rooms.smash_lab.length > 1)socket.disconnect(true);
  else{
    const index = 0 
    socket.room = 'lab_' + index; 
    rooms.smash_lab.push(socket.id);
    console.log(rooms.smash_lab);
    socket.join(socket.room);
    socket.emit('lab', socket.id);

    socket.on('start', () => {
      socket.to(socket.room).broadcast.emit('start', socket.id);
    });

    socket.on('match', () => {
      rooms.lock = true;
      socket.to(socket.room).broadcast.emit('match', socket.id);
    })

    socket.on('heroSelected', (hero_id) => {
      socket.to(socket.room).broadcast.emit('enemySelection', hero_id);
    });

    socket.on('attack', (enemy) => {
      socket.to(socket.room).broadcast.emit('attack', enemy);
    });
  }
  socket.on('disconnect', () => {
    rooms.smash_lab.splice(rooms.smash_lab.indexOf(socket.id), 1);
    rooms.lock = rooms.smash_lab.length;
    socket.to(socket.room).emit('friendDisconnect');
    console.log(rooms.lock);
    console.log(rooms.smash_lab);
    // do some stuff
    console.log('disconnect');
  });
});


app.use('/api', Api);




