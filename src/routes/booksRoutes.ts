import express from 'express';
import bookModel from '../models/bookModel.js';
import superAuthMiddleware from '../middlewares/superAuthMiddleware.js';
import BookSchema from '../customTypes/BookType.js';



const router = express.Router();

// sends a list of very basic info of all the books in ascending order of age 
// basic info to send cover-img , title , id
router.get('/' , async (req, res)=>{
    try{
        const AllBooks = await bookModel.find().limit(20).sort({publishYear: -1});
        res.status(200).json({
            success: true, 
            message: 'SUCCESS',
            data: AllBooks.map(book=>{
                const {name,images:[img],id} = book;
                return {name,img,id};
            })
        })

    }catch(e){

        res.status(500).json({
            success: false,
            message: "INTERNAL_SERVER_ERROR",
        })
    }
})


//to add a book
router.post('/' , superAuthMiddleware , async (req,res)=>{
    try{
        const parseBook = BookSchema.safeParse(req.body);
        if(parseBook.success){
            const createdBook = await bookModel.create(req.body);
            res.status(201).json({
                success: true,
                message: 'SUCCESS',
            })
        }else{
            console.log(parseBook)
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


export default router;