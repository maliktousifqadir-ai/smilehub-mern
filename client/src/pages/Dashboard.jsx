import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);

      if (!userInfo) {
        setLoading(false);
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
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const confirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const completed = appointments.filter((a) => a.status === "Completed").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;

  const recentAppointments = [...appointments].reverse().slice(0, 4);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-3 text-secondary">Loading Patient Dashboard...</h5>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div
        className="card shadow-sm border-0 rounded-4 text-white p-4 p-md-5 mb-4 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
        }}
      >
        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="col-lg-8">
            <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold mb-3">
              <i className="bi bi-heart-pulse-fill me-1 text-danger"></i> Patient Portal
            </span>
            <h1 className="fw-extrabold mb-2 display-6">
              Welcome back, {user?.name || "Patient"}! 👋
            </h1>
            <p className="lead mb-0 text-white-50 fs-6">
              Manage your upcoming health consultations, doctor bookings, and medical history effortlessly.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <Link
              to="/doctors"
              className="btn btn-light btn-lg rounded-pill px-4 py-2 fw-bold text-primary shadow-sm me-2"
            >
              <i className="bi bi-calendar-plus me-1"></i> Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="row g-3 mb-5">
        {/* Total Appointments */}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted fw-semibold small">Total Bookings</span>
              <div
                className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-calendar-check fs-5"></i>
              </div>
            </div>
            <h2 className="fw-extrabold text-dark mb-0">{total}</h2>
            <small className="text-muted mt-2 d-block">All-time appointments</small>
          </div>
        </div>

        {/* Confirmed / Active */}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted fw-semibold small">Confirmed</span>
              <div
                className="d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-3"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-patch-check fs-5"></i>
              </div>
            </div>
            <h2 className="fw-extrabold text-success mb-0">{confirmed}</h2>
            <small className="text-success mt-2 d-block">
              {pending > 0 ? `+${pending} Pending Approval` : "Verified slots"}
            </small>
          </div>
        </div>

        {/* Completed */}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted fw-semibold small">Completed</span>
              <div
                className="d-flex align-items-center justify-content-center bg-info-subtle text-info rounded-3"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-check2-circle fs-5"></i>
              </div>
            </div>
            <h2 className="fw-extrabold text-primary mb-0">{completed}</h2>
            <small className="text-muted mt-2 d-block">Consultations done</small>
          </div>
        </div>

        {/* Cancelled */}
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted fw-semibold small">Cancelled</span>
              <div
                className="d-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-3"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-x-circle fs-5"></i>
              </div>
            </div>
            <h2 className="fw-extrabold text-danger mb-0">{cancelled}</h2>
            <small className="text-muted mt-2 d-block">Cancelled slots</small>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="row g-4">
        {/* Left: Recent Appointments */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold text-dark mb-0">Recent Appointments</h5>
                <small className="text-muted">Your latest medical consultations and bookings</small>
              </div>
              <Link to="/appointments" className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="text-center py-5">
                <div className="fs-1 text-muted mb-3">
                  <i className="bi bi-calendar-x"></i>
                </div>
                <h6 className="fw-bold text-secondary">No Appointments Yet</h6>
                <p className="text-muted small mb-3">You haven't booked any doctor appointments yet.</p>
                <Link to="/doctors" className="btn btn-primary rounded-pill px-4 btn-sm text-white">
                  Find a Doctor
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="rounded-start">Doctor</th>
                      <th>Specialty</th>
                      <th>Schedule</th>
                      <th>Status</th>
                      <th className="rounded-end text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((app) => (
                      <tr key={app._id}>
                        <td className="fw-semibold text-dark">
                          <i className="bi bi-person-badge text-primary me-2"></i>
                          {app.doctor?.name || "Dr. Specialist"}
                        </td>
                        <td className="text-muted small">{app.doctor?.specialization || "General Healthcare"}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {app.day} - {app.slot}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              app.status === "Confirmed"
                                ? "bg-success"
                                : app.status === "Completed"
                                ? "bg-primary"
                                : app.status === "Cancelled"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <Link
                            to="/appointments"
                            className="btn btn-sm btn-light border rounded-pill px-3 fw-semibold text-secondary"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Action Hub & Tips */}
        <div className="col-lg-4">
          {/* Quick Actions Card */}
          <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-lightning-charge-fill text-warning me-2"></i> Quick Actions
            </h5>
            <div className="d-grid gap-2">
              <Link
                to="/doctors"
                className="btn btn-light border text-start d-flex align-items-center justify-content-between p-3 rounded-3 hover-lift"
              >
                <div>
                  <div className="fw-bold text-dark">Search Top Doctors</div>
                  <small className="text-muted">Browse specialists & check slots</small>
                </div>
                <i className="bi bi-chevron-right text-muted"></i>
              </Link>
              <Link
                to="/appointments"
                className="btn btn-light border text-start d-flex align-items-center justify-content-between p-3 rounded-3 hover-lift"
              >
                <div>
                  <div className="fw-bold text-dark">My Appointments</div>
                  <small className="text-muted">Reschedule or cancel visits</small>
                </div>
                <i className="bi bi-chevron-right text-muted"></i>
              </Link>
              <Link
                to="/profile"
                className="btn btn-light border text-start d-flex align-items-center justify-content-between p-3 rounded-3 hover-lift"
              >
                <div>
                  <div className="fw-bold text-dark">Account Settings</div>
                  <small className="text-muted">Update profile & phone number</small>
                </div>
                <i className="bi bi-chevron-right text-muted"></i>
              </Link>
            </div>
          </div>

          {/* Health Advisory Card */}
          <div
            className="card shadow-sm border-0 rounded-4 p-4"
            style={{ background: "#f0fdf4", borderLeft: "4px solid #10b981" }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-shield-check text-success fs-4"></i>
              <h6 className="fw-bold text-success-emphasis mb-0">Health & Care Reminder</h6>
            </div>
            <p className="small text-secondary mb-0">
              Please arrive 10-15 minutes before your scheduled appointment time. Bring any existing lab reports or
              prescriptions with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;