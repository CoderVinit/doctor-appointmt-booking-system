import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import { userRouter } from './routes/userRoute.js'


const app = express()
const PORT = process.env.PORT || 5000;

// connect to database
connectDB()
connectCloudinary()

// const corsOptions = {
//     origin: 'http://localhost:5173,http://localhost:9000', // replace with your frontend URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
// };

//middleware
app.use(express.json())
app.use(cors())


//texting api

app.get("/",(req,res)=>{
    res.send("Hello world")
});

// api endpoints
app.use("/api/admin",adminRouter)
app.use("/api/doctor",doctorRouter)
app.use("/api/user",userRouter)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
