const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const constants = require('../constants');

module.exports = {
  register_user: function(req,res){
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }).then(function(response){
      res.send({data: response, msg: "User created"})
    }).catch(function(error){
      throw error;
    })
  },
  login: function(req,res){
    let email = req.body.email && req.body.email.toLowerCase(),
        pass = req.body.password;
        if(!email || !pass){
          res.json({
            message: 'Fields Missing!',
            status:0
          })
        } else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) ) {
          res.json({
            message: 'Invalid email!',
            status:0
          })
        } else if(pass.length < 5){
          res.json({
            message: 'Invalid password!',
            status:0
          })
        } else {
          User.findOne({
            email: email,
            password: pass
          }).then(function(response){
            if(response){
              jwt.sign({user:response}, constants.jwt_secretKey, /*{expiresIn: '30s'},*/ (err,token)=>{
                res.json({
                  status:1,
                  data:response,
                  message:'Login successfully',
                  token: token
                })
              })
            } else {
              res.json({
                message: 'Invalid login credential!',
                status:0
              })
            }
          }).catch(function(error){
            throw error;
          })
        }
  },
  test : function(req,res){
    jwt.verify(req.token, constants.jwt_secretKey, (err,authData)=>{
      if(err){
        res.sendStatus(403);
      } else {
        res.json({
          authData,
          message: 'Success'
        })
      }
    })
  }
}
