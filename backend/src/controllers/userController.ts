import type{ Request , Response } from "express" ;
import * as querCon from "../db/Queries" ; // so that we can use the specific thing in our controller 
import {getAuth } from "@clerk/express" ;


// now a cotroller function is designed to sync the authenticated users from clerk to neon db on req
export const syncUser = async(req: Request , res : Response) =>{
    try {
        const { userId } = getAuth(req) ;
        if (!userId) return res.status(401).json({error : "unauthorized user ! "});
        const { email , name , imageUrl} = req.body;
        
        if ( !email || !name || !imageUrl) {
            return res.status(400).json({error:"all fields are required ! "}); 

    }
    const user = await querCon.upsertUser({id:userId , email , name , imageUrl}) // this function will either insert or update the user based on whether they exist or not 
    res.status(200).json(user);
}
catch (error){
console.error("Error in syncUser controller:", error);
res.status(500).json({error: "failed to sync the user ! "})
}
}
