import express from 'express';
import testimonialModel from '../models/testimonials.js';
import TestimonialSchema from '../customTypes/TestimonialTypes.js';
import z from 'zod';


const router = express.Router();

//todo: only those who are authorized can add review
// todo: the profile image url should be of cloudflare
router.post('/testimonial',async (req,res)=>{
   try{
      const verifiedTestimonial = z.parse(TestimonialSchema , req.body);
      await testimonialModel.create(verifiedTestimonial);
      res.status(201).json({
        success: true,
        message: 'SUCCESS'
      })

   }catch(e){
    console.log(e);
      res.status(500).json({
        success: false,
        message: "INTERNAL_SERVER_ERROR"
      })
   }
})


router.get('/testimonial', async (req, res)=>{
   try{
      const tsm = await testimonialModel.find();
      res.status(200).json({
        success:true,
        message:'SUCCESS',
        data:tsm
      }) 
   
    }catch(e){
      res.status(500).json({
        success:false,
        message:'INTERNSL_SERVER_ERROR'
      })
   }
})



export default router;