import React, { useContext } from "react";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import { AdminContext } from "./context/AdminContext";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import AllAppointments from "./pages/admin/AllAppointments";
import DoctorsList from "./pages/admin/DoctorsList";
import AddDoctor from "./pages/admin/AddDoctor";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";

const App = () => {
  const { atoken } = useContext(AdminContext);
  const { dtoken } = useContext(DoctorContext);

  return atoken || dtoken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer/>
      <Navbar/>
      <div className="flex items-start ">
        <Sidebar/>
        <Routes>
          {/* Admin Route */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard/>} />
          <Route path="/all-appointments" element={<AllAppointments/>} />
          <Route path="/doctor-list" element={<DoctorsList/>} />
          <Route path="/add-doctor" element={<AddDoctor/>} />
          
          {/* Doctor Route */}

          <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
          <Route path="/doctor-appointments" element={<DoctorAppointments/>} />
          <Route path="/doctor-profile" element={<DoctorProfile/>} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
