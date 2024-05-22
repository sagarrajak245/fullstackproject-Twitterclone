import dotenv from 'dotenv';
import express from 'express';
import connectMongoDB from './db/connectmongodb.js';
import authRoutes from './routes/authRoutes.js';


dotenv.config();  
const app =express(); 

 const port=process.env.PORT || 5000;  


app.use(express.json());// to parse the incoming request with JSON payloads















app.use("/api/auth",authRoutes);   

console.log(process.env.MONGO_URI);

 app.listen(port,()=>{
    console.log(`Server running on port ${port}`) 
    connectMongoDB();
}
);