// console.log("hey from index.ts file !")
import express from "express";
import { ENV } from "./config/env"  // this si here what we have imported 
import { clerkMiddleware } from '@clerk/express' // clerk  middleware
import cors from "cors"; // cors 

const app = express();

app.use(clerkMiddleware()); // using the clerk middleware function 
app.use(express.json());  // body parser middleware
app.use(express.urlencoded({extended:true})); // frontend data from action parser
app.use(cors({origin:ENV.FRONTEND_URL}))


app.get("/" , (req , res)=>{
    // res.sendStatus(200);
    res.json({
        message:"welcme to productify API - powered by postgreSQL , Drizzle ORM & Clerk Auth ", 
        endpoints:{
            users:"api/users",
            porducts:"api/products",
            comments:"api/comments",
        },

    });
});



app.listen(ENV.PORT,()=>console.log(`the server is running on port  ${ENV.PORT}`));// now ENV.PORT is our env variable