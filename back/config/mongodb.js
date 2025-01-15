import mongoose from "mongoose";

const connectDb = async()=>{

    mongoose.connection.on("connected",()=>{
        console.log("connected to database successfully")
    })
    await mongoose.connect(`${process.env.MONGODB}`)
}


export default connectDb;