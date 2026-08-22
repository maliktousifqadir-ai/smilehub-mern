import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

function Doctors() {
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

      setDoctors(res.data);
      setFilteredDoctors(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let result = [...doctors];

    // Search by doctor name
    if (search.trim() !== "") {
      result = result.filter((doctor) =>
        doctor.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Filter by specialization
    if (specialization !== "") {
      result = result.filter(
        (doctor) =>
          doctor.specialization?.toLowerCase() ===
          specialization.toLowerCase()
      );
    }

    setFilteredDoctors(result);
  };

  // Get unique specializations
  const specializations = [
    ...new Set(
      doctors
        .map((doctor) => doctor.specialization)
        .filter(Boolean)
    ),
  ];

  if (loading) {
    return (
      <div className="container text-center my-5">
        <h3>Loading Doctors...</h3>
      </div>
    );
  }

  return (
    <div className="container my-5">

      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">
          👨‍⚕️ Top Doctors
        </h1>

        <p className="text-muted">
          Find the right doctor for your healthcare needs.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-body p-4">

          <div className="row g-3">

            {/* Search */}
            <div className="col-md-7">
              <label className="form-label fw-bold">
                Search Doctor
              </label>

              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by doctor name..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            {/* Specialization */}
            <div className="col-md-5">
              <label className="form-label fw-bold">
                Specialization
              </label>

              <select
                className="form-select form-select-lg"
                value={specialization}
                onChange={(e) =>
                  setSpecialization(e.target.value)
                }
              >
                <option value="">
                  All Specializations
                </option>

                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Clear Filters */}
          {(search || specialization) && (
            <div className="text-end mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearch("");
                  setSpecialization("");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Doctor Count */}
      <div className="mb-4">
        <h5 className="text-muted">
          Showing {filteredDoctors.length} doctor
          {filteredDoctors.length !== 1 ? "s" : ""}
        </h5>
      </div>

      {/* Doctors */}
      {filteredDoctors.length === 0 ? (
        <div className="alert alert-info text-center">
          <h5>No doctors found.</h5>

          <p className="mb-0">
            Try changing your search or specialization filter.
          </p>
        </div>
      ) : (
        <div className="row">

          {filteredDoctors.map((doctor) => (
            <div
              className="col-md-4 mb-4"
              key={doctor._id}
            >
              <div className="card shadow h-100 text-center p-4">

                {/* Doctor Initials */}
                <div className="mb-3">
  {doctor.photo ? (
    <img
      src={doctor.photo}
      alt={doctor.name}
      className="rounded-circle"
      style={{
        width: "160px",
        height: "160px",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
      style={{
        width: "160px",
        height: "160px",
        fontSize: "45px",
      }}
    >
      {doctor.name
        ? doctor.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "DR"}
    </div>
  )}
</div>

                {/* Name */}
                <h3>{doctor.name}</h3>

                {/* Specialization */}
                <h5 className="text-primary">
                  {doctor.specialization}
                </h5>

                {/* Qualification */}
                <p>
                  <strong>Qualification:</strong>{" "}
                  {doctor.qualification || "N/A"}
                </p>

                {/* Experience */}
                <p>
                  <strong>Experience:</strong>{" "}
                  {doctor.experience || 0} Years
                </p>

                {/* Available Days */}
                <p className="mb-2">
                  <strong>Available:</strong>
                </p>

                <div className="mb-3">
                  {doctor.availableDays?.length > 0 ? (
                    doctor.availableDays.map(
                      (day, index) => (
                        <span
                          key={index}
                          className="badge bg-success me-2 mb-2"
                        >
                          {day}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-muted">
                      Not specified
                    </span>
                  )}
                </div>

                {/* View Details */}
                <button
                  className="btn btn-primary w-100 mt-auto"
                  onClick={() =>
                    (window.location.href = `/doctor/${doctor._id}`)
                  }
                >
                  View Details
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Doctors;