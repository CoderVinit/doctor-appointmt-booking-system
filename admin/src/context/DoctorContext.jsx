import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'



export const DoctorContext = createContext()


const DoctorContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dtoken,setDtoken] = useState(localStorage.getItem('dtoken')?localStorage.getItem('dtoken'):'')
  const [appointments,setAppointments] = useState([])
  const [dasData,setDasData] = useState([])
  const [profile,setProfile] = useState([])

  const getAllAppointments = async()=>{
    try {
      const {data} = await axios.get(`${backendUrl}/api/doctor/appointments`,{headers:{dtoken}})
      if(data.success){
        setAppointments(data.appointments)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const completeAppointment = async(appointmentId)=>{
    try {
      const {data} = await axios.post(`${backendUrl}/api/doctor/mark-completed`,{appointmentId},{headers:{dtoken}})
      if(data.success){
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async(appointmentId)=>{
    try {
      const {data} = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`,{appointmentId},{headers:{dtoken}})
      if(data.success){
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const doctorDashboard = async()=>{
    try {
      const {data} = await axios.get(`${backendUrl}/api/doctor/dashboard`,{headers:{dtoken}});
      if(data.success){
        console.log(data)
        setDasData(data.dataDas)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const doctorProfile = async()=>{
    try {
      const {data} = await axios.get(`${backendUrl}/api/doctor/profile`,{headers:{dtoken}})
      if(data.success){
        setProfile(data.doctor)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  

  

    const value = {
      backendUrl,
      dtoken,setDtoken,
      getAllAppointments,
      appointments,
      setAppointments,
      completeAppointment,
      cancelAppointment,
      doctorDashboard,
      dasData,setDasData,
      doctorProfile,
      profile,setProfile
    }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider;