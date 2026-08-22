import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // Fetch All Appointments
  // ==========================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      if (!userInfo || !userInfo.token) {
        toast.error("Please login first");
        return;
      }

      const res = await api.get(
        "/appointments/admin/all",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

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

  // ==========================================
  // Update Appointment Status
  // ==========================================

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      if (!userInfo || !userInfo.token) {
        toast.error("Please login first");
        return;
      }

      const res = await api.patch(
        `/appointments/admin/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message);

      // Update UI immediately
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? {
                ...appointment,
                status: status,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update appointment status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <h3>Loading Appointments...</h3>
      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="container my-5">

      {/* Header */}
      <div className="text-center mb-5">

        <h1 className="fw-bold text-primary">
          📅 Admin Appointments
        </h1>

        <p className="text-muted">
          Manage all SmileHub patient appointments
        </p>

      </div>

      {/* No Appointments */}
      {appointments.length === 0 ? (
        <div className="alert alert-info text-center">
          No appointments found.
        </div>
      ) : (
        <div className="card shadow border-0">

          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">
              All Appointments
            </h4>
          </div>

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>
                  <tr>

                    <th>Patient</th>
                    <th>Email</th>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Day</th>
                    <th>Slot</th>
                    <th>Status</th>
                    <th>Action</th>

                  </tr>
                </thead>

                <tbody>

                  {appointments.map(
                    (appointment) => (
                      <tr key={appointment._id}>

                        {/* Patient */}
                        <td className="fw-bold">
                          {appointment.patientName}
                        </td>

                        {/* Email */}
                        <td>
                          {appointment.patientEmail}
                        </td>

                        {/* Doctor */}
                        <td>
                          {appointment.doctor?.name ||
                            "N/A"}
                        </td>

                        {/* Specialization */}
                        <td>
                          {appointment.doctor
                            ?.specialization ||
                            "N/A"}
                        </td>

                        {/* Day */}
                        <td>
                          {appointment.day}
                        </td>

                        {/* Slot */}
                        <td>
                          {appointment.slot}
                        </td>

                        {/* Status */}
                        <td>

                          <span
                            className={`badge ${
                              appointment.status ===
                              "Pending"
                                ? "bg-warning text-dark"
                                : appointment.status ===
                                  "Confirmed"
                                ? "bg-success"
                                : appointment.status ===
                                  "Completed"
                                ? "bg-primary"
                                : "bg-danger"
                            }`}
                          >
                            {appointment.status}
                          </span>

                        </td>

                        {/* Action */}
                        <td>

                          <select
                            className="form-select"
                            value={
                              appointment.status
                            }
                            disabled={
                              updatingId ===
                              appointment._id
                            }
                            onChange={(e) =>
                              updateStatus(
                                appointment._id,
                                e.target.value
                              )
                            }
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Confirmed">
                              Confirmed
                            </option>

                            <option value="Completed">
                              Completed
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                          </select>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminAppointments;