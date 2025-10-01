import express, {type Request, type Response, type NextFunction } from 'express';

//middlewares
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

const roleMiddleware = (req:Request , res:Response , next:NextFunction)=>{ // this will check if the role is principal or not
  console.log("here")
    if((req.body as unknown as {user:{role:string}}).user.role !== 'principal'){
        
        res.status(401).json({
            success:false,
            message:"UNAUTHORIZED"
        })

    }else{
        next();
    }
}

router.get('/', authMiddleware , roleMiddleware ,async (req:express.Request , res:express.Response)=>{

    try{
        res.status(204);
    }catch(e){
        res.status(500).json({
            success:false,
            message:'INTERNAL_SERVER_ERROR'
        })
    }

})



export default router;


