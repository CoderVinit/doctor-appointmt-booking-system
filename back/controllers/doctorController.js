import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailabiliy = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ message: "Availability changed successfully", success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, success: false });
  }
};

const getDoctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api for doctor login

const docLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Incorrect Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get doctor appointments for doctor panel

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to mark appointment completed doctor panel

const markCompleted = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// api to cancel appointment doctor panel

const cancelAppointment = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment cancelled" });
    } else {
      return res.json({ success: false, message: "Cancelled Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get dashboard data

const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    let eranings = 0;

    appointments.map((item, index) => {
      if (item.isCompleted || item.payment) {
        eranings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item, index) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dataDas = {
      eranings,
      patients: patients.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dataDas });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;

    const doctor = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to update the doctor profile

const updateProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;

    const doctor = await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailabiliy,
  getDoctorList,
  docLogin,
  appointmentsDoctor,
  markCompleted,
  cancelAppointment,
  doctorDashboard,
  doctorProfile,
  updateProfile
};
