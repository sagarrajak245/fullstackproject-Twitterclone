import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import path from 'path';
import connectMongoDB from './db/connectmongodb.js';
import authRoutes from './routes/authroutes.js';
import notificationRoutes from './routes/notificationroutes.js';
import postRoutes from './routes/postroutes.js';
import userRoutes from './routes/userroutes.js';




dotenv.config();  

cloudinary.config({

cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
api_key:process.env.CLOUDINARY_API_KEY,
api_secret:process.env.CLOUDINARY_API_SECRET,   

});











const app =express();     

const __dirname = path.resolve();

const port=process.env.PORT || 5001;              
   

app.use(express.json({ limit: "5mb" }));// to parse the incoming request with JSON payloads


app.use(urlencoded({extended:true})); // to parse the incoming request with urlencoded payloads
 // to parse the incoming request with cookie payloads
 app.use(cookieParser());
app.use("/api/auth",authRoutes);    
app.use("/api/users", userRoutes);         
app.use('/api/posts', postRoutes); 
app.use('/api/notifications', notificationRoutes);            

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'/frontend/twitter-frontend/dist')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'frontend','twitter-frontend','dist','index.html'));    
    }
    );
}

console.log(process.env.MONGO_URI);     

 app.listen(port,()=>{
    console.log(`Server running on port ${port}`)   
    connectMongoDB();
}
); 