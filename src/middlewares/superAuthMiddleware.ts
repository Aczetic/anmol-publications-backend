import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";


// this middleware is perform request auth for actions that super admin can only do
const superAuthMiddleware = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const {email} = jwt.verify(req.cookies.token, process.env.SUPER_ADMIN_JWT_SECRET_KEY as string) as {email:string};
        const superAdmin = await userModel.findOne({email});

        if(superAdmin){
            next();
        }else{
            res.status(401).json({
                success: false,
                message: 'UNAUTHORIZED'
            })
        }

    }catch(e){
        
        if((e as {name:string}).name === 'JsonWebtokenError'){
            res.status(401).json({
                success: false,
                message: 'UNAUTHORIZED'
            })
            return;
        }

        console.log(e);
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR',
        })
    }
}

export default superAuthMiddleware;