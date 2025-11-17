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

router.get('/insert-many' , async (req,res)=>{
   try{
    const TSM = [
      {
        "name": "Dr. Ramesh Kulkarni",
        "designation": "Principal",
        "location": "Delhi Public School, Pune",
        "review": "These NEP-aligned books have completely transformed the way our teachers deliver lessons. The content is accurate, well-structured, and supported by engaging illustrations that truly capture students’ attention. The integration of AI tools makes learning interactive, and the LMS provides a smooth platform for tracking progress. It’s a complete solution that addresses both traditional and modern teaching needs.",
        "stars": 4.5,
        "img": "https://images2.imgbox.com/41/08/6uSOKMDL_o.jpg"
      },
      {
        "name": "Mrs. Kavita Sharma",
        "designation": "Headmistress",
        "location": "St. Xavier’s High School, Jaipur",
        "review": "The combination of high-quality textbooks and advanced digital resources has been a game-changer for our school. Our students love the AI-powered chatbot for instant doubt clarification, and the test generator has saved our teachers hours of preparation time. The content is NEP-compliant and encourages critical thinking, creativity, and self-paced learning. I highly recommend it to any institution aiming for academic excellence.",
        "stars": 5,
        "img": "https://images2.imgbox.com/f7/3d/DJANGrsj_o.jpg"
      },
      {
        "name": "Mr. Anil Mehta",
        "designation": "Principal",
        "location": "Green Valley International, Bengaluru",
        "review": "The detailed explanations, mind-growth exercises, and vibrant illustrations in these books keep students engaged and motivated to learn. The integration with our LMS was seamless, and the model test papers have improved student confidence before exams. It’s rare to find a publisher who blends traditional learning with modern digital tools so effectively.",
        "stars": 4,
        "img": "https://images2.imgbox.com/0c/cf/Db06NheJ_o.jpg"
      },
      {
        "name": "Mrs. Sunita Verma",
        "designation": "Principal",
        "location": "Lotus Valley School, Noida",
        "review": "Our faculty appreciates the structured, easy-to-use teacher resources that come with each textbook. From lesson plans to interactive classroom activities, everything is designed to save time while enhancing teaching quality. The books’ NEP alignment ensures that our curriculum meets the latest educational standards without compromising creativity and engagement in the classroom.",
        "stars": 5,
        "img": "https://images2.imgbox.com/97/bf/fe7rrqI7_o.jpg"
      },
      {
        "name": "Mr. Prakash Menon",
        "designation": "Headmaster",
        "location": "St. Paul’s Convent, Kochi",
        "review": "The model test papers and HOTS questions included in the books have had a noticeable impact on our students’ academic performance. The additional classroom activities encourage participation and make learning enjoyable. It’s refreshing to see a publisher that prioritizes both academic rigor and creative expression.",
        "stars": 4,
        "img": "https://images2.imgbox.com/7b/b2/ErFet3Z2_o.jpg"
      },
      {
        "name": "Mrs. Aarti Deshpande",
        "designation": "Principal",
        "location": "Vidya Bharati Senior Secondary, Nagpur",
        "review": "These books are a perfect blend of traditional textbook quality and innovative digital learning support. Our students benefit from the AI-powered tools, while teachers find the structured resources invaluable. The NEP compliance gives us confidence that we’re offering the highest educational standards, and the visual design keeps students interested throughout the year.",
        "stars": 4.5,
        "img": "https://images2.imgbox.com/1e/3f/opn9S9pF_o.jpg"
      }
    ]
    TSM.forEach(each=>{
      z.parse(TestimonialSchema, each);
    }) 

    await testimonialModel.create(TSM);

    res.status(201).json({
      success:true
    })

   }catch(e){
    console.log(e);
     res.status(500).json({
      success:false,
      message:"INTERNAL_SERVER_ERROR'"
     })
   }
})


export default router;