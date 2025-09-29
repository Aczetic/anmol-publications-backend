import * as z from "zod";

//t
const userSchemaSignUp = z.object({
    role: z.string().regex(/[user|pricipal|teacher]/,{error:"invalid designation"}),
    fullname:    z.string().min(1,"Full name is required").regex(/[a-zA-Z]/ , {error: "Enter a valid name"}),
    password:    z.string()
                .min( 8 , {error: "Atleast 8 characters"})
                .refine( value=>/[a-z]/.test(value) , {error:'Missing a lower case letter'})
                .refine( value => /[A-Z]/.test(value) , {error: "Missing an upper case letter"})
                .refine( value => /[0-9]/.test(value) , {error: "Missing a number" })
                .refine( value => /[*\.!@#$%^&*=\-_+]/.test(value) , {error: "Missing *.!@#$%^&*=-_+"}),
    "confirm-password": z.string()
                    .min( 8 , {error: "Atleast 8 characters"})
                    .refine( value=>/[a-z]/.test(value) , {error:'Missing a lower case letter'})
                    .refine( value => /[A-Z]/.test(value) , {error: "Missing an upper case letter"})
                    .refine( value => /[0-9]/.test(value) , {error: "Missing a number" })
                    .refine( value => /[*\.!@#$%^&*=\-_+]/.test(value) , {error: "Missing *.!@#$%^&*=-_+"}),
    email:         z.email({error:'Enter a valid email address'}),
    phone:         z.string().max(10,'Enter a valid phone number').regex(/[1-9][0-9]{9}/, {error:"Enter a valid phone number"}),
    "school-name": z.string().min( 5 , "Invalid school name"),
    state:         z.string().min(1 , "State is required"),
    city:          z.string().min(1 , "City is required"),
    address:       z.string().min(1 , "Address is required")
  }).refine((data)=> data.password === data['confirm-password'],{error:"Both passwords must match" , path : ['confirm-password']})

  const userSchemaLogin = z.object({
   
    email:       z.email({error:'Enter a valid email address'}),
    password:    z.string()
                .min( 8 , {error: "Atleast 8 characters"})
                .refine( value=>/[a-z]/.test(value) , {error:'Missing a lower case letter'})
                .refine( value => /[A-Z]/.test(value) , {error: "Missing an upper case letter"})
                .refine( value => /[0-9]/.test(value) , {error: "Missing a number" })
                .refine( value => /[*\.!@#$%^&*=\-_+]/.test(value) , {error: "Missing *.!@#$%^&*=-_+"}),
  })

  type userType = z.infer<typeof userSchemaSignUp>;

  export type {userType}
  export {userSchemaSignUp , userSchemaLogin}