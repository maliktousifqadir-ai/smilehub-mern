import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

function DoctorDetails() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);

  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");

  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");

  const [loading, setLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  // ==============================
  // Fetch Doctor
  // ==============================

  const fetchDoctor = async () => {
    try {
      setDoctorLoading(true);

      const res = await api.get(`/doctors/${id}`);

      setDoctor(res.data);
    } catch (error) {
      console.error("Doctor Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load doctor details"
      );
    } finally {
      setDoctorLoading(false);
    }
  };

  // ==============================
  // Book Appointment
  // ==============================

  const bookAppointment = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    // Login Check
    if (!userInfo) {
      toast.error("Please login first");

      return;
    }

    // Day Check
    if (!day) {
      toast.error("Please select a day");

      return;
    }

    // Slot Check
    if (!slot) {
      toast.error("Please select a slot");

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

      toast.success(res.data.message);

      // Clear form
      setPatientName("");
      setPatientEmail("");
      setDay("");
      setSlot("");
    } catch (error) {
      console.error(
        "Appointment Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Loading
  // ==============================

  if (doctorLoading) {
    return (
      <div className="container my-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <h4 className="mt-3">
          Loading Doctor Details...
        </h4>
      </div>
    );
  }

  // ==============================
  // Doctor Not Found
  // ==============================

  if (!doctor) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger">
          <h4>Doctor Not Found</h4>

          <p>
            The doctor you are looking for does
            not exist.
          </p>

          <Link
            to="/doctors"
            className="btn btn-primary"
          >
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  // ==============================
  // Doctor Photo
  // ==============================

  const doctorPhoto =
    doctor.photo && doctor.photo.trim() !== ""
      ? doctor.photo
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          doctor.name
        )}&background=0D6EFD&color=fff&size=200`;

  return (
    <div className="container my-5">

      {/* ==============================
          Back Button
      ============================== */}

      <div className="mb-4">
        <Link
          to="/doctors"
          className="btn btn-outline-primary"
        >
          ← Back to Doctors
        </Link>
      </div>

      {/* ==============================
          Doctor Profile
      ============================== */}

      <div className="card shadow border-0 mb-5">

        <div className="card-body p-5">

          <div className="row align-items-center">

            {/* Photo */}

            <div className="col-md-4 text-center">

              <img
                src={doctorPhoto}
                alt={doctor.name}
                className="rounded-circle shadow"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
              />

            </div>

            {/* Basic Information */}

            <div className="col-md-8">

              <h1 className="fw-bold">
                {doctor.name}
              </h1>

              <h4 className="text-primary mb-4">
                {doctor.specialization}
              </h4>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <strong>
                    🎓 Qualification
                  </strong>

                  <p className="text-muted mb-0">
                    {doctor.qualification ||
                      "N/A"}
                  </p>
                </div>

                <div className="col-md-6 mb-3">
                  <strong>
                    💼 Experience
                  </strong>

                  <p className="text-muted mb-0">
                    {doctor.experience || 0} Years
                  </p>
                </div>

                <div className="col-md-6 mb-3">
                  <strong>
                    📞 Phone
                  </strong>

                  <p className="text-muted mb-0">
                    {doctor.phone || "N/A"}
                  </p>
                </div>

                <div className="col-md-6 mb-3">
                  <strong>
                    📧 Email
                  </strong>

                  <p className="text-muted mb-0">
                    {doctor.email || "N/A"}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==============================
          Availability
      ============================== */}

      <div className="row mb-5">

        {/* Available Days */}

        <div className="col-md-6 mb-4">

          <div className="card shadow border-0 h-100">

            <div className="card-body p-4">

              <h4 className="fw-bold mb-3">
                📅 Available Days
              </h4>

              {doctor.availableDays?.length >
              0 ? (
                doctor.availableDays.map(
                  (item) => (
                    <span
                      key={item}
                      className="badge bg-success me-2 mb-2 p-2"
                    >
                      {item}
                    </span>
                  )
                )
              ) : (
                <p className="text-muted">
                  No available days specified.
                </p>
              )}

            </div>

          </div>

        </div>

        {/* Available Slots */}

        <div className="col-md-6 mb-4">

          <div className="card shadow border-0 h-100">

            <div className="card-body p-4">

              <h4 className="fw-bold mb-3">
                🕐 Available Slots
              </h4>

              {doctor.availableSlots?.length >
              0 ? (
                doctor.availableSlots.map(
                  (item) => (
                    <span
                      key={item}
                      className="badge bg-primary me-2 mb-2 p-2"
                    >
                      {item}
                    </span>
                  )
                )
              ) : (
                <p className="text-muted">
                  No available slots specified.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ==============================
          Book Appointment
      ============================== */}

      <div className="card shadow border-0">

        <div className="card-header bg-primary text-white text-center py-3">

          <h3 className="mb-0">
            📅 Book Appointment
          </h3>

        </div>

        <div className="card-body p-4 p-md-5">

          <form onSubmit={bookAppointment}>

            <div className="row">

              {/* Patient Name */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-bold">
                  Patient Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={patientName}
                  onChange={(e) =>
                    setPatientName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* Email */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-bold">
                  Patient Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={patientEmail}
                  onChange={(e) =>
                    setPatientEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* Day */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-bold">
                  Select Day
                </label>

                <select
                  className="form-select"
                  value={day}
                  onChange={(e) => {
                    setDay(e.target.value);
                    setSlot("");
                  }}
                  required
                >

                  <option value="">
                    Select Available Day
                  </option>

                  {doctor.availableDays?.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* Slot */}

              <div className="col-md-6 mb-3">

                <label className="form-label fw-bold">
                  Select Time Slot
                </label>

                <select
                  className="form-select"
                  value={slot}
                  onChange={(e) =>
                    setSlot(e.target.value)
                  }
                  disabled={!day}
                  required
                >

                  <option value="">
                    {day
                      ? "Select Available Slot"
                      : "Select Day First"}
                  </option>

                  {doctor.availableSlots?.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* Confirm Button */}

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 mt-3"
              disabled={loading}
            >
              {loading
                ? "Booking Appointment..."
                : "✅ Confirm Appointment"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default DoctorDetails;