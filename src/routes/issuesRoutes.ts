import express from 'express';
import superAuthMiddleware from '../middlewares/superAuthMiddleware.js';
import issueModel from '../models/issueModel.js';
import IssueSchema from '../customTypes/IssueType.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

//what user can do
router.get('/' , authMiddleware, async (req,res)=>{
    try{
        const issues = await issueModel.find({user: req.body.authMiddleware.user.email }).select({_id: 0}).sort({resolved:1,issueDate:-1});
        res.status(200).json({
            success: true,
            message: 'SUCCESS',
            data: issues
        })

    }catch(e){
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR'
        })
    }
})


router.post("/", authMiddleware, async (req, res) => {
  try {
    const parsedIssue = IssueSchema.safeParse(req.body);
    console.log("the parse issue is " , parsedIssue);
    if (parsedIssue.success) {
      const issue = await issueModel.create({...(parsedIssue.data) , user: req.body.authMiddleware.user.email});
      res.status(201).json({
        success: true,
        message: "SUCCESS",
      });
    } else {
        console.log(req.body.authMiddleware.user.email);
      res.status(400).json({
        success: false,
        message: "BAD_REQUEST",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "INTERNAL_SERVER_ERROR",
    });
  }
});

// TEST: if another user with another issue can reolve or not
router.get('/resolve/:id' , authMiddleware , async (req,res)=>{
    try{

        const issue = await issueModel.findOne({issueId:req.params.id , user: req.body.authMiddleware.user.email});
        
        if(issue){
            issue.resolved = true;
            issue.resolveDate = new Date();
            await issue.save();

            res.status(201).json({
                success: true,
                message: 'SUCCESS'
            })

        }else{
            res.status(404).json({
                success: false,
                message: 'NOT_FOUND'
            })
        }

    }catch(e){
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERRO'
        })
    }
})

//--this request is made serverlessly on vercel only requestResponse is update throug here
router.get('/request-response/:id', async (req,res)=>{
    try{
        const issue = await issueModel.findOne({issueId: req.params.id});
        
        if (
          issue &&
          !issue.resolved &&
          (
            issue.responseRequestDate.getTime() + 24 * 60 * 60 * 1000 < Date.now() ||
            issue.responseRequested === false
          )
        ) {
          issue.responseRequestDate = new Date(); // update the date to latest
          issue.responseRequested = true;
          await issue.save();
          console.log('now the mail will be sent');
          res.status(200).json({
            success: true,
            message: "SUCCESS",
          });
        
        } else {
          console.log('cannot send themail because',issue?.responseRequestDate.getTime(),
          issue?.responseRequested)
          res.status(200).json({
            success: false,
            message: "DUPLICATE",
          });
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR'
        })
    }
} )



export default router;

