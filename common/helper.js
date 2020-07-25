const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const jwt_secretKey = 'Password@123'
const CONFIG = require('./CONFIG');

const varifyToken = function(req,res,next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(req.token, CONFIG.jwt_secretKey, async (err,authData)=>{
      if(err){
        return success_response(res,null,'Session has been expired',false)
      } else {
        let check_token_exist_in_user_db = await  User.findOne({
          _id:req.body._id,
          authToken: req.token
        })
        if(check_token_exist_in_user_db){
          return next()
        } else {
          return success_response(res,null,'Session has been expired',false)
        }
      }
    })
  } else {
    return success_response(res,null,'Session has been expired',false)
  }
}

const success_response = function(res,data,message='Ok',success=true){
  res.status(200).json({
    success:success,
    message:message,
    data:data,
  })
}

module.exports = {
  varifyToken,
  success_response
}
