import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'

const Navbar = () => {
    const {atoken,setAtoken} = useContext(AdminContext)
    const navigate = useNavigate()

    const handleLogout = ()=>{
        navigate("/")
        atoken && setAtoken("")
        atoken && localStorage.removeItem('aToken')
    }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{atoken?'Admin':'Doctor'}</p>
      </div>
      <button onClick={handleLogout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar
