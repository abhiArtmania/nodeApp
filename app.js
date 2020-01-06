const express = require('express');
const bodyParser = require('express');

const product = require('./routes/product.route');
const app = express();
// Set up mongoose connection
const mongoose = require('mongoose');
// let dev_db_url = 'mongodb://abhishek.singh@affle.com:Affle@123.mlab.com:23619/productstutorial';
let dev_db_url = 'mongodb+srv://abhishek:affle@123@cluster0-iv0sv.mongodb.net/test?retryWrites=true';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));

app.use(bodyParser.json()); //body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
app.use(bodyParser.urlencoded({extended: false})); //bodyParser.urlencoded extract the entire url and queries with url.
app.use('/products',product);
app.set('view engine', 'jade');

let port = 1234;
app.listen(port,()=>{
  console.log('Server is up and running on port number '+port);
})
