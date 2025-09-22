import mongoose from 'mongoose';

async function connectDB(){
    try{
        console.log("connecting db ...");
        await mongoose.connect(
          process.env.ENVIRONMENT_NAME === "PRODUCTION"
            ? (process.env.DB_CONNECTION_URL as string)
            : (process.env.MONGODB_URL as string)
        );
        console.log("DB successfully connected");
    }catch(e){
        console.log(e);
        mongoose.connection.close();
    }
}

export default connectDB;