import dotenv from 'dotenv';
import { app } from './app.js';
dotenv.config({
path:'./env'
})
import connectDB from "./db/index.js";
connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`App is Listing on ${process.env.PORT}`);
    })
    .catch((err)=>{
        console.log(`Failed to Connect Database ${err}`);
    })
});