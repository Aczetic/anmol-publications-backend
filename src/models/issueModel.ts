import mongoose from "mongoose";
import crypto from 'crypto';

const generateId = ()=>{
        return crypto.randomBytes(7).toString('hex');
}

const IssueSchema = new mongoose.Schema({
        issueId: {type:String , default: generateId},
        issueDate: {type:Date , default: Date.now},
        resolveDate: {type:Date},
        responseRequestDate: {type:Date, default: Date.now}, // first response request is the date of issue raising
        subject: {type:String, required:true},
        issue: {type:String , required:true},
        resolved: {type:Boolean, default: false},
        user: {type:String, required: ''},// this is the email 
})

const issueModel = mongoose.model('issue', IssueSchema);

export default issueModel;