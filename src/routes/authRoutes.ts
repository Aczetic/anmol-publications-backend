import express, { type NextFunction, type Request, type Response } from 'express';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import * as z from 'zod';
import jwt, { type Secret } from 'jsonwebtoken'
import { userSchemaSignUp, userSchemaLogin } from '../customTypes/UserType.js';

//TODO: forgot password handling


const router = express.Router();

router.post('/login', async(req,res)=>{
    try{
        const result = z.safeParse(userSchemaLogin,req.body);

        if(result.success){ // validation passes
            
            const user = await userModel.findOne({email:result.data.email});
            
            if(!user){ // when user does not exist
                
                res.status(200).json({
                    success:false,
                    message: "SIGN_UP"
                })
                
            }else{ // when user exists then validate password

                if( await bcrypt.compare(result.data.password , user.password) ){ // if password is correct

                    const token = jwt.sign( {email:result.data.email} , process.env.JWT_SECRET_KEY as Secret, { expiresIn:'1h' });
                    res.cookie('token', token , { httpOnly:true , sameSite: 'lax' , maxAge: 1000*60*60})
                    res.status(200).json({
                        success: true,
                        message: "LOGIN_SUCCESSFUL",
                        user : {email:user.email, role:user.role}
                    })
                
                }else{
                    res.status(200).json({ // if password incorrect
                        success:false,
                        message:"INVALID_PASSWORD"  
                    })
                }

            }

        }else{ // if validation fails
            console.log(result , req.body)
            res.status(400).json({
                success: false,
                action:'NOTIFICATION',
                message: result.error.issues.map(e=>e.message) // only give the error messages in an array
            })     
        }

    }catch(e){
        console.log(e);
        res.status(500).json({success:false , message : "INTERNAL_SERVER_ERROR"})
    }
})

router.post('/sign-up', async(req,res)=>{
    
    try{
      
        //validate the incoming data
        const result = z.safeParse(userSchemaSignUp,req.body);

        if(result.success){ // if validation passes

            // check if the users exists or not 
            const user = await userModel.findOne({email:result.data.email});

            if(!user){ // if user not found (desired)

                const encryptedPassword = bcrypt.hashSync(result.data.password,10);
                const token = jwt.sign( {email:result.data.email} , process.env.JWT_SECRET_KEY as Secret , {expiresIn:'1h'})

                const newUser = await userModel.create({
                    ...result.data,  
                    password: encryptedPassword
                });//create the user in db

                res.cookie('token',token , {httpOnly:true , sameSite:'lax' , maxAge: 1000*60*60})
                setTimeout(()=>{ //TODO: remove this later
                    res.status(201).json({
                        success:true,
                        message:'SIGN_UP_SUCCESSFUL',
                        user : {email:newUser.email, role:newUser.role}
                    })
                },1000)

            }else{ // if user found (undesired)
                res.status(200).json({
                    success:false,
                    message:"LOG_IN"
                })
            }

        }else{ // if validation fails
            res.status(400).json({
                success: false,
                action: 'NOTIFICATION',
                message : result.error.issues.map(e=>e.message)
            })
        }


    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "INTERNAL_SERVER_ERROR"
        })
    }

})

router.get('/logout',(req,res)=>{
    try{
        res.clearCookie('token');
        res.status(200).json({
            success:true,
            message:'LOGGED_OUT'
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'INTERNAL_SERVER_ERROR'
        })
    }
})

// to check if the session is active
router.get('/logged-in',(req,res)=>{
    try{
        const token = req.cookies.token;
        const result = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret);
        if(!result){// if the session is inactive, token expired
            res.status(200).json({
                success:false,
                message:"LOG_IN"
            })
        }else{// if not expired

            //update the jwt with new time to extend the session
            const {email,role} = result as {email:string, role:string};
            const newToken = jwt.sign({email}, process.env.JWT_SECRET_KEY as Secret,{expiresIn:'1h'});

            res.cookie('token',newToken,{httpOnly:true , sameSite:'lax', maxAge:1000*60*60});
            res.status(200).json({
                success:true,
                message:"LOGGED_IN",
                user:{email,role}
            })
        }
    }catch(e){
        console.log(e);
        if( (e as {name:string}).name === 'JsonWebTokenError')
        {
            res.status(401).json({
                success:false,
                message:'UNAUTHORIZED'
            })
        }
        res.status(500).json({
            success:false,
            message:'INTERNAL_SERVER_ERROR'
        })
    }
})

export default router ;