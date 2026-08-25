/**
 * SmileHub Email Templates
 * Formatted exactly as requested.
 */

// 1. Appointment Confirmed Template
const getAppointmentConfirmedTemplate = ({
  patientName,
  doctorName,
  specialization,
  day,
  slot,
}) => {
  const subject = `SmileHub - Appointment Confirmed`;

  const message = `Hello ${patientName},

Your SmileHub appointment status has been updated.

Appointment Details:

Doctor: ${doctorName}
Specialization: ${specialization || "General Healthcare"}
Day: ${day}
Time Slot: ${slot}
Status: Confirmed

Regards,
SmileHub Team`;

  return { subject, message, html: null };
};

// 2. Appointment Completed Template
const getAppointmentCompletedTemplate = ({
  patientName,
  doctorName,
  specialization,
  day,
  slot,
}) => {
  const subject = `SmileHub - Appointment Completed`;

  const message = `Hello ${patientName},

Your SmileHub appointment status has been updated.

Appointment Details:

Doctor: ${doctorName}
Specialization: ${specialization || "General Healthcare"}
Day: ${day}
Time Slot: ${slot}
Status: Completed

Regards,
SmileHub Team`;

  return { subject, message, html: null };
};

// 3. Appointment Cancelled Template
const getAppointmentCancelledTemplate = ({
  patientName,
  doctorName,
  specialization,
  day,
  slot,
}) => {
  const subject = `SmileHub - Appointment Cancelled`;

  const message = `Hello ${patientName},

Your SmileHub appointment has been cancelled.

Appointment Details:

Doctor: ${doctorName}
Specialization: ${specialization || "General Healthcare"}
Day: ${day}
Time Slot: ${slot}
Status: Cancelled

Regards,
SmileHub Team`;

  return { subject, message, html: null };
};

// 4. Appointment Booked (Pending) Template
const getAppointmentBookedTemplate = ({
  patientName,
  doctorName,
  specialization,
  day,
  slot,
}) => {
  const subject = `SmileHub - Appointment Pending`;

  const message = `Hello ${patientName},

Your SmileHub appointment status has been updated.

Appointment Details:

Doctor: ${doctorName}
Specialization: ${specialization || "General Healthcare"}
Day: ${day}
Time Slot: ${slot}
Status: Pending

Regards,
SmileHub Team`;

  return { subject, message, html: null };
};

// 5. Appointment Rescheduled Template
const getAppointmentRescheduledTemplate = ({
  patientName,
  doctorName,
  specialization,
  oldDay,
  oldSlot,
  newDay,
  newSlot,
}) => {
  const subject = `SmileHub - Appointment Rescheduled`;

  const message = `Hello ${patientName},

Your SmileHub appointment status has been updated.

Appointment Details:

Doctor: ${doctorName}
Specialization: ${specialization || "General Healthcare"}
Day: ${newDay}
Time Slot: ${newSlot}
Status: Pending

Regards,
SmileHub Team`;

  return { subject, message, html: null };
};

module.exports = {
  getAppointmentConfirmedTemplate,
  getAppointmentCompletedTemplate,
  getAppointmentCancelledTemplate,
  getAppointmentBookedTemplate,
  getAppointmentRescheduledTemplate,
};