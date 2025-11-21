import express, { urlencoded } from "express";
import { configDotenv } from "dotenv";
import connectDB from "./db.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
//routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import booksRoutes from './routes/booksRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import issueRoutes from './routes/issuesRoutes.js';
import miscellaneousRoutes from './routes/miscellaneous.js'
import rateLimiter from "./middlewares/rateLimiter.js";
import axios from "axios";

//TODO: add a logger to log any server issues to debug later 
//global middlewares
const app = express();
configDotenv();
connectDB();
app.use(rateLimiter);
app.use(cors({ origin:process.env.CLIENT_URL , credentials:true})) // TODO : update the origin value in env to production frontend
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


app.get('/ping' , (req,res)=>{ // free tier tactic to prevent from sleeping
    setTimeout(()=>{
        axios.get('/ping');
    },5*60*1000)
    res.status(200).send("pinged");
})

app.get('/ping2' , (req,res)=>{
    res.status(200).send('ping2');
})

//auth routes
app.use('/auth',authRoutes)

//profile routes
app.use('/profile' , profileRoutes);

//dashboard routes
app.use('/dashboard',dashboardRoutes);

// books routes
app.use('/books' , booksRoutes );

//faqs routes
app.use('/faqs', faqRoutes);

//issues routes
app.use('/issues', issueRoutes);

// some other miscellaneous routes
app.use('/misc',miscellaneousRoutes);


app.listen(process.env.PORT||3000 , ()=>console.log(`Listening at port ${process.env.PORT}`));
