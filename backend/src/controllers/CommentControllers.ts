import * as CommentQuery from "../db/Queries";
import type { Request , Response} from "express" ;// here request and Response will help in type checking
import { getAuth } from "@clerk/express";
import { NewComments } from "../db/schema";


// create comment ( protected route ) 


// steps : check auth -> get userId from clerk -> get comment details from req.body -> validate -> check if the product exists or not ->  insert into db -> return response

export const createComment = async ( req : Request , res : Response)=>{
    try {
        const { userId} = getAuth(req) ;
        if ( !userId) return res.status(401).json({error: "unauthroized user ! "});
      const { productId} = req.params ; // getting productId from req.params params here is an object that contains all the route parameters
      const { content} =req.body ; // getting comment content from req.body
      if( !content ) return res.status(400).json({error :" comment content is required ! "}) ; // validating if content is present or not
      const existingProduct = await CommentQuery.getProductsByUserId("productId");
      if( !existingProduct) return res.status(404).json({ error: "product not found ! "}) ; // checking if the product exists or not
      const comment = await CommentQuery.createComment({
        content, 
        userId,
      productId,
      }as NewComments);

      res.status(200).json(comment)
    }
    catch(error){
        console.error("error creating the comment ! " , error )
        res.status(500).json(({error:"failed to create a new commnet ! , try sometime later "}));
    }
} 



// delete comment ( protected route --> only owner ) 

export const deleteComment  = async ( req: Request , res: Response)=>{
    try{
        const { userId} = getAuth(req);
        if (!userId) return res.status(401).json({error: "unauthorized user !"});
        const { commentId} = req.params ; // getting commentId from req.params
        const existingComment = await CommentQuery.getCommentById("commentId"); // getting comment by id from db
    }
    catch(error){
        console.error({error: "error in delete methode router "})
        res.status(500).json({error:"something went wrong while deleting "})
    }
}




// }as NewComments $interinsert);  }as any );

// above thing is a saviour for real ! , respect ++