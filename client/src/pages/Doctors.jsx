import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [search, specialization, doctors]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data || []);
      setFilteredDoctors(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let result = [...doctors];

    // Search by doctor name or specialization
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter(
        (doctor) =>
          doctor.name?.toLowerCase().includes(q) ||
          doctor.specialization?.toLowerCase().includes(q) ||
          doctor.qualification?.toLowerCase().includes(q)
      );
    }

    // Filter by specialization
    if (specialization !== "") {
      result = result.filter(
        (doctor) =>
          doctor.specialization?.toLowerCase() === specialization.toLowerCase()
      );
    }

    setFilteredDoctors(result);
  };

  // Get unique specializations
  const specializations = [
    ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-3 text-secondary">Loading Specialist Doctors...</h5>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-bold mb-2">
          🩺 Top-Tier Specialists
        </span>
        <h1 className="fw-extrabold text-dark display-6 mb-2">
          Find & Book Top Verified Doctors
        </h1>
        <p className="text-muted lead fs-6 mx-auto" style={{ maxWidth: "600px" }}>
          Schedule verified in-clinic consultations with certified practitioners across diverse medical specialties.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 p-3 bg-white">
        <div className="row g-2 align-items-center">
          {/* Search Box */}
          <div className="col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-0 ps-3">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-lg border-0 bg-light fs-6"
                placeholder="Search by doctor name, specialty, or qualification..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="btn btn-light border-0"
                  onClick={() => setSearch("")}
                >
                  <i className="bi bi-x-circle text-muted"></i>
                </button>
              )}
            </div>
          </div>

          {/* Specialty Dropdown */}
          <div className="col-md-5">
            <select
              className="form-select form-select-lg border-0 bg-light fs-6"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="">All Specializations ({doctors.length})</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec} ({doctors.filter((d) => d.specialization === spec).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Specialty Filter Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
        <span className="small text-muted fw-semibold me-1">Specialties:</span>
        <button
          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
            specialization === ""
              ? "btn-primary text-white shadow-sm"
              : "btn-light text-secondary border"
          }`}
          onClick={() => setSpecialization("")}
        >
          All
        </button>
        {specializations.map((spec) => (
          <button
            key={spec}
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              specialization === spec
                ? "btn-primary text-white shadow-sm"
                : "btn-light text-secondary border"
            }`}
            onClick={() => setSpecialization(spec === specialization ? "" : spec)}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="text-muted fw-semibold mb-0">
          Showing <span className="text-dark fw-bold">{filteredDoctors.length}</span> verified doctor
          {filteredDoctors.length !== 1 ? "s" : ""}
        </h6>
        {(search || specialization) && (
          <button
            className="btn btn-link text-decoration-none btn-sm text-danger fw-semibold p-0"
            onClick={() => {
              setSearch("");
              setSpecialization("");
            }}
          >
            <i className="bi bi-x-circle me-1"></i> Reset Filters
          </button>
        )}
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="card shadow-sm border-0 rounded-4 text-center py-5">
          <div className="fs-1 text-muted mb-3">
            <i className="bi bi-person-x"></i>
          </div>
          <h5 className="fw-bold text-dark">No Doctors Found</h5>
          <p className="text-muted small mb-4">
            No doctors matched your current search filters. Try clearing your filters or searching a different term.
          </p>
          <div>
            <button
              className="btn btn-primary rounded-pill px-4 btn-sm text-white"
              onClick={() => {
                setSearch("");
                setSpecialization("");
              }}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredDoctors.map((doctor) => {
            const photoSrc =
              doctor.photo && doctor.photo.trim() !== ""
                ? doctor.photo
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doctor.name
                  )}&background=0284c7&color=fff&size=200`;

            return (
              <div className="col-md-6 col-lg-4" key={doctor._id}>
                <div className="card shadow-sm border-0 rounded-4 h-100 overflow-hidden doctor-card bg-white position-relative">
                  {/* Doctor Image Container */}
                  <div
                    className="position-relative bg-light text-center pt-4 pb-3"
                    style={{
                      background: "linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)",
                    }}
                  >
                    <img
                      src={photoSrc}
                      alt={doctor.name}
                      className="rounded-circle shadow-sm"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        border: "4px solid #ffffff",
                      }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          doctor.name
                        )}&background=0284c7&color=fff&size=200`;
                      }}
                    />
                    <div className="mt-2">
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small">
                        <i className="bi bi-patch-check-fill me-1"></i> Verified
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="card-body p-4 d-flex flex-column text-center">
                    <h5 className="fw-bold text-dark mb-1">{doctor.name}</h5>
                    <p className="text-primary fw-semibold small mb-2">
                      {doctor.specialization || "General Healthcare"}
                    </p>

                    {/* Rating & Exp */}
                    <div className="d-flex justify-content-center align-items-center gap-3 small text-muted mb-3">
                      <span>
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        <strong className="text-dark">4.9</strong> (120+)
                      </span>
                      <span>•</span>
                      <span>
                        <i className="bi bi-briefcase text-secondary me-1"></i>
                        {doctor.experience || 0} Years Exp
                      </span>
                    </div>

                    {/* Qualification */}
                    {doctor.qualification && (
                      <p className="small text-muted mb-3 text-truncate" title={doctor.qualification}>
                        <i className="bi bi-mortarboard me-1 text-primary"></i>
                        {doctor.qualification}
                      </p>
                    )}

                    {/* Available Days Badges */}
                    <div className="mb-4">
                      <div className="small text-muted mb-1 text-start fw-semibold">Available Days:</div>
                      <div className="d-flex flex-wrap gap-1 text-start">
                        {doctor.availableDays && doctor.availableDays.length > 0 ? (
                          doctor.availableDays.slice(0, 4).map((day, idx) => (
                            <span
                              key={idx}
                              className="badge bg-light text-dark border rounded-pill px-2 py-1"
                              style={{ fontSize: "11px" }}
                            >
                              {day}
                            </span>
                          ))
                        ) : (
                          <span className="small text-muted">All week available</span>
                        )}
                        {doctor.availableDays?.length > 4 && (
                          <span className="badge bg-light text-muted border rounded-pill" style={{ fontSize: "11px" }}>
                            +{doctor.availableDays.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Booking Action CTA */}
                    <div className="mt-auto pt-2">
                      <Link
                        to={`/doctor/${doctor._id}`}
                        className="btn btn-primary rounded-pill w-100 py-2 fw-semibold text-white shadow-sm"
                      >
                        <i className="bi bi-calendar2-plus me-1"></i> Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Doctors;