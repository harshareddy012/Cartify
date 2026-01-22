import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


// users table 

export const users = pgTable("users" , {
    id: uuid("id").primaryKey() , // we have used text instead of serial becuase we are gonna use clerk id as user id 
    email:text("email").unique().notNull() , // schemas 
    name:text("name") ,
    imageUrl:text("image_url") ,
    createdAt: timestamp("created_at" , {mode:"date"} ).notNull().defaultNow() , 
    updatedAt: timestamp("updated_at" , {mode:"date"} ).notNull().defaultNow() 
    .$onUpdate(()=> new Date()),
}) ; 


// products table 

export const products = pgTable("products" , {
id: uuid("id")
// .defaultRandom() 
.primaryKey() ,    // uuid : universally unique identifier 128 bit unique identifier that promises the random value that is hard to guess
title: text("title").notNull() , 
description: text("description").notNull() , 
  imageUrl:text("image_url") ,
  userId:uuid("user_id") 
  .notNull() 
  .references(()=> users.id , { onDelete: "cascade"}),  createdAt:timestamp("created_at" , {mode:"date"} ).notNull() .defaultNow(), 

});
// comments table

export const comments = pgTable("comments" , {
    id: uuid("id") .primaryKey() , 
    content: text("content").notNull(),
    userId:uuid("user_id")   // if the user is deleted then the comment is also deleted 
    .defaultRandom()
    .notNull()
    .references(()=> users.id , {onDelete:'cascade'}),

productId:uuid("product_id")
.notNull()
.references(()=> products.id , {onDelete:"cascade"}),  // here we have got the problem , the fk should be of same type her we have u have product id as "text " and comment refreed as "uuid " so we need to change the product id to uuid
createdAt:timestamp("created_at" , {mode:"date"} ).notNull() .defaultNow(), 
});



// RELATIONS DEFINE HOW TABLES CONNECT TO EACH OTHER 

// USER RELATION : one user can have many products and many comments 

// new drizzle relations API ,
// separate table like the skill chain only when there exists a MANY : MANY 

// in our case there exists a 1:MANY relationship so we need to use FK in that itself 



// update we are gonna use the OLD relations cuz the NEW relations are still evolving and are error prone 

// export const relation = relations( {users , products , comments}  , 
//     ( r )=>({

//     })
// );




//  OLD relations 

// user relations 
export const usersRelations = relations( users , ({many})=>({
    products: many(products),  //one user ==> many products 
    comments: many(comments),  //one user ==> many comments 
}));


// product relations 

export const productsRelations = relations(products , ({one, many})=>({

comments: many(comments),  //one product ==> many comments  
users: one(users ,{fields:[products.userId] , references:[users.id]}), // one product has only one user , i fwe have any ONE record then mention the field(primary key) and reffrences(foreign key) to show how it gonna work one way 
}));


//comments
// to remember this 
// eport const "ts-name for rela" = "realtion()" (table_name ) ,( {"object of 1,many inside an call back "}   )  =>  ( {relation objects inside an arguments } )
export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }), //comment prmary and foriegn key for the user 
  product: one(products, { fields: [comments.productId], references: [products.id] }),//comment prmary and foriegn key for the product 
}));


// type inferences 



// simple analogy that i have learned :  think of u have a box , car in red  , u wanna tell someone to get u that car 

// then u tell them get me car from { box : 1  , name : car  , color: red }   , you basically give all the information 




//  type infrence for users 
export type User = typeof users.$inferSelect; // this allows us to use the User ( object ) in other modules wihtout actually defining them 
export type NewUser = typeof users.$inferInsert ;// this allows us to create a new feild while in the select we have to make use of exisitng fields in db 


// products 
export type Product = typeof products.$inferSelect ;
export type NewProduct = typeof products.$inferInsert ;


// comments 

export type Comments = typeof comments.$inferSelect ;
export type NewComments = typeof comments.$inferInsert ;
