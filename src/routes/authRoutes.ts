import express, { type CookieOptions, type NextFunction, type Request, type Response } from 'express';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import * as z from 'zod';
import jwt, { type Secret } from 'jsonwebtoken'
import { userSchemaSignUp, userSchemaLogin } from '../customTypes/UserType.js';
import unverifiedUser from '../models/unverifiedUsers.js';
import crypto from 'crypto';
import sendOtp from '../utils/sendOtp.js';

//TODO: forgot password handling
//TODO: rate limiting on otp hold the email for a while before it can be used 

const authCookieSettingsProduction = {httpOnly:true , sameSite:'none', secure:true , maxAge:1000*60*60};
const authCookieSettingsDevelopment = {httpOnly:true , sameSite:'lax', secure:false , maxAge:1000*60*60};

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
                const {otpChances} = await unverifiedUser.findOne({email:req.body.email}).select({otpChances:1}) as {otpChances:number} || 3; // if doc is deleted then default to 3
                if( await bcrypt.compare(result.data.password , user.password) && otpChances > 0){ // if password is correct and otp chances are also there

                    //create an unverified user 
                    const otp = crypto.randomInt(1000,9999);
                    const hashedOtp = bcrypt.hashSync(otp.toString(),10);
                    const uvUser = await unverifiedUser.findOneAndUpdate({email:user.email},{...user.toObject(),otp:hashedOtp , otpChances , createdAt : Date.now()},{upsert:true,new:true})
                    const isOtpSent = await sendOtp(1,{
                        name:uvUser.fullname,
                        otp:otp.toString()
                    },
                    {
                        name:'Support',
                        email:'support@anmoleducationalbooks.com'
                    },
                    {
                        name: uvUser.fullname,
                        email: uvUser.email
                    }
                    )

                    if(isOtpSent){ // when the otp is successfully sent
                        res.status(200).json({
                            success:true,
                            message:'ENTER_OTP',
                        })
                    }else{
                        console.log("otp can't be sent")
                        res.status(500).json({
                            success:false,
                            message:'INTERNAL_SERVER_ERROR',
                        })
                    }
                
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
        const result = z.safeParse(userSchemaSignUp,req.body) ;

        if(result.success){ // if validation passes

            // check if the users exists or not in the verified users collection
            const user = await userModel.findOne({email:result.data.email});
            const {otpChances} =  await unverifiedUser.findOne({email:req.body.email}).select({otpChances:1}) as {otpChances:number} || 3 // 3 if the doc gets deleted then default to 3

            if(otpChances <= 0){ // if the user exists in unverifieds and has 0 otp chances 
                res.status(200).json({
                    success:false,
                    message:"OTP_EXHAUSTED"
                })
                return ;
            }
            else if(!user){// if user not found (desired) && otp chances 
                
              const encryptedPassword = bcrypt.hashSync(
                result.data.password,
                10
              ); // hash the password
              const otp = crypto.randomInt(1000, 9999); // generate otp
              const hashedOtp = bcrypt.hashSync(otp.toString(), 10); // hash the otp

              // either update the existing user or insert a new user in unverfiedUsers collection
              const uvUser = await unverifiedUser.findOneAndUpdate(
                { email: result.data.email },
                { ...result.data, otp: hashedOtp, password: encryptedPassword , otpChances, createdAt : Date.now()}, // add the otp, passwrd and new ttl
                { new: true , upsert: true}
              );

              const isOtpSent = await sendOtp(1,{
                name:uvUser.fullname,
                otp:otp.toString()
            },
            {
                name:'Support',
                email:'support@anmoleducationalbooks.com'
            },
            {
                name: uvUser.fullname,
                email: uvUser.email
            }
            )
            if( isOtpSent){
                setTimeout(() => {
                  //TODO: remove this later
                  //TODO : the otp will not be sent like this but through email
                  
                  res.status(201).json({
                      success:true,
                      message:'ENTER_OTP',
                  })
    
                }, 1000);
            }else{
                console.log("otp can't be sent");
                res.status(500).json({
                    success:false,
                    message:'INTERNAL_SERER_ERROR'
                })
            }



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

// this route will handle OTP verification and final completion of sign up and log-in
router.post('/verify-otp' , async(req,res)=>{
  try {
   
    if (req.body.path === "signup") {
        //get the data from unverfied users without _id and __v
        const user = await unverifiedUser.findOne({email:req.body.email}, {_id:0,__v:0});
        
        //check if the uv user even exists 
        if(!user){
            res.status(400).json({
                success:false,
                message:'SIGN_UP'
            })
            return;
        }
        
        if(user?.otpChances! <= 0 ){ // if all the 3 chances are used now can't used that email for 10 minutes
            res.status(400).json({
                success:false,
                message:'OTP_EXHAUSTED'
            })
            return;
        }
        
        // check if otp is correct
        if( bcrypt.compareSync(req.body.otp, user?.otp as string) ){
            const token = jwt.sign(
                { email: user?.email, role: user?.role },
                process.env.JWT_SECRET_KEY as Secret,
                { expiresIn: "1h" }
            );
            
                const newUser = await userModel.create({...user?.toObject()}); //create the user in db
                const deletedUser = await unverifiedUser.findOneAndDelete({email:user?.email},{acknowledge:true}) // delete the user from unverified

                res.cookie(
                "token",
                token,
                (process.env.ENVIRONMENT_NAME === "DEVELOPMENT"
                    ? authCookieSettingsDevelopment
                    : authCookieSettingsProduction) as CookieOptions
                );
        
                res.status(201).json({
                success: true,
                message: "SUCCESS",
                user: { email: newUser.email, role: newUser.role },
                });
        } else{
          // if the otp is incorrect
          const updatedUser = await unverifiedUser
            .findOneAndUpdate(
              { email: req.body.email },
              { $inc: { otpChances: -1 } },
              { new: true }
            ).select({ otpChances: 1 }); // decrese the otp chance by 1

          res.status(200).json({
            success: false,
            message: "INCORRECT_OTP",
            chances: updatedUser?.otpChances,
          });
        }

    }else if( req.body.path === 'login'){
        
        const user = await unverifiedUser.findOne({email:req.body.email});

        if(!user){ // if the uvuser gets removed on session timeout
            res.status(400).json({
                success:false,
                message:"LOG_IN"
            })
            return;
        }

        // check if the otp is exhausted
        if(user.otpChances <= 0){
            res.status(400).json({
                success:false,
                message:'OTP_EXHAUSTED'
            })
            return;
        }

        if( bcrypt.compareSync(req.body.otp, user?.otp as string) ){ // if the otp is correct

                const token = jwt.sign(
                    { email: user?.email, role: user?.role },
                    process.env.JWT_SECRET_KEY as Secret,
                    { expiresIn: "1h" }
                );
            
                const deletedUser = await unverifiedUser.findOneAndDelete({email:user?.email},{acknowledge:true}) // delete the user from unverified

                res.cookie(
                "token",
                token,
                (process.env.ENVIRONMENT_NAME === "DEVELOPMENT"
                    ? authCookieSettingsDevelopment
                    : authCookieSettingsProduction) as CookieOptions
                );
        
                res.status(201).json({
                success: true,
                message: "SUCCESS",
                user: { email: user?.email, role: user?.role },
                });
        } else{
          // if the otp is incorrect
          const updatedUser = await unverifiedUser
            .findOneAndUpdate(
              { email: req.body.email },
              { $inc: { otpChances: -1 } },
              { new: true }
            ).select({ otpChances: 1 }); // decrese the otp chance by 1

          res.status(200).json({
            success: false,
            message: "INCORRECT_OTP",
            chances: updatedUser?.otpChances,
          });
        }
    }

  } catch (e) {
    console.log(e);
    res.status(500).json({
        success:false,
        message:'INTERNAL_SERVER_ERROR'
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
router.get('/logged-in',async (req,res)=>{
    try{
        const token = req.cookies.token;
        if(!token){// if the token does not exist
            res.status(401).json({
                success:false,
                message:"LOG_IN",
            })
            return;
        }
        const result = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret) as {email:string , role:string};
        const user = result && await userModel.findOne({email:result?.email});
     
        if(!result || !user){// if the session is inactive, token expired
            res.status(200).json({
                success:false,
                message:"LOG_IN"
            })
        }else{// if not expired

            //update the jwt with new time to extend the session
            const {email,role} = result as {email:string, role:string};
            const newToken = jwt.sign({email,role}, process.env.JWT_SECRET_KEY as Secret,{expiresIn:'1h'});

            res.cookie('token', token , (process.env.ENVIRONMENT_NAME === 'DEVELOPMENT'? authCookieSettingsDevelopment : authCookieSettingsProduction) as CookieOptions);
            res.status(200).json({
                success:true,
                message:"LOGGED_IN",
                user:{email,role}
            })
        }
    }catch(e){
        console.log("the error is " ,(e as {message:string}).message);
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


// resending the otp 
router.post('/resend-otp', async(req,res)=>{
    try{
        
       const uvUser = await unverifiedUser.findOne({email:req.body.email});

       if(uvUser?.otpChances! <= 0 ){ // if all 3 chances are exhausted no resending
          res.status(400).json({
            success:false,
            message:'OTP_EXHAUSTED'
          })
          return;
       }

       if(!uvUser){ // if the user not found then ask to login again as session as timed out 
          res.status(400).json({
            success:false,
            message:"LOG_IN"
          })
       }else{
          const newOtp = crypto.randomInt(1000,9999).toString();
          const hashedOtp = bcrypt.hashSync(newOtp,10); // create a new hashed otp
          const newUVUser = await unverifiedUser.findOneAndUpdate(
            { email: req.body.email },
            { ...uvUser.toObject(), otp: hashedOtp}, //TODO: send the otp to mail
            { upsert: true, new: true }
          );
         
          const isOtpSent = await sendOtp(
            1,
            {
              name: uvUser.fullname,
              otp: newOtp.toString(),
            },
            {
              name: "Support",
              email: "support@anmoleducationalbooks.com",
            },
            {
              name: uvUser.fullname,
              email: uvUser.email,
            }
          );

          if(isOtpSent){
              res.status(200).json({
                success:true,
                message:'SUCCESS',
              })
          }else{
            res.status(500).json({
                success:false,
                message:'INTERNAL_SERVER_ERROR'
            })
          }
       }

    }catch(e){
        console.log("verify otp",e);
        res.status(500).json({
            success:false,
            message:"INTERNAL_SERVER_ERROR"
        })
    }
})

export default router ;