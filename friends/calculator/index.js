const server = require('http').createServer();
const api = require('./api');
const config = require('../config');

const io = require('socket.io')(server, config.io);
const help = '抱歉，我解析不了该表达式';

io.on('connection', (socket) => {
  socket.on('hello', (data) => {
    console.log('calculator', 'hello', data);
  });

  socket.on('message', (data) => {
    console.log('calculator', 'message', data);
    let { message } = data;
    message = message.replace('×', '*');
    message = message.replace('÷', '/');
    try {
      const result = api.compute(message);
      socket.emit('message', { message: result.toString() });
    } catch (err) {
      socket.emit('message', { message: help });
    }
  })
});

server.listen(config.calculator.port);
