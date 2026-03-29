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

//TODO: later put optionalAuthMiddleware for optionally checking if the use is logged in or not , to give a varying response
// this is to be done to when there is is_subscribed and other books related info to be added
//TODO: also put other books related fields , check in the ui for reference.
router.get('/book-details/:id' , async(req , res)=>{
    try{
        console.log(req.params.id);
        const book = await bookModel.findOne({id: req.params.id});
        res.status(200).json({
                success: true,
                message: "SUCCESS",
                data: book
            }
        )
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message : "INTERNAL_SERVER_ERROR"
        })
    }
})

//to add a book
router.post('/' , superAuthMiddleware , async (req,res)=>{
    try{
        const parsedBook = BookSchema.safeParse(req.body);
        if(parsedBook.success){
            const createdBook = await bookModel.create(parsedBook.data);
            res.status(201).json({
                success: true,
                message: 'SUCCESS',
            })
        }else{
            console.log(parsedBook)
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


//format 
// const [data, setData] = useState({
//     announcements: [
//       {
//         imageLarge: "",
//         imageSmall: "",
//         id: "",
//         link: "",
//       },{
//         imageLarge: "",
//         imageSmall: "",
//         id: "",
//         link: "",
//       },
//     ],
//     booksList: [
//       {
//         heading : 'List Heading',
//         books : [{
//           id: "1",
//           image: "",
//           title: "General Knowledge",
//         }],
//       },
//       {
//         heading : 'List Heading',
//         books : [
//           {
//           id: "1",
//           image: "",
//           title: "General Knowledges",
//         },  {
//           id: "2",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "3",
//           image: "",
//           title: "General Knowledge",
//         }, {
//           id: "12",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "24",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "35",
//           image: "",
//           title: "General Knowledge",
//         }, {
//           id: "16",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "27",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "33",
//           image: "",
//           title: "General Knowledge",
//         }, {
//           id: "11",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "23",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "32",
//           image: "",
//           title: "General Knowledge",
//         }, {
//           id: "17",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "25",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "38",
//           image: "",
//           title: "General Knowledge",
//         }, {
//           id: "14564",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "256456",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "334524",
//           image: "",
//           title: "General Knowledge",
//         }, {
//           id: "145245",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "2245234",
//           image: "",
//           title: "General Knowledge",
//         },  {
//           id: "354345",
//           image: "",
//           title: "General Knowledge",
//         },
//       ],
//       },
//       {
//         heading : 'List Heading',
//         books : [{
//           id: "1",
//           image: "",
//           title: "General Knowledge",
//         }],
//       },
//     ],
//     filters: [
//       { name: "book_title", options: ["one", "two", "three"] },
//       { name: "subject", options: ["one", "two", "three"] },
//       { name: "class", options: ["one", "two", "three"] },
//       { name: "latest_release", options: ["one", "two", "three"] },
//       { name: "board", options: ["one", "two", "three"] },
//   ],
//   });
router.get('/books-list', async (req, res) => {
    try {

        const page = parseInt((req.query.page || '1') as string);
        console.log(page);
        const announcements : unknown= [];
        const booksList = await booksListModel.find({}).skip((page-1)*3).limit(3);

        
        let subjects: any = {};
        // this gets the unique subjects because duplicates were coming and I am lazing to do this at query level, useless mongo, or maybe skill issue
         (await bookModel.find({}).select({subject:1, _id:0})).forEach(each=>
          {
            const subject = each.subject as string;

            if(! subjects[subject]){
                subjects[subject] = 1;
            }

          }
         )

         subjects = Object.keys(subjects);
       
        
        // these are hardcoded filters this is not how it is done 
        // TODO: create a separate model for filters
        const filters = [
            { name: "book_title", options: booksList.map(each=>each.heading) },
            { name: "subject", options: subjects },
            { name: "class", options: ["Nursery, KG, Prep",...new Array(8).fill(0).map((_,idx)=> 'Class ' + (idx+1))] },
        ]

        res.status(200).json({
            success: true,
            message: 'SUCCESS',
            data: {announcements, booksList, filters}
        })


    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "INTERNAL_SERVER_ERROR",
        })
    }
})


// below is the temporary route to insert books 
// TODO: remove it asap
import gkbooks from '../booksgk.js';
import hindiBooks from '../bookshindi.js';
import artBooks from '../booksart.js';
import booksListModel from '../models/booksListModel.js';
router.get('/insert-many' , async (req , res)=>{
    try{
        await bookModel.insertMany(artBooks);
        res.send("all books uploaded");
    }catch(e){
        res.send("something bad happened");
        console.log(e);
    }
})

//TOOD: remove asap this is for adding book list
router.get('/addlist' , async(req ,res )=>{
    try{
        const artMagic =await bookModel.find({name: {$regex : 'Art Magic'}}).select({_id:0 , id: 1 , name: 1 , images: 1});
        const knowledgeInsights =await bookModel.find({name: {$regex : 'Knowledge Insights'}}).select({_id:0 , id: 1 , name: 1 , images: 1});
        const shubhda =await bookModel.find({name: {$regex : 'शुभदा'}}).select({_id:0 , id: 1 , name: 1 , images: 1});
        console.log()

        await booksListModel.create({heading: "Knowledge Insights" , books: knowledgeInsights});
        // await booksListModel.create({heading: "Art Magic" , books: artMagic});
        // await booksListModel.create({heading: "शुभदा" , books: shubhda});

        res.send("done");

    }catch(e){
        console.log(e);
        res.status(500).send("error happened");
    }
})
export default router;