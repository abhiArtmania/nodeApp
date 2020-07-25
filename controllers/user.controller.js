const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const CONFIG = require('../common/CONFIG');
const helper = require('../common/helper');

const register_user = async function(req,res){
  let userName = req.body.username && req.body.username.toLowerCase(),
      email = req.body.email && req.body.email.toLowerCase(),
      pass = req.body.password;
    if(!email || !pass || !userName){
      return helper.success_response(res,null,'Fields Missing!',false)
    } else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) ) {
      return helper.success_response(res,null,'Invalid email!',false)
    } else if(pass.length < 5){
      return helper.success_response(res,null,'Invalid password!',false)
    } else {
      let isUserAlreadyExist = await User.findOne({email:email})
      if(isUserAlreadyExist){
        return helper.success_response(res,null,'User with this email already exist, Please try with other email',false)
      } else {
        let newUser = await User.create({
          username: userName,
          email: email,
          password: pass
        })
        if(newUser && newUser._id){
          return helper.success_response(res,newUser,'User created',true)
        } else {
          return helper.success_response(res,null,'Failed',false)
        }
      }
    }
}

const login = async function(req,res){
  let email = req.body.email && req.body.email.toLowerCase(),
      pass = req.body.password;
      if(!email || !pass){
        return helper.success_response(res,null,'Fields Missing!',false)
      } else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) ) {
        return helper.success_response(res,null,'Invalid email!',false)
      } else if(pass.length < 5){
        return helper.success_response(res,null,'Invalid password!',false)
      } else {
        let logedInUser = await User.findOne({
          email: email,
          password: pass
        })
        if(logedInUser && logedInUser._id){
          jwt.sign({user:logedInUser.email}, CONFIG.jwt_secretKey, /*{expiresIn: '30s'},*/ async (err,token)=>{
            let userUpdated = await User.findOneAndUpdate({_id:logedInUser._id},{authToken:token},{new:true});
            if(userUpdated){
              return helper.success_response(res,userUpdated,'Login successfully',true)
            } else {
              return helper.success_response(res,null,'Login Failed',false)
            }
          })
        } else {
          return helper.success_response(res,null,'Invalid login credential!',false)
        }
      }
}

const getUserInfo = async function(req,res){
  let _id = req && req.body && req.body._id
  if(_id){
    let userData = await User.findOne({
      _id:_id
    })
    if( userData && userData._id ){
      return helper.success_response(res,userData,'Success',true)
    } else {
      return helper.success_response(res,null,'User not found!',false)
    }
  } else {
    return helper.success_response(res,null,'_id is required',false)
  }
}

const logout = async function(req,res){
  let userLogout = await User.update({_id:req.body._id},{$unset:{authToken:''}})
  if(userLogout){
    return helper.success_response(res,null,'Logout successfully!',true)
  } else {
    return helper.success_response(res,null,'Failed!',false)
  }
}

module.exports = {
  register_user,
  login,
  getUserInfo,
  logout
}
