import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [atoken, setAtoken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashboard, setDashBoard] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/admin/get-doctors`,
        {},
        { headers: { atoken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/admin/change-availability`,
        { docId },
        { headers: { atoken } }
      );
      if (data.success) {
        getAllDoctors();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/admin/appointments`, {
        headers: { atoken },
      });
      if (data.success) {
        console.log(data.appointments);
        setAppointments(data.appointments)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  const cancelAppointments = async(appointmentId)=>{
    try {
      const {data} = await axios.post(`${backendUrl}/admin/cancel-appointments`,{appointmentId},{headers:{atoken}});
      if(data.success){
        toast.success(data.message)
        getAppointments()
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const dashboardData = async()=>{
    try {
      const {data} = await axios.get(`${backendUrl}/admin/dashboard`,{headers:{atoken}});
      if(data.success){
        console.log(data.dasData)
        setDashBoard(data.dasData)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const value = {
    atoken,
    setAtoken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,setAppointments,
    getAppointments,
    cancelAppointments,
    dashboard,
    dashboardData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
