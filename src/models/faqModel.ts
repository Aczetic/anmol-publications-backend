import mongoose from "mongoose";



const FaqSchema = new mongoose.Schema({
    id: { type: String , unique: true , default: ()=>crypto.randomUUID()},
    question: String,
    answer: String
});

const faqModel = mongoose.model('faq' , FaqSchema);
export default faqModel;