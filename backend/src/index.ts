import express from 'express';
import {ENV} from './config/env';
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors';
import {User } from './db/schema';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import commentRoutes from './routes/commentsRoutes';

const app = express();
const PORT: Number =  ENV.PORT ? parseInt(ENV.PORT) : 5000;

app.use(cors({origin: ENV.FRONTEND_URL }))

app.use(clerkMiddleware()); //auth obj will be attached to the req
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get("/", (req, res)=>{
    res.status(200).json({message: "Welcome to productivity api, powered by postgresql, drizzle orm",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            comments: "/api/comments",
        },
    })
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

app.listen(ENV.PORT, ()=>{
    console.log("Server is running on PORT", PORT);
})