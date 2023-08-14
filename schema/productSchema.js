const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: [true, 'please enter Event Name']
    },
    location:{
      type:String,
      required:[true,"Enter Event Location"]  
    },
    capacity: {
        h1:{
            type:Number,
            required:true
        },
        h2:{
            type:Number,
            required:true
        },
        h3:{
            type:Number,
            required:true
        }
    },
    date: {
        type: String,
        required: [true, 'enter Date Of Event']
    },
    detail: {
        type: String,
        required: [true, 'please enter detail'],
    },
    viewable: {
        type:Boolean,
        required: [true, 'select yes or no']
    },
});

module.exports = productSchema;