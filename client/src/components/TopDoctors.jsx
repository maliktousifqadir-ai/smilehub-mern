import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function TopDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-5 py-4">
      {/* Section Header */}
      <div className="text-center mb-5">
        <div className="section-badge">
          <i className="bi bi-award-fill"></i>
          <span>Top Rated Specialists</span>
        </div>
        <h2 className="display-6 fw-bold mb-2">Meet Our Experienced Doctors</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "550px" }}>
          Trusted by thousands of patients for exceptional care and comprehensive medical treatments.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Finding top doctors for you...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-4">
          <i className="bi bi-people text-muted fs-1 mb-3"></i>
          <h5 className="fw-bold">No Doctors Available Right Now</h5>
          <p className="text-muted">Please check back later or explore all medical specialties.</p>
          <Link to="/doctors" className="btn btn-outline-primary mt-2">
            View All Doctors
          </Link>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {doctors.slice(0, 6).map((doctor) => (
              <div className="col-lg-4 col-md-6" key={doctor._id}>
                <div className="doctor-card">
                  
                  {/* Doctor Image Header */}
                  <div className="doctor-img-wrap">
                    <span className="doctor-status-badge">
                      <i className="bi bi-patch-check-fill"></i> Verified
                    </span>
                    <img
                      src={
                        doctor.photo && doctor.photo !== ""
                          ? doctor.photo
                          : "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(doctor.name) +
                            "&background=0284c7&color=fff&size=140&bold=true"
                      }
                      alt={doctor.name}
                      className="doctor-avatar mb-2"
                    />
                    <div className="d-flex align-items-center justify-content-center gap-1 text-warning small mt-1">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <span className="text-dark fw-bold ms-1" style={{ fontSize: "0.8rem" }}>4.9</span>
                    </div>
                  </div>

                  {/* Doctor Details Body */}
                  <div className="card-body p-4 text-center d-flex flex-column">
                    <h5 className="fw-bold mb-1 text-dark">{doctor.name}</h5>

                    <p className="text-primary fw-semibold mb-2" style={{ fontSize: "0.92rem" }}>
                      {doctor.specialization}
                    </p>

                    <div className="d-flex justify-content-center gap-3 text-muted small my-2 py-2 border-top border-bottom">
                      <div>
                        <i className="bi bi-briefcase text-primary me-1"></i>
                        <span className="fw-semibold text-dark">{doctor.experience || "5+"}</span> Yrs Exp
                      </div>
                      <div className="border-start ps-3">
                        <i className="bi bi-translate text-primary me-1"></i>
                        Eng, Urdu
                      </div>
                    </div>

                    {/* Available Days */}
                    <div className="my-2">
                      <p className="text-muted small mb-1">Available Days:</p>
                      <div className="d-flex flex-wrap justify-content-center gap-1">
                        {doctor.availableDays?.length > 0 ? (
                          doctor.availableDays.map((day) => (
                            <span
                              key={day}
                              className="badge bg-light text-dark border px-2 py-1 small rounded-pill"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {day}
                            </span>
                          ))
                        ) : (
                          <span className="badge bg-light text-muted border px-2 py-1 small">
                            Mon - Sat
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/doctor/${doctor._id}`}
                      className="btn btn-primary w-100 mt-auto rounded-3 pt-2 pb-2"
                    >
                      <i className="bi bi-calendar-plus me-1"></i> Book Appointment
                    </Link>

                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* View More Doctors Button */}
          <div className="text-center mt-5">
            <Link to="/doctors" className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill shadow-sm">
              Explore All Doctors <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default TopDoctors;