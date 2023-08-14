const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: [true, 'please enter your name'],
    },
    number: {
        type: Number,
        required: [true, 'please enter phone number'],
        minLength: [10, 'phone number should be 10 digit']
    },
    email: {
        type: String,
        required: [true, 'please enter Email'],
    },
    password: {
        type: String,
        required: [true, 'please enter your query or message']
    },
    cart:{
        type:[{
            event_ID:{
                type:String,
                default:""
            },
            hallQuantity:{
                h1:{
            type:Number,
            // required:true
        },
        h2:{
            type:Number,
            // required:true
        },
        h3:{
            type:Number,
            // required:true
        }
            }
        }],
        default:[-1]
    },
    token:{
        type:String,
        default:""
    }
});

//to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// to get jwt token 
userSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},"USER",{
        expiresIn:"5d"
    })
}

module.exports = userSchema;