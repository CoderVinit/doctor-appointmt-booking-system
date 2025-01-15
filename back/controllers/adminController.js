import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';



const addDoctor = async (req, res) => {
    try {
        const { name, email, password, address, speciality,degree,experience, about, fees } = req.body;
        const image = req.file;
        if (!image) return res.send('Please upload a file')

        if(!name || !email || !password || !address || !speciality || !degree || !experience || !about || !fees){
            return res.status(400).json({success:false,message:"Details missing"})
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({success:false,message:"Please enter a valid email"})
        }
        if(password.length < 6){
            return res.status(400).json({success:false,message:"Password must be atleast 6 characters"})
        }
        const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(image.path,{
            resource_type: 'image',
        })
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            address:JSON.parse(address),
            speciality,
            degree,
            experience,
            about,
            fees,
            date: Date.now(),
            image: imageUrl,
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.status(200).json({success:true, message:"Doctor added successfully"})
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:error.message})
        
    }

}

const adminLogin = (req,res)=>{
    try {
        const {email,password} = req.body;
        console.log(email,password)

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true, message:'Login successful', token})
        } 
        else{
            res.json({success:false,message:'Invalid Credentials'});
        }
        
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

// get all doctors for admin panel

const getAllDoctors = async(req,res)=>{
    try {
        
        const doctors = await doctorModel.find({}).select('-password');
        res.json({success:true,doctors})

    } catch (error) {
        console.log(error)
        res.json({message:error.message,success:false})   
    }
}



export {addDoctor,adminLogin,getAllDoctors}