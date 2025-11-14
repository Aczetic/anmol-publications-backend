import mongoose from "mongoose";


const UserSchema =new  mongoose.Schema({
    role:{
        type:String,
        required:true,
        enum:['user','teacher','principal','admin']
    },
    inviteCode :{
        type:String,
        default:'none'
    },
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    birthday:{
        type:String,
        required:false,
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
    subscriptions:[mongoose.Schema.ObjectId], // list of books user is allowed to read fully
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const userModel = mongoose.model('user',UserSchema);

export default userModel;