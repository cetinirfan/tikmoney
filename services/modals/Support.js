const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Support = new Schema({
    messages:[{
        mine: { type: Boolean },
        message: { type: String }
    }],
    problemStatus:{
        type:Number,
        default:1,
    },
    userId:{
        type:String,
        trim:true
    }, 
    userName:{ 
        type:String,
    },
    userMail:{
        type:String,
        trim:true
        
    },
    supportCreated:{
        type:Date,
    }
});

module.exports = mongoose.model('Support', Support);
