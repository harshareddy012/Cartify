// console.log("hey from index.ts file !")
import express from "express";
import { ENV } from "./config/env"  // this si here what we have imported 
import { clerkMiddleware, requireAuth } from '@clerk/express' // clerk  middleware
import cors from "cors"; // cors 


// these are the routes that we crated and are imported 

import UserRoutes from "./routes/UserRoutes" ;     
import ProductRoutes from "./routes/ProductRoutes" ;
import CommentsRoutes from "./routes/CommentsRoutes" ;





const app = express();
app.use(requireAuth); // using the requireAuth middleware function    
app.use(clerkMiddleware()); // using the clerk middleware function 
app.use(express.json());  // body parser middleware
app.use(express.urlencoded({extended:true})); // frontend data from action parser
app.use(cors({origin:ENV.FRONTEND_URL})) // this is cors middleware to allow the frontend to access the backend apis here we have given the frontend url from env file


app.get("/" , (req , res)=>{  // this is the root route that allows us to check if the server is running
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


app.use( "api/users/",UserRoutes)    // this makes us use this in UserRoutes for writing the api endpoint just /sync is enough 
app.use( "api/products/",ProductRoutes) 
app.use( "api/comments/",CommentsRoutes) 


// app.use() is used here to mount the CommentsRoutes middleware to the Express app.

// It tells Express to use the routes defined in CommentsRoutes for any path starting with /api/comments/. Think of it like adding a "sub-router" 😊.

// If you used app.get() or app.post() instead, you'd define a single route, but app.use() applies to multiple routes (like a whole router).

app.listen(ENV.PORT,()=>console.log(`the server is running on port  ${ENV.PORT}`));// now ENV.PORT is our env variable