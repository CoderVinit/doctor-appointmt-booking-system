import { useNavigate } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'

const RelatedDoc = ({speciality,docId}) => {

    const {doctors} = useContext(AppContext)
    const navigate = useNavigate()

    const [filteredDoctors, setFilteredDoctors] = useState([])

    const filterDoctors = () => {
        const filtered = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
        setFilteredDoctors(filtered)
    }

    useEffect(()=>{
        if(doctors.length >0 && speciality){
            filterDoctors()
        }
    },[doctors,speciality,docId])

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Related Doctors</h1>
      <p className='sm:w-1/3 text-center text-xs'>Simply Browse through our extensive list of trusted doctors.</p>
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-4 px-3 md:px-0'>
        {
          filteredDoctors.slice(0, 5).map((item, index) => {
            return (
              <div onClick={() =>{ navigate(`/appointment/${item._id}`);scrollTo(0,0)}} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                <img className='bg-blue-50' src={item.image} alt="" />
                <div className='p-4'>
                  <div className='flex items-center text-center gap-2 text-sm text-green-500'>
                    <p className='w-2 h-2 rounded-full bg-green-500'></p><p>Available</p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
            )
          })
        }
      </div>
      <button onClick={() => { navigate(`/doctor/${speciality}`); scrollTo(0, 0) }} className='bg-blue-100 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
    </div>
  )
}

export default RelatedDoc
