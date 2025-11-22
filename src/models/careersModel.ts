import mongoose from "mongoose";
import crypto from 'crypto';



const CareersSchema =new mongoose.Schema({
        jobId:{type: String , default: ()=>crypto.randomInt(5).toString()},
        title: {type:String, required: true},
        city: {type: String, required: true},
        state: {type: String , required: true},
        shift: {type: String , required: true},
        requirements: {type:[String], required: true},
        responsibilities: {type:[String], required: true},
        perks: {type:[String], required: true},
        createdAt: {type: Date, default: Date.now}
});

const careersModel = mongoose.model('career' , CareersSchema);
export default careersModel;