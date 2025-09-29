import express, { urlencoded } from "express";
import { configDotenv } from "dotenv";
import connectDB from "./db.js";
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import miscellaneousRoutes from './routes/miscellaneous.js'

//TODO: add a logger to log any server issues to debug later 

//global middlewares
const app = express();
configDotenv();
connectDB();
app.use(cors({ origin:process.env.CLIENT_URL , credentials:true}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.get('/ping' , (req,res)=>{ // free tier tactic to prevent from sleeping
    res.status(200).send("pinged");
})

app.get('/ping2' , (req,res)=>{
    res.status(200).send('ping2');
})

//auth routes
app.use('/auth',authRoutes)

// some other miscellaneous routes
app.use('/misc',miscellaneousRoutes);


app.listen(process.env.PORT||3000 , ()=>console.log(`Listening at port ${process.env.PORT}`));
