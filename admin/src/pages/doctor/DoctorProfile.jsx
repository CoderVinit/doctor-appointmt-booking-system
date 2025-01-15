import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
import {toast} from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {
  const { dtoken, profile, setProfile, doctorProfile,backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit,setIsEdit] = useState(false)
  
  const updateProfile = async()=>{
    try {
      const updatedData = {
        fees:profile.fees,
        address:profile.address,
        available:profile.available
      }
      const {data} = await axios.post(`${backendUrl}/doctor/update-profile`,updatedData,{headers:{dtoken}});
      if(data.success){
        toast.success(data.message)
        setIsEdit(false)
        doctorProfile()
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  

  useEffect(() => {
    if (dtoken) {
      doctorProfile();
    }
  }, [dtoken]);
  return (
    profile && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={profile.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* DocInfo  :    name, Degree, Experiece */}

            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">{profile.name}</p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profile.degree}-{profile.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">{profile.experience}</button>
            </div>

            {/* {About} */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">About</p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1"
              >{profile.about}</p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Appointment fees:{" "}
              <span className="text-gray-800">
                {currency} {isEdit ? <input type="number" onChange={(e)=>setProfile(prev=>({...prev,fees:e.target.value}))} value={profile.fees} /> : profile.fees}
              </span>
            </p>
            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit? <input type="text" onChange={(e)=>setProfile(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} value={profile?.address?.line1} /> :profile?.address?.line1}
                <br />
                {isEdit? <input type="text" onChange={(e)=>setProfile(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))} value={profile?.address?.line2} /> :profile?.address?.line2}
              </p>
            </div>
            <div className="flex gap-1 pt-2">
              <input onChange={(e)=>setProfile(prev=>({...prev,available:!prev.available}))} checked={profile.available} type="checkbox" />
              <label htmlFor="">Availbale</label>
            </div>
            {
              isEdit ? 
              <button onClick={updateProfile} className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:text-white hover:bg-primary transition-all">Save</button>
              :
              <button onClick={()=>setIsEdit(true)} className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:text-white hover:bg-primary transition-all">Edit</button>
            }
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
