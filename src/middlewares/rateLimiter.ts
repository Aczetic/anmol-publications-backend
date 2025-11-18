import type { NextFunction, Request, Response } from "express";

const requestCountConfig = {
    count: 0,
    intervalStarted : false
}

const startInterval = ()=>setInterval(()=>requestCountConfig.count = 0, 1000);// reset the count every second

const rateLimiter = (req:Request, res:Response, next:NextFunction)=>{
    if(requestCountConfig.intervalStarted === false) startInterval

    if(requestCountConfig.count < 1000){
        requestCountConfig.count++;
        next();
    }else{
        res.status(429).json({
            success: false,
            message: 'TOO_MANY_REQUEST'
        })
    }
}

export default rateLimiter