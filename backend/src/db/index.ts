import { drizzle} from "drizzle-orm/node-postgres";
import {  Pool } from "pg";
import * as schema from "./schema" ;
import {ENV} from "../config/env" ;


if (!ENV.DB_URL)
{
    throw new Error( "there is no url for database ! ") ;
    
}

// initialing new postgresql connection pool 

const pool = new Pool ( { connectionString : ENV.DB_URL}) ; 


pool.on("connect" , ()=>{
    console.log("conncetion established ! ");
});

pool.on("error" , (err)=>{
    console.log(`something went wrong ${err.message}`);

});

// to use the pool and schema objects using db.users.email ex

export const db = drizzle( {client: pool , schema });