import express from 'express'
import { appointmentsDoctor, cancelAppointment, docLogin, doctorDashboard, doctorProfile, getDoctorList, markCompleted, updateProfile } from '../controllers/doctorController.js'
import { authDoctor } from '../middleware/authDoctor.js'


const doctorRouter = express.Router()


doctorRouter.get('/list',getDoctorList)
doctorRouter.post('/login',docLogin)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/mark-completed',authDoctor,markCompleted)
doctorRouter.post('/cancel-appointment',authDoctor,cancelAppointment)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateProfile)


export default doctorRouter;