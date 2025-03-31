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
import videoRouter from './routes/video.routes.js';
import commentRouter from './routes/comment.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import likeRouter from './routes/like.routes.js';
import healthCheckRouter from './routes/healthCheck.routes.js';

app.use("/api/v1/healthCheack",healthCheckRouter);

app.use("/api/v1/users",router);

app.use("/api/v1/video",videoRouter);

app.use("/api/v1/comment",commentRouter);

app.use("/api/v1/tweet",tweetRouter);

app.use("/api/v1/like",likeRouter)


export {app};