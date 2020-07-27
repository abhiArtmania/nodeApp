const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *        example:
 *           name: Alexander
 *           email: fake@email.com
 */

let UserSchema = new Schema({
  username: {type:String,required:true,max:100, unique: false},
  email: {type:String,required:true,max:100, unique: true},
  password: {type:String,required:true, min:5},
  authToken: {type:String,required:false, max:300}
})

// Export the model
module.exports = mongoose.model('User',UserSchema);
