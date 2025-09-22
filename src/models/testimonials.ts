import mongoose from "mongoose";



const testimonialSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    name:{type:String , required:[true,"NAME_IS_REQUIRED"]},
    designation:{type:String , required:[true,"DESIGNATION_IS_REQUIRED"]} ,
    location:{type:String , required:[true,"LOCATION_IS_REQUIRED"]},
    review: {type:String , required:[true,"REVIEW_IS_REQUIRED"]},
    stars: {type:mongoose.Types.Double , required:[true,"STARS_IS_REQUIRED"]},
    profile_img: {type:String , defaultValue:''}
})

const testimonialModel = mongoose.model('testimonial' , testimonialSchema);
export default testimonialModel;