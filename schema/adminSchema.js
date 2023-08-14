const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name'],
        maxLength: [30, "name can not exceed more than 30 Character"],
        minLength: [3, "name can not be less then 3 Character"]
    },
    email: {
        type: String,
        required: [true, 'please enter Email'],
    },
    password: {
        type: String,
        required: [true, 'please enter your query or message'],
        select: true
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
    return jwt.sign({id:this._id},"ADMIN",{
        expiresIn:"5d"
    })
}

module.exports = userSchema;