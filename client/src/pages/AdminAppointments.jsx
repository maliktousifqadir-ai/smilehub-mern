import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo || !userInfo.token) {
        toast.error("Please login first");
        return;
      }

      const res = await api.get("/appointments/admin/all", {
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

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo || !userInfo.token) {
        toast.error("Please login first");
        return;
      }

      const res = await api.patch(
        `/appointments/admin/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message || `Status updated to ${status}`);

      // Update UI immediately
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: status } : app
        )
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update appointment status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      app.patientName?.toLowerCase().includes(q) ||
      app.patientEmail?.toLowerCase().includes(q) ||
      app.doctor?.name?.toLowerCase().includes(q) ||
      app.doctor?.specialization?.toLowerCase().includes(q);

    const matchesStatus = !statusFilter || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-3 text-secondary">Loading Patient Appointments...</h5>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-1 fw-bold mb-1">
            <i className="bi bi-shield-lock-fill me-1"></i> Admin Panel
          </span>
          <h2 className="fw-bold text-dark mb-0">Manage Patient Appointments</h2>
          <p className="text-muted small mb-0">Review bookings, confirm consultation slots, and track completion</p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/admin" className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold btn-sm">
            <i className="bi bi-speedometer2 me-1"></i> Dashboard
          </Link>
          <Link to="/admin/doctors/add" className="btn btn-primary rounded-pill px-3 py-2 fw-semibold text-white shadow-sm btn-sm">
            <i className="bi bi-person-plus me-1"></i> Add Doctor
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card shadow-sm border-0 rounded-4 p-3 bg-white mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-0 ps-3">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 bg-light fs-6"
                placeholder="Search by patient name, email, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-5">
            <select
              className="form-select border-0 bg-light fs-6"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses ({appointments.length})</option>
              <option value="Pending">Pending ({appointments.filter((a) => a.status === "Pending").length})</option>
              <option value="Confirmed">Confirmed ({appointments.filter((a) => a.status === "Confirmed").length})</option>
              <option value="Completed">Completed ({appointments.filter((a) => a.status === "Completed").length})</option>
              <option value="Cancelled">Cancelled ({appointments.filter((a) => a.status === "Cancelled").length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Data Table */}
      {filteredAppointments.length === 0 ? (
        <div className="card shadow-sm border-0 rounded-4 text-center py-5">
          <div className="fs-1 text-muted mb-3">
            <i className="bi bi-calendar-x"></i>
          </div>
          <h5 className="fw-bold text-dark">No Appointments Found</h5>
          <p className="text-muted small">No patient appointments match the selected criteria.</p>
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Patient</th>
                  <th>Contact Email</th>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Schedule</th>
                  <th>Current Status</th>
                  <th className="pe-4 text-end">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => (
                  <tr key={app._id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{app.patientName}</div>
                      <small className="text-muted font-monospace" style={{ fontSize: "11px" }}>
                        ID: {app._id.slice(-6)}
                      </small>
                    </td>
                    <td>
                      <span className="small text-muted">{app.patientEmail}</span>
                    </td>
                    <td>
                      <span className="fw-semibold text-primary">
                        {app.doctor?.name || "Dr. Specialist"}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {app.doctor?.specialization || "General"}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold small text-dark">{app.day}</div>
                      <small className="text-muted">{app.slot}</small>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-1 fw-semibold ${
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
                    <td className="pe-4 text-end">
                      <select
                        className="form-select form-select-sm d-inline-block w-auto rounded-pill border-primary shadow-none fw-semibold"
                        value={app.status}
                        disabled={updatingId === app._id}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAppointments;