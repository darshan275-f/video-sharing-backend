import mongoose from "mongoose";
import { db_Name } from "../constants.js";

let connectDB=async ()=>{
    try{
        let result =await mongoose.connect(`${process.env.MONGODB_URL}/${db_Name}`);
        console.log(`DataBase connected successfully!! The Host : ${result.connection.host}`);
    }
    catch(err){
        console.log("Database connection failed!!", err);
        process.exit(1);
    }
}

export default connectDB;