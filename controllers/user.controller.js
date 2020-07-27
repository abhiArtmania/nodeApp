const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const CONFIG = require('../common/CONFIG');
const helper = require('../common/helper');


/**
     * @swagger
     * /api/register_user:
     *   post:
     *     tags:
     *       - Users API
     *     description: User signup
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: Signup
     *         description: Signup object
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            username:
     *              type: string
     *            email:
     *              typr: string
     *            password:
     *              type: string
     *          example:         # sample data
     *            username:
     *            email:
     *            password:
     *     responses:
     *       200:
     *         description: Returns success message
     */

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

/**
     * @swagger
     * /api/login:
     *   post:
     *     tags:
     *       - Users API
     *     description: User Login
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: login
     *         description: Signin object
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            email:
     *              type: string
     *            password:
     *              type: string
     *          example:         # sample data
     *            email: abhi@gmail.com
     *            password: Abhi@123
     *     responses:
     *       200:
     *         description: Returns success message
     */

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

/**
     * @swagger
     * /api/userInfo:
     *   post:
     *     tags:
     *       - Users API
     *     description: User details
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Authentication Token
     *         in: header
     *         required: true
     *       - name: UserDetails
     *         description: UserDetail object
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            _id:
     *              type: string
     *          example:         # sample data
     *            _id: 5f1d4f01927a0538b80fe752
     *     responses:
     *       200:
     *         description: Returns success message
     */

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

/**
     * @swagger
     * /api/logout:
     *   post:
     *     tags:
     *       - Users API
     *     description: Logout user
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Authentication Token
     *         in: header
     *         required: true
     *       - name: UserLogout
     *         description: UserLogout object
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            _id:
     *              type: string
     *          example:         # sample data
     *            _id: 5f1d4f01927a0538b80fe752
     *     responses:
     *       200:
     *         description: Returns success message
     */

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
