import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();


//todo: there needs to be more information provided depending upon the role like teachers will have student
// may be not through profile but different route


router.get('/' , authMiddleware ,  (req,res)=>{

    try{
        const { 
            role, inviteCode , fullname , email , birthday , phone,
            "school-name" : schoolName , state,city , address , subscriptions , createdAt
        } = req.body.authMiddleware.user;

            res.status(200).json({
            success:true,
            message:'SUCCESS',
            user:{ 
                role, inviteCode , fullname , email , birthday , phone,
                schoolName , state,city , address , subscriptions , createdAt
            }
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'INTERNAL_SERVER_ERROR'
        })
    }
});



export default router;