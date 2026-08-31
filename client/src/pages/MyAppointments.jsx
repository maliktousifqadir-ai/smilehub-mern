import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Reschedule states
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDay, setNewDay] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        toast.error("Please login first");
        return;
      }

      const res = await api.get("/appointments", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setAppointments(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const res = await api.patch(
        `/appointments/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message || "Appointment cancelled successfully");
      fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const openReschedule = (appointment) => {
    setRescheduleId(appointment._id);
    setNewDay(appointment.day || "");
    setNewSlot(appointment.slot || "");
  };

  const closeReschedule = () => {
    setRescheduleId(null);
    setNewDay("");
    setNewSlot("");
  };

  const rescheduleAppointment = async (id) => {
    if (!newDay || !newSlot) {
      toast.error("Please select both day and time slot");
      return;
    }

    try {
      setRescheduleLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

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

      toast.success(res.data.message || "Appointment rescheduled successfully!");
      closeReschedule();
      fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to reschedule appointment");
    } finally {
      setRescheduleLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status !== "Cancelled" && a.status !== "Completed"
  );
  const pastAppointments = appointments.filter((a) => a.status === "Completed");
  const cancelledAppointments = appointments.filter((a) => a.status === "Cancelled");

  const selectedAppointment = appointments.find((a) => a._id === rescheduleId);
  const availableDays = selectedAppointment?.doctor?.availableDays || [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const availableSlots = selectedAppointment?.doctor?.availableSlots || [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-3 text-secondary">Loading Your Consultations...</h5>
      </div>
    );
  }

  const renderAppointmentCard = (appointment) => {
    const doctorPhoto =
      appointment.doctor?.photo ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        appointment.doctor?.name || "Doctor"
      )}&background=0284c7&color=fff&size=150`;

    return (
      <div className="col-lg-6 mb-4" key={appointment._id}>
        <div className="card shadow-sm border-0 rounded-4 h-100 overflow-hidden bg-white">
          <div className="card-body p-4">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={doctorPhoto}
                  alt={appointment.doctor?.name || "Doctor"}
                  className="rounded-circle shadow-sm"
                  style={{ width: "65px", height: "65px", objectFit: "cover" }}
                />
                <div>
                  <h5 className="fw-bold text-dark mb-1">{appointment.doctor?.name || "Dr. Specialist"}</h5>
                  <p className="text-primary small fw-semibold mb-0">
                    {appointment.doctor?.specialization || "General Healthcare"}
                  </p>
                  <small className="text-muted">
                    <i className="bi bi-geo-alt me-1"></i> SmileHub Specialist Clinic
                  </small>
                </div>
              </div>

              <span
                className={`badge rounded-pill px-3 py-2 fw-semibold ${
                  appointment.status === "Confirmed"
                    ? "bg-success text-white"
                    : appointment.status === "Completed"
                    ? "bg-primary text-white"
                    : appointment.status === "Cancelled"
                    ? "bg-danger text-white"
                    : "bg-warning text-dark"
                }`}
              >
                {appointment.status}
              </span>
            </div>

            {/* Schedule details */}
            <div className="p-3 bg-light rounded-3 mb-3">
              <div className="row g-2 small">
                <div className="col-6">
                  <span className="text-muted d-block">Scheduled Day:</span>
                  <strong className="text-dark">
                    <i className="bi bi-calendar2-day text-primary me-1"></i> {appointment.day}
                  </strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Time Slot:</span>
                  <strong className="text-dark">
                    <i className="bi bi-clock text-primary me-1"></i> {appointment.slot}
                  </strong>
                </div>
                <div className="col-12 mt-2 pt-2 border-top">
                  <span className="text-muted">Patient: </span>
                  <strong className="text-dark">{appointment.patientName}</strong>
                  <span className="text-muted ms-2">({appointment.patientEmail})</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-end gap-2 mt-auto">
              {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                <>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold"
                    onClick={() => cancelAppointment(appointment._id)}
                  >
                    <i className="bi bi-x-circle me-1"></i> Cancel
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
                    onClick={() => openReschedule(appointment)}
                  >
                    <i className="bi bi-arrow-repeat me-1"></i> Reschedule
                  </button>
                </>
              )}
              {appointment.status === "Completed" && (
                <Link
                  to={`/doctor/${appointment.doctor?._id || ""}`}
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
                >
                  <i className="bi bi-calendar-plus me-1"></i> Book Again
                </Link>
              )}
              {appointment.status === "Cancelled" && (
                <Link
                  to={`/doctor/${appointment.doctor?._id || ""}`}
                  className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-semibold"
                >
                  <i className="bi bi-arrow-clockwise me-1"></i> Re-book Slot
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-calendar2-week text-primary me-2"></i>
            My Appointments
          </h2>
          <p className="text-muted mb-0">Track and manage all your scheduled doctor consultations</p>
        </div>
        <div className="mt-3 mt-md-0">
          <Link to="/doctors" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-white shadow-sm">
            <i className="bi bi-plus-lg me-1"></i> Book New Appointment
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4 p-1 bg-light rounded-pill border" style={{ maxWidth: "480px" }}>
        <button
          className={`btn btn-sm rounded-pill flex-fill fw-semibold py-2 transition-all ${
            activeTab === "upcoming"
              ? "btn-primary text-white shadow-sm"
              : "btn-light text-secondary border-0"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({upcomingAppointments.length})
        </button>
        <button
          className={`btn btn-sm rounded-pill flex-fill fw-semibold py-2 transition-all ${
            activeTab === "completed"
              ? "btn-primary text-white shadow-sm"
              : "btn-light text-secondary border-0"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({pastAppointments.length})
        </button>
        <button
          className={`btn btn-sm rounded-pill flex-fill fw-semibold py-2 transition-all ${
            activeTab === "cancelled"
              ? "btn-primary text-white shadow-sm"
              : "btn-light text-secondary border-0"
          }`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled ({cancelledAppointments.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "upcoming" && (
        <div>
          {upcomingAppointments.length === 0 ? (
            <div className="card shadow-sm border-0 rounded-4 text-center py-5">
              <div className="fs-1 text-muted mb-3">
                <i className="bi bi-calendar-check"></i>
              </div>
              <h5 className="fw-bold text-dark">No Upcoming Appointments</h5>
              <p className="text-muted small mb-4">You have no active or pending appointments right now.</p>
              <div>
                <Link to="/doctors" className="btn btn-primary rounded-pill px-4 btn-sm text-white">
                  Find Doctors & Schedule
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">{upcomingAppointments.map(renderAppointmentCard)}</div>
          )}
        </div>
      )}

      {activeTab === "completed" && (
        <div>
          {pastAppointments.length === 0 ? (
            <div className="card shadow-sm border-0 rounded-4 text-center py-5">
              <div className="fs-1 text-muted mb-3">
                <i className="bi bi-check2-circle"></i>
              </div>
              <h5 className="fw-bold text-dark">No Past Appointments</h5>
              <p className="text-muted small">Completed doctor consultations will appear here.</p>
            </div>
          ) : (
            <div className="row g-4">{pastAppointments.map(renderAppointmentCard)}</div>
          )}
        </div>
      )}

      {activeTab === "cancelled" && (
        <div>
          {cancelledAppointments.length === 0 ? (
            <div className="card shadow-sm border-0 rounded-4 text-center py-5">
              <div className="fs-1 text-muted mb-3">
                <i className="bi bi-journal-x"></i>
              </div>
              <h5 className="fw-bold text-dark">No Cancelled Appointments</h5>
              <p className="text-muted small">Cancelled appointments will be listed here.</p>
            </div>
          ) : (
            <div className="row g-4">{cancelledAppointments.map(renderAppointmentCard)}</div>
          )}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-primary text-white py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-calendar2-range me-2"></i>
                  Reschedule Appointment
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeReschedule}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="text-muted small mb-4">
                  Select a new day and available time slot for your consultation with{" "}
                  <strong>{selectedAppointment?.doctor?.name}</strong>.
                </p>

                {/* Select Day */}
                <div className="mb-4">
                  <label className="form-label fw-bold small text-dark">1. Select New Day</label>
                  <div className="d-flex flex-wrap gap-2">
                    {availableDays.map((d) => (
                      <button
                        type="button"
                        key={d}
                        className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                          newDay === d
                            ? "btn-primary text-white shadow-sm"
                            : "btn-light border text-secondary"
                        }`}
                        onClick={() => {
                          setNewDay(d);
                          setNewSlot("");
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Slot */}
                <div className="mb-4">
                  <label className="form-label fw-bold small text-dark">2. Select New Time Slot</label>
                  <div className="d-flex flex-wrap gap-2">
                    {availableSlots.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                          newSlot === s
                            ? "btn-success text-white shadow-sm"
                            : "btn-light border text-secondary"
                        }`}
                        onClick={() => setNewSlot(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top bg-light p-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4 fw-semibold"
                  onClick={closeReschedule}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 fw-semibold text-white shadow-sm"
                  disabled={rescheduleLoading || !newDay || !newSlot}
                  onClick={() => rescheduleAppointment(rescheduleId)}
                >
                  {rescheduleLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Rescheduling...
                    </>
                  ) : (
                    "Confirm Reschedule"
                  )}
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