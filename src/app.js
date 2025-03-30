import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app=express();

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.static('public'))
app.use(cookieParser());


//Routes
import router from './routes/user.routes.js';
import Videorouter from './routes/video.routes.js';
import Commentrouter from './routes/comment.routes.js';

app.use("/api/v1/users",router);

app.use("/api/v1/video",Videorouter);

app.use("/api/v1/comment",Commentrouter);


export {app};