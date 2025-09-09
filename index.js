import express from "express";
import { configDotenv } from "dotenv";

const app = express();
configDotenv();

app.get('/' , (req,res)=>{
    res.send("yup it's working");
})

app.listen(process.env.PORT||3000 , ()=>console.log(`Listening at port ${process.env.PORT}`));
