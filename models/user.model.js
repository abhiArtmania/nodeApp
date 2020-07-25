const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: {type:String,required:true,max:100, unique: false},
  email: {type:String,required:true,max:100, unique: true},
  password: {type:String,required:true, min:5},
  authToken: {type:String,required:false, max:300}
})

// Export the model
module.exports = mongoose.model('User',UserSchema);
