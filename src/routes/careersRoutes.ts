import express from 'express';
import superAuthMiddleware from '../middlewares/superAuthMiddleware.js';


const router = express.Router();


router.get('/' , async (req,res)=>{
    try{
        // const careers ;

    }catch(e){
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR'
        })
    }
})

router.post('/' ,superAuthMiddleware, async (req,res)=>{

})

router.put('/:id' ,superAuthMiddleware, async (req,res)=>{

})

router.delete('/:id',superAuthMiddleware, async (req,res)=>{

})


