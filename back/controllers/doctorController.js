import doctorModel from '../models/doctorModel.js';

const changeAvailabiliy = async(req,res)=>{
    try {
        const {docId} = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({message:"Availability changed successfully",success:true})
    } catch (error) {
        console.log(error)
        res.json({message:error.message,success:false})
    }
}

const getDoctorList = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email']);
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {changeAvailabiliy,getDoctorList}