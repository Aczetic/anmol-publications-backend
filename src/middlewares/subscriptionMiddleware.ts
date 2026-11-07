import type { NextFunction, Request, Response } from "express";

// checks if the logged in user has subscribed the book in req.params.id
// must be used after authMiddleware , which puts the user in req.body.authMiddleware.user
const subscriptionMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    const user = req.body?.authMiddleware?.user;
    const subscriptions: string[] = user?.subscriptions ?? [];

    if(subscriptions.includes(req.params.id as string)){
        next();
    }else{
        res.status(403).json({
            success: false,
            message: "NOT_SUBSCRIBED"
        })
    }
}

export default subscriptionMiddleware;
