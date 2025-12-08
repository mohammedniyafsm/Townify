import express, { type Request, type Response } from "express";
import router from "./Users/routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.get('/',(req:Request,res:Response)=>{
    res.send("Server Running at 8080");
})

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
    allowedHeaders:['Content-Type','Authorization'],
    methods:['GET','POST','PUT','DELETE','OPTIONS'] 
}))

app.use(cookieParser());

app.use(express.json());

app.use('/auth',router)

app.listen(8080,()=>{
    console.log("Server Listining at 8080")
})