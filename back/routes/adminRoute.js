import express from "express";
import { addDoctor, adminDashboard, adminLogin, appointmentAdmin, cancelAppointment, getAllDoctors } from "../controllers/adminController.js";
import upload from '../middleware/multer.js'
import { varifytoken } from "../middleware/authAdmin.js";
import { changeAvailabiliy } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post('/login',adminLogin);
adminRouter.post("/add-doctor",varifytoken, upload.single('image'), addDoctor);
adminRouter.post("/get-doctors",varifytoken, getAllDoctors);
adminRouter.post("/change-availability",varifytoken, changeAvailabiliy);
adminRouter.get("/appointments",varifytoken, appointmentAdmin);
adminRouter.post("/cancel-appointments",varifytoken, cancelAppointment);
adminRouter.get("/dashboard",varifytoken, adminDashboard);

export default adminRouter;
