import { Request, Response } from "express";
import * as proCon from "../db/Queries";
import {  getAuth } from "@clerk/express";
import { NewProduct } from "../db/schema";

// get all products ( public)


export const getAllproducts = async (req: Request, res: Response) => {
    try{
        const products = await proCon.getAllProducts("") ; // here "" is used because we are getting all products not specific to any user and if we dont use "" it will give error as userId is required saying that exepcted 1 argument but got 0
        res.status(200).json(products) ; // this will return all teh product details along with user details as we have used with users : true in query
    }
    catch(error){
        console.error("Error in getAllproducts controller:", error);
        res.status(500).json({ error: "failed to get all products ! "}); // here we have used {} because error is an object and we use error.message when we want to send string message ex: error.message: "some error"
    }
}


// get single product by id ( private route )
export const getProductsByUserId = async ( req:Request , res: Response) =>{
    try {
        const {id} = req.params ; // getting id from req.params
        const product = await proCon.getProductsByUserId("id") ; // calling the query function to get product by id        if(!product) return res.status(404).json({error:"product not found ! "}) ; // if product not found return 404
        res.status(200).json(product) ; // if product found return 200 with product details
    }
    catch(error){
        console.error("error in getProductsByUserId controller:", error);
        res.status(500).json({ error: "failed to get the product ! "}); // here we have used {} because error is an object and we use error.message when we want to send string message ex: error.message: "some error"
    }
}



// get my products ( protected route ) this route will get products of the currently authenticated user

export const getMyProducts = async ( req:Request , res : Response )=>{
try{
    const { userId } = getAuth (req) ; // getting userId from clerk auth
    if (!userId) return res.status(401).json({ error: "unauthorized user ! "}) ; // if no userId return 401
    const product = await proCon.getProductsByUserId(userId);   // calling the query function to get products by userId
    res.status(200).json(product) ; // return 200 with product details 
}
catch ( error ){
    console.error("error in getting my products controller:", error);
    res.status(500).json({ error: "failed to get your products ! "}); 
}
}

// create product ( protected route )
export const createProduct = async ( req:Request , res:Response)=>{
    try{
        const { userId }= getAuth(req) ; // getting userId from clerk auth
        if(!userId) return res.status(401).json({error:"unauthorized user ! "}) ; // if no userId return 401    
        const {title , description  , imageUrl} = req.body; // getting product details from req.body
        if(!title || !description || !imageUrl){
            res.status(400).json({error: "all fileds are required ! "}) ; // if any field is missing return 400
        }
        const product = await proCon.createProduct({
            title, 
            description,
            imageUrl,
            userId , 
        }as NewProduct);


        res.status(201).json(product)
        }
        catch(error){
            console.error("error creating the product") ;
        res.status(500).json({error: "Error creating the product "})
        }
    }


// update product ( protected route - owner only )



export const updateProduct  = async ( req :Request , res: Response )=>{
    try {
        const { userId} = getAuth(req);
        if (!userId) return res.status (401).json({error: "unauthariozed user ! "}) ;   
        const { id } = req.params ; 
        const { title , description , imageUrl} = req.body ;
        const existingProduct = await proCon.getProductsByUserId("id");
        if(!existingProduct) return res.status(404).json({error: "porduct not found ! " }) ;
if ( existingProduct.userId !== userId ) return res.status(403).json({error: "forbidden ! you are not allowed to update thsis product "});   // checking if the user is the owner of the product
const updateProduct = await proCon.updateProduct("id" , {
    title, 
    description,
    imageUrl,
}as any);
res.status(200).json(updateProduct);
    }
catch( error ){
    console.error("error updating the product controller : " , error );
    res.status(500).json({error : "failed to update the product ! " }) ;

}
}


//  delete product ( portected route -> owner only ) 

export const deleteProduct = async ( req: Request , res: Response )=>{
    const { userId} = getAuth(req);
    if( !userId) return res.status(401).json({error: "unauthorized user !"});
    const {id} = req.params;
    const existingProduct = await proCon.getProductsByUserId("id");
    if(!existingProduct) return res.status(401).json({ error : "product not found ! "});
if (existingProduct.userId !== userId ) return res.status(403).json ({error:"foreidden ! , you are not allowed to delete this product "}); // checking if the user is the owner of the product
try {
    const deleteProduct = await proCon.deleteProductById("id") ;
    res.status(200).json({message:"product deleted successfully !"}); // here message is a string so we can directly send it as message:"string"
}
catch(error){
    console.error( "error deleting the product controller !" , error); // here error is an object so we use , error to log the complete error object
    res.status(500).json({error: "failed to delete the product !"});

}
}

// every thing is done here in controller now we have to use these controllers in routes to define the endpoints




// summary : controllers are functions that handle the incoming requests and send back responses
// controllers call the query functions to interact with the database and perform CRUD operations
// controllers also handle errors and send appropriate status codes and messages back to the client
// controllers also use authentication middleware to protect certain routes and ensure that only authenticated users can access them
// controllers are exported and used in the routes to define the endpoints and their handlers
// controllers are the bridge between the routes and the database queries
// queries are different from controllers as they only interact with the database and do not handle requests or responses


