const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');

const users = {};
const hello = `嗨我是小醒，灵感来自上一届创新赛的\"三醒\"。\n\n我每天会主动问你三个问题，然后我会尝试从你的回答里进行分析，希望能越来越了解你，请畅所欲言吧～`;

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log('sanxing', 'hello', data);
    const { userid } = data;
    const [user] = await db.findUserById(userid);
    if (!user) {
      db.createUser(userid);
      const question_numbers = api.getQuestionNumbers(userid);
      const questions = await db.findQuestionsByIds(question_numbers);
      users[userid] = {
        questions,
        question_number: 0,
      };
      const messages = [hello, questions[0].question];
      socket.emit('messages', { messages });
    } else {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      if (!user.last_time || user.last_time < today) {
        console.log(123);
        console.log(users[userid]);
        const question_numbers = api.getQuestionNumbers(userid);
        const questions = await db.findQuestionsByIds(question_numbers);
        users[userid] = {
          questions,
          question_number: 0,
        };
        socket.emit('message', { message: questions[0].question });
      }
    }
    db.updateLastTime(userid, new Date());
  });

  socket.on('message', async (data) => {
    console.log('sanxing', 'message', data);
    const { userid, message } = data;
    console.log(users[userid]);
    if (users[userid].question_number < 3) {
      const { questionid } = users[userid].questions[users[userid].question_number];
      db.createAnswer(userid, questionid, message);
      users[userid].question_number += 1;
      if (users[userid].question_number !== 3) {
        const { question } = users[userid].questions[users[userid].question_number];
        socket.emit('message', { message: question });
      } else {
        socket.emit('message', { message: '好哒，通过你这三个回答，小醒会更加了解你的！请期待属于你的三醒周报吧～' });
      }
    }
  });
});

server.listen(config.sanxing.port);
