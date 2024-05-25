import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import connectMongoDB from './db/connectmongodb.js';
import authRoutes from './routes/authRoutes.js';


dotenv.config();  
const app =express(); 

const port=process.env.PORT || 5000;  
  

app.use(express.json());// to parse the incoming request with JSON payloads


app.use(urlencoded({extended:true})); // to parse the incoming request with urlencoded payloads
 // to parse the incoming request with cookie payloads
 app.use(cookieParser());
app.use("/api/auth",authRoutes); 




console.log(process.env.MONGO_URI); 

 app.listen(port,()=>{
    console.log(`Server running on port ${port}`) 
    connectMongoDB();
}
);