import mongoose from "mongoose";


const connectMongoDB = async () => {

try{
    const connect= await mongoose.connect(process.env.MONGO_URI); 
console.log(`MongoDB connected: ${connect.connection.host}`);

}

catch(err){
    console.error(`Error to connection: ${err.message}`);
process.exit(1);

}

}


export default connectMongoDB;