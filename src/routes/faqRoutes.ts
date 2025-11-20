import express from 'express';
import faqModel from '../models/faqModel.js';
import superAuthMiddleware from '../middlewares/superAuthMiddleware.js';
import FaqSchema from '../customTypes/FaqType.js';


const router = express.Router();


router.get('/', async (req,res)=>{
    try{
        
        const faqs = await faqModel.find({}).select({_id:0}); 
        res.status(200).json({
            success: true,
            message: 'SUCCESS',
            data: faqs
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR'
        })
    }
})

router.post('/' , superAuthMiddleware , async (req,res)=>{
    
    try{

        const parsedFaq = FaqSchema.safeParse(req.body);

        if(parsedFaq.success){
            console.log(parsedFaq);

            await faqModel.create(parsedFaq.data);
            res.status(201).json({
                success: true,
                message: 'SUCCESS'
            })

        }else{

            res.status(400).json({
                success: false,
                message: 'BAD_REQUEST'
            })
        }
    
    }catch(e){

        console.log(e);
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR',
        })
    }

})

router.put('/:id', superAuthMiddleware, async (req,res)=>{

    try{

        const faq = await faqModel.findOne({id:req.params.id});

        if(faq){
            const {question, answer} = req.body;

            if(FaqSchema.safeParse({question, answer}).success){

                faq.question = question;
                faq.answer = answer;
                await faq.save();
    
                res.status(200).json({
                    success: true,
                    message: 'SUCCESS'
                })
           
            }else{
                res.status(400).json({
                    success: false,
                    message: 'BAD REQUEST'
                })
            }



        }else{  

            res.status(404).json({
                success: false,
                message: 'NOT_FOUND'
            })
        }

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR'
        })
    }
})


router.delete('/:id' , superAuthMiddleware, async (req,res)=>{

    try{
        
        if(await faqModel.findOne({id: req.params.id})){
            
            const deletedFaq = await faqModel.findOneAndDelete({id:req.params.id},{acknowledge:true})
            res.status(200).json({
                success: true,
                message: 'SUCCESS',
                data: deletedFaq
            })
        
        }else{

            res.status(404).json({
                success: false,
                message: 'NOT_FOUND'
            })
        }



    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR'
        })
        
    }
})

router.get('/insert-many',async (req,res)=>{
    try{
        
        await faqModel.create(
            [
                {
                  question:'Are your textbooks truly aligned with the NEP 2020 framework?',
                  answer:'-Yes, our textbooks rigorously-follow the NEP-2020-framework-(5+3+3+4-structure), focusing on holistic-development. We blend this content with a digital-suite (AI-tools,-LMS, Testpaper-Generator) to ensure a fresh-novel-and-highly-engaging learning experience that innovates beyond standard textbook delivery.'
                },
                {
                  question:'Do the physical textbooks come with any access codes or keys for the digital content?',
                  answer:`-No, the physical textbooks do not contain any access code. To gain access, an -account on the website is required. Teachers gain access to digital services through the -Principal's/Admin's invitation, and students can get access through a -teacher's invitation.`
                },
                {
                  question:'Can we customize the book package for a specific grade or stream?',
                  answer:"We-are-highly-flexible-regarding-curriculum-customization. Our priority is to align perfectly with your institution's specific academic requirements. Please [contact-us,/contact-us] for tailored package configurations based on grade, stream, or specific pedagogical needs. We look forward to designing the ideal solution for you."
                },
                {
                  question:'What is the print quality, and what is the ordering/delivery timeline for bulk school orders?',
                  answer:'Our print quality utilizes industry-standard, high-quality-paper and durable-binding suitable for the K-12 environment, ensuring longevity through the academic year. For bulk-school-orders, processing time is typically 24-to-48-working-hours post confirmation. Standard delivery timelines across India generally range from 5-to-10-business-days after dispatch, although remote locations may require slightly longer transit times. Specific timelines for very large orders will be confirmed during the final quote stage.'
                },
                {
                  question:'What are the device and software requirements for students and teachers to access the digital resources?',
                  answer:'Our digital services ensure universal-compatibility, accessible across all-standard-devices (tablets, smartphones, PCs). Access requires only a stable-internet-connection and an updated-web-browser supporting the latest web technologies.'
                },
                {
                  question:'What is the process for obtaining technical support regarding any technical error?',
                  answer:'The technical support protocol is streamlined-for-efficiency. Users simply raise-an-issue via our dedicated [support,/support] page. We commit to an initial response within-one-business day, and all raised issues remain fully-trackable within that same platform.'
                },
                {
                  question:'How do you handle updates to the digital content to keep it current with syllabus changes?',
                  answer:`We maintain rigorous-oversight of evolving educational guidelines and syllabus changes. Since the majority of our learning suite is -web—delivered, content synchronization is highly efficient. Updates to all digital services including the LMS and associated resources are deployed automatically and instantaneously, requiring no-manual-action from teachers or students to ensure immediate curriculum alignment.`
                }
                
              ]
        )
        res.send('done');
    }catch(e){
        res.send('error');
    }

})
export default router;