import userModel from "../models/userModel.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay'

const Register = async(req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name ||!email ||!password){
        return res.json({message:"Missing details",success:false})
    }

    if(!validator.isEmail(email)){
        return res.json({message:"enter a valid email",success:false})
    }
    if(password.length < 8){
        return res.json({message:"please enter minimum 8 digit password",success:false})
    }
    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(password,salt)

    const userData = {
        name,
        password:hassedPassword,
        email
    }

    const newUser = new userModel(userData);
    const user = await newUser.save()

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);

    res.json({success:true,token,message:"Register Successfully"});

  } catch (error) {
    console.log(error)
    return res.json({message:error.message,success:false})
  }
};

const Login = async(req,res)=>{

    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({message:"user does not exist",success:false})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            res.json({success:true,token,message:"login Successfull"})
        }else{
            return res.json({message:"Password is worng",success:false});
        }

    } catch (error) {
        console.log(error)
        return res.json({message:error.message,success:false})
    }
}

const userProfile = async(req,res)=>{
    try {
        const {userId} = req.body;
        const userData = await userModel.findById(userId).select('-password');

        res.json({success:true,userData})
    } catch (error) {
        console.log(error)
       return res.json({message:error.message,success:false})
    }
}

const updateUserProfile = async(req,res)=>{
    try {
        const {userId,name,phone,address,dob,gender} = req.body
        const imageFile = req.file;

        if(!name||!phone||!dob||!gender){
            return res.json({success:false,message:"Data Missing"});
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),gender,dob});

        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'});
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success:true,message:"Profile Updated"});

    } catch (error) {
        console.log(error)
       return res.json({message:error.message,success:false})
    }
}

const bookAppointment = async(req,res)=>{

    try {
        
        const {userId,docId,slotDate,slotTime} = req.body;

        const docData = await doctorModel.findById(docId).select('-password');
        if(!docData.available){
            return res.json({message:"Doctor not Available",success:false});
        }

        let slots_booked = docData.slots_booked

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({message:"Slot not Available",success:false})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password');
        delete docData.slot_booked

        const appointmentData = {
            userId,
            docId,userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
        }

        const newAppointments = new appointmentModel(appointmentData)
        await newAppointments.save()

        // save new slot data in doctr

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appointment Booked"})

    } catch (error) {
        console.log(error)
        return res.json({message:error.message,success:false})
    }

}

const appointmentList = async(req,res)=>{

    try {
        const {userId} = req.body;
        const appointment = await appointmentModel.find({userId})

        res.json({success:true,appointment})
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
    }

}

const cancelAppointment = async(req, res)=>{

    try {
        const {userId, appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if(appointmentData.userId !== userId){
            return res.json({success:false,message:"Unauthorized Action"})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        // releasing slot from doctor

        const {docId, slotDate, slotTime} = appointmentData;
        const docData = await doctorModel.findById(docId);
        let slots_booked = docData.slots_booked;
        
        slots_booked[slotDate] = slots_booked[slotDate].filter((time)=>time !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})


        res.json({success:true, message:"Appointment Cancelled"})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message:error.message})
    }

}

// api to make payment using razorpay

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET_KEY
})

const paymentRazorPay = async(req,res)=>{
    try {
        
        const {appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(!appointmentData || appointmentData.cancelled){
            return res.json({message:"Appointment cancelled or not found",success:true})
        }
        const options = {
            amount:appointmentData.amount*100,
            currency:process.env.CURRENCY,
            receipt:appointmentId
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)
        res.json({success:true,order})

    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

const varifyRazorpay = async(req,res)=>{
    try {
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"Payment Successfull"})
        }
        else{
            return res.json({success:false,message:"Payment Failed"})
        }
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
    }

}

export { Register,Login,userProfile,updateUserProfile,bookAppointment, appointmentList,cancelAppointment,paymentRazorPay,varifyRazorpay};

