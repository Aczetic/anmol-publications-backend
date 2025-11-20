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

export default router;