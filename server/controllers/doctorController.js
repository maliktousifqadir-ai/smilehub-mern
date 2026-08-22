const Doctor = require("../models/Doctor");

// ==============================
// Add Doctor
// ==============================
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      photo,
      availableDays,
      availableSlots,
    } = req.body;

    // Check if doctor already exists
    const doctorExists = await Doctor.findOne({ email });

    if (doctorExists) {
      return res.status(400).json({
        message: "Doctor already exists",
      });
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      photo,
      availableDays,
      availableSlots,
    });

    res.status(201).json({
      message: "Doctor Added Successfully",
      doctor,
    });
  } catch (error) {
    console.error("Add Doctor Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get All Doctors
// ==============================
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Get Doctors Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get Single Doctor
// ==============================
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Get Doctor Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Doctor
// ==============================
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      photo,
      availableDays,
      availableSlots,
    } = req.body;

    // Check if another doctor already has this email
    if (email && email !== doctor.email) {
      const emailExists = await Doctor.findOne({
        email,
        _id: { $ne: req.params.id },
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Another doctor already uses this email",
        });
      }
    }

    // Update only provided fields
    doctor.name = name ?? doctor.name;
    doctor.email = email ?? doctor.email;
    doctor.phone = phone ?? doctor.phone;
    doctor.specialization =
      specialization ?? doctor.specialization;
    doctor.qualification =
      qualification ?? doctor.qualification;
    doctor.experience =
      experience ?? doctor.experience;
    doctor.photo = photo ?? doctor.photo;
    doctor.availableDays =
      availableDays ?? doctor.availableDays;
    doctor.availableSlots =
      availableSlots ?? doctor.availableSlots;

    const updatedDoctor = await doctor.save();

    res.status(200).json({
      message: "Doctor Updated Successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Update Doctor Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Delete Doctor
// ==============================
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Doctor Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Doctor Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Export
// ==============================
module.exports = {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};