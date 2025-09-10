import express from "express";
import { configDotenv } from "dotenv";

const app = express();
configDotenv();

app.get('/ping' , (req,res)=>{ // free tier tactic to prevent from sleeping
    res.status(200).send("pinged");
})


app.listen(process.env.PORT||3000 , ()=>console.log(`Listening at port ${process.env.PORT}`));
