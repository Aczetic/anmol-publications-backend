import express from 'express';
import superAuthMiddleware from '../middlewares/superAuthMiddleware.js';
import careersModel from '../models/careersModel.js';
import CareerSchema from '../customTypes/CareersType.js';


const router = express.Router();


router.get('/' , async (req,res)=>{
    try{
        const careers = await careersModel.find({}).select({_id:0}).sort({createdAt:-1}); 
        res.status(200).json({
            success: true,
            message: 'SUCCESS',
            data: careers
        })
    }catch(e){
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR'
        })
    }
})

router.post('/' ,superAuthMiddleware, async (req,res)=>{
    try{
        const result = CareerSchema.safeParse(req.body);
        if(result.success){
            await careersModel.create(result.data);
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
            message: 'INTERNAL_SERVER_ERROR'
        })
    }
})

router.put('/:id' ,superAuthMiddleware, async (req,res)=>{
    try{
      
        const result = CareerSchema.safeParse(req.body);
        if(result.success){

            await careersModel.findOneAndUpdate({jobId: req.params.jobId}, result.data);
            res.status(200).json({
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
            message: 'INTERNAL_SERVER_ERROR'
        })
    }
})

router.delete('/:id',superAuthMiddleware, async (req,res)=>{
    try{
        const deletedJob = await careersModel.findOneAndDelete({jobId: req.params.jobId}, {acknowledge:true});
        res.status(200).json({
            success: true,
            message: 'SUCCESS',
            data: deletedJob
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR'
        })
    }
})


export default router;