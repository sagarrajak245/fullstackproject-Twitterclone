import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectMongoDB from './db/connectmongodb.js';
import authRoutes from './routes/authroutes.js';
import notificationRoutes from './routes/notificationroutes.js';  
import postRoutes from './routes/postroutes.js';
import userRoutes from './routes/userroutes.js';

dotenv.config();  



import * as cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,   
});





const app = express();     
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 
const port = process.env.PORT || 5003;             

app.use(express.json({ limit: "5mb" })); // to parse the incoming request with JSON payloads
app.use(urlencoded({ extended: true })); // to parse the incoming request with urlencoded payloads
app.use(cookieParser()); // to parse the incoming request with cookie payloads

// Define your routes
app.use("/api/auth", authRoutes);     
app.use("/api/users", userRoutes); // This includes user and bookmark routes
app.use('/api/posts', postRoutes); 
app.use('/api/notifications', notificationRoutes);              

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/twitter-frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/twitter-frontend/dist', 'index.html'));    
  });
}

// Connect to MongoDB and start the server
connectMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);   
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Optionally log the MongoDB URI in development only
if (process.env.NODE_ENV !== 'production') {
  console.log('MongoDB URI:', process.env.MONGO_URI);
}
