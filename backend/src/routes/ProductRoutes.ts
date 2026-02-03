import { Router} from "express" ;
const router = Router() ;
import * as ProductController from "../controllers/ProductController" ;
import { requireAuth } from "@clerk/express";

// route to get all products that is public route where users can see the products without being authenticated 


router.get("/" , ProductController.getAllproducts)

// GET method to get a single product by id ( private route ) so we have to use requireAuth middleware from the clerk 

router.get("/:id" ,requireAuth,  ProductController.getProductsByUserId);

// route to get my products ( protected route ) this route will get products of the currently authenticated user

router.get("/my" , requireAuth , ProductController.getMyProducts) ;

// route to create a product ( protected route) only authenticated users can create products 

router.post("/:id" , requireAuth , ProductController.createProduct);

// update product route ( protected route -> owner only ) 
//  PUT / api / products / :id 

router.put("/:id" , requireAuth , ProductController.updateProduct);


// delete product route ( protected route -> owner only )
// DELETE / api / products / :id

router.delete("/:id" , requireAuth , ProductController.deleteProduct) ;

// summary : here we have defined all the routes for products and used the requireAuth middleware from clerk to protect the routes that require authentication


export default router ; // exporting the router to be used in the main app 