import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reschedule states
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDay, setNewDay] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [rescheduleLoading, setRescheduleLoading] =
    useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =========================
  // Fetch Appointments
  // =========================
  const fetchAppointments = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      if (!userInfo) {
        toast.error("Please login first");
        return;
      }

      const res = await api.get("/appointments", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setAppointments(res.data);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Cancel Appointment
  // =========================
  const cancelAppointment = async (id) => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const res = await api.patch(
        `/appointments/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message);

      fetchAppointments();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to cancel appointment"
      );
    }
  };

  // =========================
  // Open Reschedule
  // =========================
  const openReschedule = (appointment) => {
    setRescheduleId(appointment._id);

    // Existing day and slot
    setNewDay(appointment.day || "");
    setNewSlot(appointment.slot || "");
  };

  // =========================
  // Close Reschedule
  // =========================
  const closeReschedule = () => {
    setRescheduleId(null);
    setNewDay("");
    setNewSlot("");
  };

  // =========================
  // Reschedule Appointment
  // =========================
  const rescheduleAppointment = async (id) => {
    if (!newDay || !newSlot) {
      toast.error("Please provide new day and slot.");
      return;
    }

    try {
      setRescheduleLoading(true);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const res = await api.put(
        `/appointments/${id}/reschedule`,
        {
          day: newDay,
          slot: newSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message);

      closeReschedule();

      fetchAppointments();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to reschedule appointment"
      );
    } finally {
      setRescheduleLoading(false);
    }
  };

  // =========================
  // Separate Appointments
  // =========================

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status !== "Cancelled" &&
      appointment.status !== "Completed"
  );

  const pastAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "Completed"
  );

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "Cancelled"
  );

  // =========================
  // Appointment Card
  // =========================

  const AppointmentCard = ({ appointment }) => {
    return (
      <div className="col-lg-6 mb-4">
        <div className="card shadow border-0 h-100">
          <div className="card-body">

            <h4 className="text-primary">
              {appointment.doctor?.name || "Doctor"}
            </h4>

            <p className="mb-2">
              <strong>Specialization:</strong>{" "}
              {appointment.doctor?.specialization || "N/A"}
            </p>

            <p className="mb-2">
              <strong>Patient:</strong>{" "}
              {appointment.patientName}
            </p>

            <p className="mb-2">
              <strong>Email:</strong>{" "}
              {appointment.patientEmail}
            </p>

            <p className="mb-2">
              <strong>Day:</strong>{" "}
              {appointment.day}
            </p>

            <p className="mb-3">
              <strong>Slot:</strong>{" "}
              {appointment.slot}
            </p>

            <p className="mb-3">
              <strong>Status:</strong>{" "}

              <span
                className={`badge ${
                  appointment.status === "Cancelled"
                    ? "bg-danger"
                    : appointment.status === "Completed"
                    ? "bg-primary"
                    : appointment.status === "Confirmed"
                    ? "bg-success"
                    : "bg-warning text-dark"
                }`}
              >
                {appointment.status}
              </span>
            </p>

            {/* Upcoming Appointment Buttons */}
            {appointment.status !== "Cancelled" &&
              appointment.status !== "Completed" && (
                <div className="d-flex gap-2">

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      cancelAppointment(
                        appointment._id
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      openReschedule(appointment)
                    }
                  >
                    Reschedule
                  </button>

                </div>
              )}

            {/* Cancelled */}
            {appointment.status === "Cancelled" && (
              <button
                className="btn btn-secondary"
                disabled
              >
                Cancelled
              </button>
            )}

            {/* Completed */}
            {appointment.status === "Completed" && (
              <button
                className="btn btn-primary"
                disabled
              >
                Completed
              </button>
            )}

          </div>
        </div>
      </div>
    );
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading Appointments...</h3>
      </div>
    );
  }

  // =========================
  // Selected Appointment
  // =========================

  const selectedAppointment = appointments.find(
    (appointment) =>
      appointment._id === rescheduleId
  );

  // Doctor available days
  const availableDays =
    selectedAppointment?.doctor?.availableDays || [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

  // Doctor available slots
  const availableSlots =
    selectedAppointment?.doctor?.availableSlots || [];

  // =========================
  // Page
  // =========================

  return (
    <div className="container my-5">

      <h2 className="text-center fw-bold mb-5">
        📅 My Appointments
      </h2>

      {/* =========================
          Upcoming
      ========================= */}

      <div className="mb-5">

        <h3 className="fw-bold mb-3">
          🟢 Upcoming Appointments
        </h3>

        {upcomingAppointments.length === 0 ? (
          <div className="alert alert-info">
            No upcoming appointments found.
          </div>
        ) : (
          <div className="row">
            {upcomingAppointments.map(
              (appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                />
              )
            )}
          </div>
        )}

      </div>

      {/* =========================
          Past
      ========================= */}

      <div className="mb-5">

        <h3 className="fw-bold mb-3">
          🔵 Past Appointments
        </h3>

        {pastAppointments.length === 0 ? (
          <div className="alert alert-secondary">
            No completed appointments found.
          </div>
        ) : (
          <div className="row">
            {pastAppointments.map(
              (appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                />
              )
            )}
          </div>
        )}

      </div>

      {/* =========================
          Cancelled
      ========================= */}

      <div className="mb-5">

        <h3 className="fw-bold mb-3">
          🔴 Cancelled Appointments
        </h3>

        {cancelledAppointments.length === 0 ? (
          <div className="alert alert-light border">
            No cancelled appointments found.
          </div>
        ) : (
          <div className="row">
            {cancelledAppointments.map(
              (appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                />
              )
            )}
          </div>
        )}

      </div>

      {/* =========================
          Reschedule Modal
      ========================= */}

      {rescheduleId && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              {/* Header */}
              <div className="modal-header">

                <h5 className="modal-title">
                  📅 Reschedule Appointment
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeReschedule}
                ></button>

              </div>

              {/* Body */}
              <div className="modal-body">

                {/* Day */}
                <label className="form-label">
                  Select New Day
                </label>

                <select
                  className="form-select mb-3"
                  value={newDay}
                  onChange={(e) =>
                    setNewDay(e.target.value)
                  }
                >
                  <option value="">
                    Select Day
                  </option>

                  {availableDays.map((day) => (
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  ))}
                </select>

                {/* Slot */}
                <label className="form-label">
                  Select New Slot
                </label>

                <select
                  className="form-select"
                  value={newSlot}
                  onChange={(e) =>
                    setNewSlot(e.target.value)
                  }
                >
                  <option value="">
                    Select Slot
                  </option>

                  {availableSlots.map((slot) => (
                    <option
                      key={slot}
                      value={slot}
                    >
                      {slot}
                    </option>
                  ))}
                </select>

              </div>

              {/* Footer */}
              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeReschedule}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={rescheduleLoading}
                  onClick={() =>
                    rescheduleAppointment(
                      rescheduleId
                    )
                  }
                >
                  {rescheduleLoading
                    ? "Updating..."
                    : "Confirm Reschedule"}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MyAppointments;