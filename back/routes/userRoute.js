import express from 'express'
import { appointmentList, bookAppointment, cancelAppointment, Login, paymentRazorPay, Register, updateUserProfile, userProfile, varifyRazorpay } from '../controllers/userController.js';
import { authUser } from '../middleware/authUser.js';
import upload from '../middleware/multer.js'

const userRouter = express.Router();


userRouter.post('/register',Register)
userRouter.post('/login',Login)
userRouter.get('/get-profile',authUser,userProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateUserProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointment-list',authUser,appointmentList)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorPay)
userRouter.post('/varifyRazorpay',authUser,varifyRazorpay)



export {userRouter}