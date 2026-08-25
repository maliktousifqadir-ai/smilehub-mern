const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const sendEmail = require("../utils/sendEmail");
const {
  getAppointmentConfirmedTemplate,
  getAppointmentCompletedTemplate,
  getAppointmentCancelledTemplate,
  getAppointmentBookedTemplate,
  getAppointmentRescheduledTemplate,
} = require("../utils/emailTemplates");

// =====================================================
// Create Appointment
// =====================================================
const createAppointment = async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      doctor,
      day,
      slot,
    } = req.body;

    // Check required fields
    if (
      !patientName ||
      !patientEmail ||
      !doctor ||
      !day ||
      !slot
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Find doctor
    const doctorData = await Doctor.findById(doctor);

    if (!doctorData) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Check slot availability
    const existingAppointment = await Appointment.findOne({
      doctor,
      day,
      slot,
      status: { $in: ["Pending", "Confirmed"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This slot is already booked.",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      user: req.user._id,
      patientName,
      patientEmail,
      doctor,
      day,
      slot,
      status: "Pending",
    });

    // Confirmation / Booking email (non-blocking)
    try {
      const emailData = getAppointmentBookedTemplate({
        patientName,
        doctorName: doctorData.name,
        specialization: doctorData.specialization,
        day,
        slot,
      });

      await sendEmail(
        patientEmail,
        emailData.subject,
        emailData.message,
        emailData.html
      );
    } catch (emailError) {
      console.error(
        "⚠️ Confirmation email failed but appointment was created:",
        emailError.message
      );
    }

    res.status(201).json({
      message: "Appointment Booked Successfully",
      appointment,
    });
  } catch (error) {
    console.error("Appointment Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Get Logged-in User Appointments
// =====================================================
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      user: req.user._id,
    })
      .populate("doctor")
      .populate("user", "name email");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Get Appointments Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Get ALL Appointments - Admin
// =====================================================
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Get All Appointments Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Update Appointment Status - Admin
// =====================================================
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Allowed statuses
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        message: "Please provide appointment status.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status.",
      });
    }

    // Find appointment
    const appointment = await Appointment.findById(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Find doctor safely
    let doctorName = "General Specialist";
    let doctorSpecialization = "General Healthcare";

    if (appointment.doctor) {
      const doc = await Doctor.findById(appointment.doctor);
      if (doc) {
        doctorName = doc.name || doctorName;
        doctorSpecialization = doc.specialization || doctorSpecialization;
      }
    }

    // Update status
    appointment.status = status;

    await appointment.save();

    // Send targeted email according to updated status (non-blocking)
    try {
      let emailData;
      if (status === "Confirmed") {
        emailData = getAppointmentConfirmedTemplate({
          patientName: appointment.patientName,
          doctorName: doctorName,
          specialization: doctorSpecialization,
          day: appointment.day,
          slot: appointment.slot,
        });
      } else if (status === "Completed") {
        emailData = getAppointmentCompletedTemplate({
          patientName: appointment.patientName,
          doctorName: doctorName,
          specialization: doctorSpecialization,
          day: appointment.day,
          slot: appointment.slot,
        });
      } else if (status === "Cancelled") {
        emailData = getAppointmentCancelledTemplate({
          patientName: appointment.patientName,
          doctorName: doctorName,
          specialization: doctorSpecialization,
          day: appointment.day,
          slot: appointment.slot,
        });
      } else {
        emailData = getAppointmentBookedTemplate({
          patientName: appointment.patientName,
          doctorName: doctorName,
          specialization: doctorSpecialization,
          day: appointment.day,
          slot: appointment.slot,
        });
      }

      if (emailData && appointment.patientEmail) {
        await sendEmail(
          appointment.patientEmail,
          emailData.subject,
          emailData.message,
          emailData.html
        );
      }
    } catch (emailError) {
      console.error(
        "⚠️ Status update email failed but status was updated:",
        emailError.message
      );
    }

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "Update Appointment Status Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Cancel Appointment - User
// =====================================================
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Already cancelled
    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        message: "Appointment is already cancelled.",
      });
    }

    // Find doctor
    const doctorData = await Doctor.findById(
      appointment.doctor
    );

    if (!doctorData) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Update status
    appointment.status = "Cancelled";

    await appointment.save();

    // Cancellation email (non-blocking)
    try {
      const emailData = getAppointmentCancelledTemplate({
        patientName: appointment.patientName,
        doctorName: doctorData.name,
        specialization: doctorData.specialization,
        day: appointment.day,
        slot: appointment.slot,
      });

      await sendEmail(
        appointment.patientEmail,
        emailData.subject,
        emailData.message,
        emailData.html
      );
    } catch (emailError) {
      console.error(
        "⚠️ Cancellation email failed but appointment was cancelled:",
        emailError.message
      );
    }

    res.status(200).json({
      message: "Appointment Cancelled Successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "Cancel Appointment Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Reschedule Appointment - User
// =====================================================
const rescheduleAppointment = async (req, res) => {
  try {
    const { day, slot } = req.body;

    // Check required fields
    if (!day || !slot) {
      return res.status(400).json({
        message: "Please provide new day and slot.",
      });
    }

    // Find appointment
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Cancelled appointment
    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        message:
          "Cancelled appointment cannot be rescheduled.",
      });
    }

    // Completed appointment
    if (appointment.status === "Completed") {
      return res.status(400).json({
        message:
          "Completed appointment cannot be rescheduled.",
      });
    }

    // Find doctor
    const doctorData = await Doctor.findById(
      appointment.doctor
    );

    if (!doctorData) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Check new slot
    const existingAppointment = await Appointment.findOne({
      doctor: appointment.doctor,
      day,
      slot,
      status: { $in: ["Pending", "Confirmed"] },
      _id: { $ne: appointment._id },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This slot is already booked.",
      });
    }

    // Store old details
    const oldDay = appointment.day;
    const oldSlot = appointment.slot;

    // Update appointment
    appointment.day = day;
    appointment.slot = slot;
    appointment.status = "Pending";

    await appointment.save();

    // Reschedule email (non-blocking)
    try {
      const emailData = getAppointmentRescheduledTemplate({
        patientName: appointment.patientName,
        doctorName: doctorData.name,
        specialization: doctorData.specialization,
        oldDay,
        oldSlot,
        newDay: appointment.day,
        newSlot: appointment.slot,
      });

      await sendEmail(
        appointment.patientEmail,
        emailData.subject,
        emailData.message,
        emailData.html
      );
    } catch (emailError) {
      console.error(
        "⚠️ Reschedule email failed but appointment was rescheduled:",
        emailError.message
      );
    }

    res.status(200).json({
      message: "Appointment Rescheduled Successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "Reschedule Appointment Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// Export
// =====================================================
module.exports = {
  createAppointment,
  getAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
};