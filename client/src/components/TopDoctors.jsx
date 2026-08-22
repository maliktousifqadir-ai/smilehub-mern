import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function TopDoctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  return (
    <section className="container my-5">
      <h2 className="text-center fw-bold mb-2">Top Doctors</h2>

      <p className="text-center text-muted mb-5">
        Meet our experienced doctors.
      </p>

      <div className="row">
        {doctors.map((doctor) => (
          <div className="col-lg-4 col-md-6 mb-4" key={doctor._id}>
            <div className="card shadow border-0 h-100 text-center">

              <div className="pt-4">
                <img
                  src={
                    doctor.photo && doctor.photo !== ""
                      ? doctor.photo
                      : "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(doctor.name) +
                        "&background=0D6EFD&color=fff&size=120"
                  }
                  alt={doctor.name}
                  className="rounded-circle border"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div className="card-body">
                <h4>{doctor.name}</h4>

                <p className="text-primary fw-bold">
                  {doctor.specialization}
                </p>

                <p>
                  <strong>Experience:</strong> {doctor.experience} Years
                </p>

                <p className="mb-2">
                  <strong>Available:</strong>
                </p>

                <div className="mb-3">
                  {doctor.availableDays?.map((day) => (
                    <span
                      key={day}
                      className="badge bg-success me-2 mb-2"
                    >
                      {day}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/doctor/${doctor._id}`}
                  className="btn btn-primary w-100"
                >
                  Book Appointment
                </Link>

              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopDoctors;