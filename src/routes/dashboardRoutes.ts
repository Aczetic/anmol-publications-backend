import express, {type Request, type Response, type NextFunction } from 'express';

//middlewares
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

//authMiddleware will check the existence of user and add it to req.body
const roleMiddleware = (req:Request , res:Response , next:NextFunction)=>{ // this will check if the role is principal or not
  console.log("here")
    if (
      (req.body as unknown as { authMiddleware: { user: { role: string } } })
        .authMiddleware.user.role !== "principal" &&
        (req.body as unknown as { authMiddleware: { user: { role: string } } })
        .authMiddleware.user.role !== "admin"
    ) {
      res.status(401).json({
        success: false,
        message: "UNAUTHORIZED",
      });
    } else {
      next();
    }
}

router.get('/', authMiddleware , roleMiddleware ,async (req:express.Request , res:express.Response)=>{
 console.log('inside get request');
    try{
        res.status(200).json({
          success:true,
          message:'SUCCESS',
        });
    }catch(e){
        res.status(500).json({
            success:false,
            message:'INTERNAL_SERVER_ERROR'
        })
    }

})



export default router;


