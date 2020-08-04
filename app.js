const express = require('express');
const bodyParser = require('express');

const apiRoute = require('./routes/apiRoute.route');
const app = express();
const http = require('http')
// Set up mongoose connection
const mongoose = require('mongoose');
const path = require('path');
const CONFIG = require('./common/CONFIG');
// let dev_db_url = 'mongodb://abhishek.singh@affle.com:Affle@123.mlab.com:23619/productstutorial';
// let dev_db_url = 'mongodb+srv://abhishek:affle@123@cluster0-iv0sv.mongodb.net/test?retryWrites=true';
let dev_db_url = 'mongodb://localhost:27017/abhiTestDB';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));

app.use(bodyParser.json()); //body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
app.use(bodyParser.urlencoded({extended: false})); //bodyParser.urlencoded extract the entire url and queries with url.
app.use('/api',apiRoute);
app.use(express.static(path.join(__dirname, '/assets')));
app.set('view engine', 'jade');
// app.use(express.static(path.join(__dirname, 'dist')))
app.get('/', function (req, res) {
  // res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  // res.send('<h1>Hello world</h1>');
  res.sendFile(path.join(__dirname, 'chatbot', 'index.html'))
});
app.get('/connect', function (req, res) {
  res.sendFile(path.join(__dirname, 'chatbot', 'chatbot.html'))
});

let server = http.createServer(app)
let io = require('socket.io')(server);
let port = CONFIG.port;

const activeUsers = new Set()
io.on('connection', (socket)=>{
  console.log('Socket connection established...');
  socket.on('new user', (data)=>{
    console.log(`${data.userName} is now online`);
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]); // io.emit sends for all users including me 
  });

  // when server disconnects from user
  socket.on('disconnect', ()=>{
    console.log(`${socket.userId} is now offline`);
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });
  socket.on('chat message',(data)=>{
    io.emit('chat message',data)
  })
  socket.on('typing',(data)=>{
    socket.broadcast.emit('typing',data)  // socket.brodcast sends for all users except me
  })
});
server.listen(port,()=>{
  console.log('Server is up and running on port number '+port);
})
