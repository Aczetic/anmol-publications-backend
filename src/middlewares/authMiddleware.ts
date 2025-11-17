import type { NextFunction, Request, Response } from "express";
import jwt, { type Secret } from 'jsonwebtoken';
import userModel from "../models/userModel.js";


const authMiddleware = async (req : Request , res:Response, next:NextFunction)=>{
    try{
        const currentUser = jwt.verify(req.cookies.token , process.env.JWT_SECRET_KEY as Secret) as {email:string , role:string};
        const user = await userModel.findOne({ email: currentUser.email }) 
        if (!user) {
          // I don't know why I wrote this but it feels safe
          res.status(401).json({
            success: false,
            message: "UNAUTHORIZED",
          });

        } else if( user ) {
            req.body.authMiddleware = {}; // initialize with an empty object
            req.body.authMiddleware.user  = user;
            next(); // if the user exists then pass the control to handler
        }
    }catch(e){
        if( (e as {name:string} ).name === 'JsonWebTokenError'){

            res.status(401).json({
                success:false,
                message:"UNAUTHORIZED"
            })
        }else{
            console.log(e);
            res.status(500).json({
                success:false,
                message:'INTERNAL_SERVER_ERROR'
            })
        }
    }
}

export default authMiddleware;