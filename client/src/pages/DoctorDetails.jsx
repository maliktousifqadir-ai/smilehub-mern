import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);

  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");

  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");

  const [loading, setLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();

    // Auto-fill logged in user info
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setPatientName(userInfo.name || "");
      setPatientEmail(userInfo.email || "");
    }
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setDoctorLoading(true);
      const res = await api.get(`/doctors/${id}`);
      setDoctor(res.data);
    } catch (error) {
      console.error("Doctor Error:", error);
      toast.error(error.response?.data?.message || "Failed to load doctor details");
    } finally {
      setDoctorLoading(false);
    }
  };

  const bookAppointment = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!day) {
      toast.error("Please select an available day");
      return;
    }

    if (!slot) {
      toast.error("Please select an available time slot");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/appointments",
        {
          patientName,
          patientEmail,
          doctor: doctor._id,
          day,
          slot,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message || "Appointment booked successfully!");

      // Reset selection and redirect to appointments
      setDay("");
      setSlot("");
      navigate("/appointments");
    } catch (error) {
      console.error("Appointment Error:", error);
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (doctorLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-3 text-secondary">Loading Specialist Profile...</h5>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 rounded-4 p-5 mx-auto" style={{ maxWidth: "500px" }}>
          <div className="fs-1 text-danger mb-3">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <h4 className="fw-bold text-dark">Doctor Not Found</h4>
          <p className="text-muted small mb-4">
            The doctor profile you are searching for might have been moved or is no longer available.
          </p>
          <Link to="/doctors" className="btn btn-primary rounded-pill px-4 py-2 text-white">
            ← Browse All Doctors
          </Link>
        </div>
      </div>
    );
  }

  const doctorPhoto =
    doctor.photo && doctor.photo.trim() !== ""
      ? doctor.photo
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          doctor.name
        )}&background=0284c7&color=fff&size=250`;

  return (
    <div className="container py-4">
      {/* Back Button */}
      <div className="mb-4">
        <Link to="/doctors" className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Back to Doctors
        </Link>
      </div>

      <div className="row g-4">
        {/* Left Column: Doctor Profile & Qualifications */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4 bg-white">
            {/* Header background */}
            <div
              style={{
                height: "120px",
                background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              }}
            ></div>

            <div className="card-body px-4 pb-4 pt-0 text-center">
              {/* Doctor Avatar */}
              <div
                className="mx-auto rounded-circle shadow position-relative bg-white"
                style={{
                  width: "140px",
                  height: "140px",
                  marginTop: "-70px",
                  border: "4px solid #ffffff",
                  overflow: "hidden",
                }}
              >
                <img
                  src={doctorPhoto}
                  alt={doctor.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      doctor.name
                    )}&background=0284c7&color=fff&size=250`;
                  }}
                />
              </div>

              <div className="mt-3">
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-semibold mb-2">
                  <i className="bi bi-patch-check-fill me-1"></i> Verified Practitioner
                </span>
                <h3 className="fw-extrabold text-dark mb-1">{doctor.name}</h3>
                <p className="text-primary fw-bold fs-6 mb-2">
                  {doctor.specialization || "General Specialist"}
                </p>
                <p className="text-muted small mb-3">
                  <i className="bi bi-mortarboard text-secondary me-1"></i>
                  {doctor.qualification || "MBBS, Specialist Certified"}
                </p>
              </div>

              {/* Rating & Experience Stats */}
              <div className="row g-2 text-center py-2 bg-light rounded-3 mb-4">
                <div className="col-4 border-end">
                  <div className="fw-bold text-dark">{doctor.experience || 0}+ Years</div>
                  <small className="text-muted" style={{ fontSize: "11px" }}>Experience</small>
                </div>
                <div className="col-4 border-end">
                  <div className="fw-bold text-warning">★ 4.9</div>
                  <small className="text-muted" style={{ fontSize: "11px" }}>Rating (150+)</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-success">98%</div>
                  <small className="text-muted" style={{ fontSize: "11px" }}>Satisfaction</small>
                </div>
              </div>

              {/* Contact / Clinic details */}
              <div className="text-start small">
                <h6 className="fw-bold text-dark mb-3">Clinic & Contact Details</h6>
                <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                  <i className="bi bi-geo-alt text-primary fs-6"></i>
                  <span>SmileHub Specialist Clinic, Main Healthcare Plaza</span>
                </div>
                {doctor.phone && (
                  <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                    <i className="bi bi-telephone text-primary fs-6"></i>
                    <span>{doctor.phone}</span>
                  </div>
                )}
                {doctor.email && (
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <i className="bi bi-envelope text-primary fs-6"></i>
                    <span>{doctor.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Appointment Booking Panel */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
            <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
              <div
                className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3 shadow-sm"
                style={{ width: "40px", height: "40px" }}
              >
                <i className="bi bi-calendar-event fs-5"></i>
              </div>
              <div>
                <h4 className="fw-extrabold text-dark mb-0">Book In-Person Consultation</h4>
                <small className="text-muted">Select your preferred day and time slot</small>
              </div>
            </div>

            <form onSubmit={bookAppointment}>
              {/* Step 1: Select Day */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark d-flex justify-content-between">
                  <span>1. Select Available Day</span>
                  {day && <span className="text-primary fw-semibold small">Selected: {day}</span>}
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {doctor.availableDays && doctor.availableDays.length > 0 ? (
                    doctor.availableDays.map((d) => (
                      <button
                        type="button"
                        key={d}
                        className={`btn rounded-pill px-4 py-2 fw-semibold transition-all ${
                          day === d
                            ? "btn-primary text-white shadow-sm"
                            : "btn-light border text-secondary"
                        }`}
                        onClick={() => {
                          setDay(d);
                          setSlot(""); // Reset slot when day changes
                        }}
                      >
                        <i className="bi bi-calendar2-day me-1"></i> {d}
                      </button>
                    ))
                  ) : (
                    <div className="alert alert-warning p-2 small mb-0 w-100">
                      No specific available days listed for this doctor.
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Select Slot */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark d-flex justify-content-between">
                  <span>2. Select Time Slot</span>
                  {slot && <span className="text-primary fw-semibold small">Selected: {slot}</span>}
                </label>
                {!day ? (
                  <div className="p-3 bg-light rounded-3 text-muted small text-center">
                    <i className="bi bi-info-circle me-1"></i> Please choose an available day first to view time slots.
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {doctor.availableSlots && doctor.availableSlots.length > 0 ? (
                      doctor.availableSlots.map((s) => (
                        <button
                          type="button"
                          key={s}
                          className={`btn rounded-pill px-3 py-2 fw-semibold ${
                            slot === s
                              ? "btn-success text-white shadow-sm"
                              : "btn-light border text-secondary"
                          }`}
                          onClick={() => setSlot(s)}
                        >
                          <i className="bi bi-clock me-1"></i> {s}
                        </button>
                      ))
                    ) : (
                      <div className="alert alert-warning p-2 small mb-0 w-100">
                        No specific slots listed. Contact clinic reception for scheduling.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 3: Patient Information */}
              <div className="mb-4 pt-3 border-top">
                <label className="form-label fw-bold text-dark mb-3">3. Patient Information</label>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-muted fw-semibold">Patient Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 fs-6"
                        placeholder="Enter patient full name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small text-muted fw-semibold">Notification Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 fs-6"
                        placeholder="Enter email for alerts"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit / Confirm Booking CTA */}
              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg rounded-pill py-3 fw-bold text-white shadow-sm"
                  disabled={loading || !day || !slot}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Confirming Appointment...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calendar-check-fill me-2"></i> Confirm Appointment Booking
                    </>
                  )}
                </button>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="bi bi-shield-lock me-1"></i> Free booking confirmation. Instant email notification will be sent.
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;