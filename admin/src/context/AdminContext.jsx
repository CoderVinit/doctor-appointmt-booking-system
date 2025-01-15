import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'


export const AdminContext = createContext()


const AdminContextProvider = (props) => {


    const [atoken,setAtoken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"");
    const [doctors,setDoctors] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getAllDoctors = async () => {
      try {
        const {data} = await axios.post(`${backendUrl}/admin/get-doctors`,{},{headers:{atoken}})
        if(data.success){
          setDoctors(data.doctors)
          console.log(data.doctors)
          toast.success(data.message)
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const changeAvailability = async(docId)=>{
      try {
        const {data} = await axios.post(`${backendUrl}/admin/change-availability`,{docId},{headers:{atoken}})
        if(data.success){
          getAllDoctors()
          toast.success(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const value = {
        atoken,setAtoken,
        backendUrl,doctors,
        getAllDoctors,changeAvailability
    }

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider;