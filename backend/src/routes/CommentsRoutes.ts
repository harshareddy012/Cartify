import { Router} from "express" ;
const router = Router() ;
import * as CommentsController from "../controllers/CommentControllers";
import { requireAuth } from "@clerk/express";


//  post method to create a new comment to the particular product ( protected )  : /api/comments/:productId
router.post("/:productId" , requireAuth , CommentsController.createComment) ; 

// to delete a comment that exists ( protected )  :: /api/comments/:commentId

router.delete("/" , requireAuth , CommentsController.deleteComment) ; 


export default router ; 