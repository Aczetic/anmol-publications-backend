import express from 'express';
import testimonialModel from '../models/testimonials.js';


const router = express.Router();

//todo: only those who are authorized can add review
// todo: the profile image url should be of cloudflare
router.post('/add-review',async (req,res)=>{
    const review = req.body;
    try{
        const tsm = await testimonialModel.create({
          name: "Dr. Ramesh Kulkarni",
          designation: "Principal",
          location: "Delhi Public School, Pune",
          review:
            "These NEP-aligned books have completely transformed the way our teachers deliver lessons. The content is accurate, well-structured, and supported by engaging illustrations that truly capture students’ attention. The integration of AI tools makes learning interactive, and the LMS provides a smooth platform for tracking progress. It’s a complete solution that addresses both traditional and modern teaching needs.",
          stars: 4.5,
          profile_img: "https://anmoleducationalbooks.com/assets/ramesh_kulkarni-Bh3iloMA.jpg",
        });
        res.status(201).json({success:true , message:"REVIEW_CREATED"})
    }catch(e){
        console.log(e);
        res.status(500).json({success:false , message:"INTERNAL_SERVER_ERROR"})
    }
})

export default router;