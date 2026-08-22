const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Logged-in User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    patientEmail: {
      type: String,
      required: true,
      lowercase: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // Appointment Day
    day: {
      type: String,
      required: true,
    },

    // Appointment Time
    slot: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);