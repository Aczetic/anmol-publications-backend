import { timeStamp } from "console";
import mongoose from "mongoose";


const UserSchema =new  mongoose.Schema({
    role:{
        type:String,
        required:true,
        enum:['user','teacher','principal']
    },
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    "school-name":{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
    otpChances : {
        type:Number,
        required:true,
        defaultValue:3,
    },
    createdAt:{
        type:Date,
        required:true,
        defaultValue:Date.now,
        expires:600
    },

})

const unverifiedUser = mongoose.model('unverifiedUser',UserSchema);

export default unverifiedUser;