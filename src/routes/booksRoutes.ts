import express from 'express';
import bookModel from '../models/bookModel.js';



const router = express.Router();

// sends a list of very basic info of all the books in ascending order of age 
router.get('/' , async (req, res)=>{
    try{
        const AllBooks = await bookModel.find().limit(20).sort({publishYear: 1});
        res.status(200).json({
            success: true, 
            message: 'SUCCESS'
        })

    }catch(e){

        res.status(500).json({
            success: false,
            message: "INTERNAL_SERVER_ERROR",
        })
    }
})




export default router;