import express from 'express';
import testimonialModel from '../models/testimonials.js';
import TestimonialSchema from '../customTypes/TestimonialTypes.js';
import z from 'zod';
import nodemailer from 'nodemailer';


const router = express.Router();

//todo: only those who are authorized can add review
// todo: the profile image url should be of cloudflare
router.post('/testimonial',async (req,res)=>{
   try{
      const verifiedTestimonial = z.parse(TestimonialSchema , req.body);
      await testimonialModel.create(verifiedTestimonial);
      res.status(201).json({
        success: true,
        message: 'SUCCESS'
      })

   }catch(e){
    console.log(e);
      res.status(500).json({
        success: false,
        message: "INTERNAL_SERVER_ERROR"
      })
   }
})


router.get('/testimonial', async (req, res)=>{
   try{
      const tsm = await testimonialModel.find();
      res.status(200).json({
        success:true,
        message:'SUCCESS',
        data:tsm
      }) 
   
    }catch(e){
      res.status(500).json({
        success:false,
        message:'INTERNSL_SERVER_ERROR'
      })
   }
})


router.post('/contact-us' , async (req,res)=>{
  try{
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'sdfgx243@gmail.com',
        pass: process.env.APP_PASSWORD_MAIL
      }
    })
    
    const {email, fullName, message, organization, phone, subject} = req.body;

    await transporter.sendMail({
      from: '"contact" <contact@anmoleducationalbooks.com>', // sender address
      to: process.env.CONTACT_US_EMAIL, // list of receivers
      subject: `${fullName} wants to connect`, // Subject line
      text: ``, // plain text body
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: Inter, Arial, sans-serif;">

    <!-- Main Outer Container Table (Full Width) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f7f7f7;">
        <tr>
            <td align="center" style="padding: 20px 0;">

                <!-- Email Content Container (Max Width, Responsive) -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e0e0e0;">
                    
                    <!-- Header/Subject (Prominent Red) -->
                    <tr>
                        <td style="background-color: #CC0000; padding: 25px 30px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="color: #ffffff; font-size: 24px; margin: 0; line-height: 1.2;">
                                 New Contact Inquiry
                            </h1>
                        </td>
                    </tr>

                    <!-- Introduction Text -->
                    <tr>
                        <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                            <p style="margin: 0 0 20px 0;">
                                <b>${fullName}</b> has submitted a contact request. Please review the details below and follow up with the prospect promptly.
                            </p>
                            <p style="margin: 0;">
                                The user is reaching out regarding: <br/><strong>${subject}</strong>.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Details Section Title (Red) -->
                    <tr>
                        <td style="padding: 0 30px 15px 30px;">
                            <h2 style="font-size: 20px; color: #CC0000; margin: 0; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Contact Details</h2>
                        </td>
                    </tr>

                    <!-- Details Table -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table border="0" cellpadding="10" cellspacing="0" width="100%" style="font-size: 15px; border-collapse: collapse;">
                                <!-- Full Name -->
                                <tr>
                                    <td width="30%" style="background-color: #f9f9f9; padding: 12px 15px; border-radius: 4px 0 0 4px; font-weight: bold; color: #555555;">Full Name</td>
                                    <td width="70%" style="background-color: #ffffff; padding: 12px 15px; border-left: 1px solid #e0e0e0; border-radius: 0 4px 4px 0;">${fullName}</td>
                                </tr>
                                <!-- Email (Clickable Mailto Link) -->
                                <tr>
                                    <td style="background-color: #f9f9f9; padding: 12px 15px; border-radius: 4px 0 0 4px; font-weight: bold; color: #555555;">Email Address</td>
                                    <td style="background-color: #ffffff; padding: 12px 15px; border-left: 1px solid #e0e0e0; border-radius: 0 4px 4px 0;">
                                        <a href="mailto:${email}" style="color: #CC0000; text-decoration: none;">${email}</a>
                                    </td>
                                </tr>
                                <!-- Phone (Clickable Tel Link) -->
                                <tr>
                                    <td style="background-color: #f9f9f9; padding: 12px 15px; border-radius: 4px 0 0 4px; font-weight: bold; color: #555555;">Phone Number</td>
                                    <td style="background-color: #ffffff; padding: 12px 15px; border-left: 1px solid #e0e0e0; border-radius: 0 4px 4px 0;">
                                        <a href="tel:${phone}" style="color: #CC0000; text-decoration: none;">${phone}</a>
                                    </td>
                                </tr>
                                <!-- Organization -->
                                <tr>
                                    <td style="background-color: #f9f9f9; padding: 12px 15px; border-radius: 4px 0 0 4px; font-weight: bold; color: #555555;">Organization</td>
                                    <td style="background-color: #ffffff; padding: 12px 15px; border-left: 1px solid #e0e0e0; border-radius: 0 4px 4px 0;">${organization}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Message Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h2 style="font-size: 20px; color: #CC0000; margin: 0 0 15px 0; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Message from Contact</h2>
                            <div style="background-color: #f4f4f4; border-radius: 8px; border: 1px solid #e0e0e0; color: #333333; font-size: 16px; padding:1rem; word-break: break-word;">
                                ${message}
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #e9ecef; padding: 20px 30px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center; color: #6c757d; font-size: 12px;">
                            This is an automated notification from your contact form system. Don't reply to it
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>
            </html>`, // html body
    });
    console.log('contact us mail sent');
    res.status(201).send({
      success: true,
      message: 'SUCCESS'
    });

  }catch(e){
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'INTERNAL_SERVER_ERROR'
    });
  }
})

export default router;