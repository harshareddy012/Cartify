import { Router} from "express" ;
const router = Router() ;
export default router ; 
 import {syncUser} from "../controllers/userController" ;
 import {requireAuth } from "@clerk/express" ;

// defining the route for syncing user 
router.post("/sync" , requireAuth, syncUser) ;    // here we are getting error at requireAuth() because                

//  /api/users/sync   => post , this is a endpoiont where it is gonna sync the user from the cler to neon db 
// we have to export the router at the top