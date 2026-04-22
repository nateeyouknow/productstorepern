import express from 'express';
import {ENV} from './config/env';
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors';


const app = express();
const PORT: Number =  5000;

app.use(cors({origin: ENV.FRONTEND_URL }))

app.use(clerkMiddleware()); //auth obj will be attached to the req
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get("/", (req, res)=>{
    res.status(200).json({message: "Welcome to productivity api, powered by postgresql, drizzle orm"})
});

app.listen(ENV.PORT, ()=>{
    console.log("Server is running on PORT", PORT);
})