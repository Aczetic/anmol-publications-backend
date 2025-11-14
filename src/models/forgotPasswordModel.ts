import mongoose from "mongoose";



const ForgotPasswordSchema =new mongoose.Schema({
    email: {
        type: String , 
        required : true,
    },
    token : {
        type: String,
        required : true
    },
    createdAt : {
        type: Date,
        default : Date.now,
        expires : 600 // this is in seconds
    }
});


const forgotPasswordModel = mongoose.model('forgot-password', ForgotPasswordSchema);

export default forgotPasswordModel;