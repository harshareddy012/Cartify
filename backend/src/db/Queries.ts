//   THIS FILE IS A DAL ( DATA ACCESS LAYER )



// interacting with database tables
// we are gonna create users , products , comments tables
import { db } from "./index";
import { desc, eq } from "drizzle-orm" ;
import { users, products, comments, type NewUser, type NewProduct, type NewComments } from "./schema";

// USER QUERIES 

// export const createUser = async ( user : NewUser ) => {
//     const [ newUser ] = await db.insert( users ).values( user ).returning() ;
//     return newUser ;
// }



// C R U D ( upsert is service layer level function )

// this function will create a new user in the database
export const createUser = async (data: NewUser) => {
    const [user] = await db.insert(users).values(data).returning();
    return user;
} ;

// this function will get a user by id from the database
export const getUserById = async (id:string ) =>{
return await db.query.users.findFirst ( {where: eq ( users.id , id) ,   } ) ; // db.query.users  this will access the db access table 
}

// export const updateUser = async( id: string , data : Partial<NewUser>)=>{
export const updateUser = async( id: string , data : Partial<NewUser>)=>{
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updatedUser;
};// upsert = create / update 


export const upsertUser = async ( data: NewUser)=>{
    const existingUser = await getUserById(data.id); // if the user exists we will update else create
    if(existingUser) return updateUser( data.id , data) ; 
    return createUser(data) ;  
}
//  product queries 

// create 

export const createProduct = async ( data :NewProduct) =>{
    const [product] = await db.insert(products) .values(data).returning() ;
    return product ; 
}

// read 

export const getAllProductById  = async(id:string)=>{
    return await db.query.products.findMany( 
        {with:
            {users:true}, // normal join to get user details along with product
            orderBy: (products,{ desc})=> [desc( products.createdAt)] , // square brackets used in drizzle to denote array even if it is a single column
                
         
        })
};


// update

export const getProductById = async (id : string) =>{
    return await db.query.products.findFirst(
        {
            where: eq ( products.id , id ),// condition to find product by id
            with:                          //with is like sql join
            {
                users:true, // normal join to get user details along with products
                comments:{ //comments is a nested join to get comments along with product
                    with:
                    {
                        user:true // we would have used comments:true what will give only comment details but we want user details along with comments so we use nested with
                    },
                    orderBy: (comments , {desc}) => [ desc ( comments.createdAt)] // ordering comments by createdAt in descending order
        }
    }
}
 )
}


//delete
export const deleteProductById = async ( id: string) =>{
const [product] = await db.delete(products).where(eq (products.id , id)).returning();
return product ; 
};



// comment queries 

// CREATE 
 
export const createComment = async (data: NewComments)=>{
const [comment] = await db.insert(comments) 
.values(data)
// .onConflictDoUpdate()
.returning() ;

return comment ; 
}


//  READ 

export const getCommentById = async (id : string )=>{
    return await db.query.comments.findFirst(
        {
            with:
            {
                user:true , 
            }
        }
    )
};

// update 
export const updateCommentById = async (id: string , data: Partial<NewComments> )=>{
    const [comment] = await db.update(comments) .set(data) .where(eq(comments.id , id )) .returning() ;
    return comment ;
};

// delete 


export const deleteCommentById = async (id : string )=> {
    const [comment] = await db.delete(comments) .where(eq( comments.id , id ))  .returning() ;
    return comment ; 
};