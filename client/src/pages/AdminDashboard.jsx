import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [appointmentLoading, setAppointmentLoading] =
    useState(true);

  // Edit Doctor
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    photo: "",
  });

  // ==============================
  // Appointment Statistics
  // ==============================

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "Confirmed"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === "Cancelled"
  ).length;

  // ==============================
  // Load Dashboard
  // ==============================

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  // ==============================
  // Get Doctors
  // ==============================

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors");

      setDoctors(res.data);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Get All Appointments
  // ==============================

  const fetchAppointments = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      if (!userInfo?.token) {
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
      setAppointmentLoading(false);
    }
  };

  // ==============================
  // Open Edit Doctor
  // ==============================

  const openEditDoctor = (doctor) => {
    setEditingDoctor(doctor);

    setEditForm({
      name: doctor.name || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      specialization:
        doctor.specialization || "",
      qualification:
        doctor.qualification || "",
      experience:
        doctor.experience || "",
      photo: doctor.photo || "",
    });
  };

  // ==============================
  // Close Edit
  // ==============================

  const closeEditDoctor = () => {
    setEditingDoctor(null);

    setEditForm({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      qualification: "",
      experience: "",
      photo: "",
    });
  };

  // ==============================
  // Edit Form Change
  // ==============================

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // Update Doctor
  // ==============================

  const updateDoctor = async (e) => {
    e.preventDefault();

    try {
      setEditLoading(true);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const res = await api.put(
        `/doctors/${editingDoctor._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message);

      closeEditDoctor();

      fetchDoctors();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update doctor"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // ==============================
  // Delete Doctor
  // ==============================

  const deleteDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const res = await api.delete(
        `/doctors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message);

      fetchDoctors();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete doctor"
      );
    }
  };

  // ==============================
  // Update Appointment Status
  // ==============================

  const updateAppointmentStatus = async (
    id,
    status
  ) => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const res = await api.patch(
        `/appointments/admin/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message);

      fetchAppointments();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update appointment status"
      );
    }
  };

  return (
    <div className="container my-5">

      {/* ==============================
          Dashboard Header
      ============================== */}

      <div className="text-center mb-5">

        <h1 className="fw-bold text-primary">
          🛠️ Admin Dashboard
        </h1>

        <p className="text-muted">
          Manage SmileHub doctors and appointments
        </p>

      </div>

      {/* ==============================
          Main Dashboard Cards
      ============================== */}

      <div className="row g-4 mb-5">

        {/* Doctors */}

        <div className="col-md-4">

          <div className="card shadow border-0 h-100">

            <div className="card-body text-center p-4">

              <h2 className="text-primary">
                👨‍⚕️
              </h2>

              <h5 className="fw-bold">
                Total Doctors
              </h5>

              <h2 className="fw-bold">
                {doctors.length}
              </h2>

              <Link
                to="/admin/doctors/add"
                className="btn btn-primary mt-2"
              >
                Add Doctor
              </Link>

            </div>

          </div>

        </div>

        {/* Appointments */}

        <div className="col-md-4">

          <div className="card shadow border-0 h-100">

            <div className="card-body text-center p-4">

              <h2 className="text-success">
                📅
              </h2>

              <h5 className="fw-bold">
                Appointments
              </h5>

              <h2 className="fw-bold">
                {appointments.length}
              </h2>

              <p className="text-muted mb-0">
                Manage patient appointments
              </p>

            </div>

          </div>

        </div>

        {/* Profile */}

        <div className="col-md-4">

          <div className="card shadow border-0 h-100">

            <div className="card-body text-center p-4">

              <h2 className="text-warning">
                👤
              </h2>

              <h5 className="fw-bold">
                Admin Profile
              </h5>

              <p className="text-muted mb-0">
                View your administrator profile
              </p>

              <Link
                to="/profile"
                className="btn btn-warning mt-3"
              >
                My Profile
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* ==============================
          Appointment Statistics
      ============================== */}

      <div className="row g-4 mb-5">

        {/* Pending */}

        <div className="col-md-3">

          <div className="card shadow border-0 text-center h-100">

            <div className="card-body">

              <h2>🟡</h2>

              <h6 className="fw-bold">
                Pending
              </h6>

              <h2 className="fw-bold text-warning">
                {pendingCount}
              </h2>

              <p className="text-muted mb-0">
                Pending Appointments
              </p>

            </div>

          </div>

        </div>

        {/* Confirmed */}

        <div className="col-md-3">

          <div className="card shadow border-0 text-center h-100">

            <div className="card-body">

              <h2>🟢</h2>

              <h6 className="fw-bold">
                Confirmed
              </h6>

              <h2 className="fw-bold text-success">
                {confirmedCount}
              </h2>

              <p className="text-muted mb-0">
                Confirmed Appointments
              </p>

            </div>

          </div>

        </div>

        {/* Completed */}

        <div className="col-md-3">

          <div className="card shadow border-0 text-center h-100">

            <div className="card-body">

              <h2>🔵</h2>

              <h6 className="fw-bold">
                Completed
              </h6>

              <h2 className="fw-bold text-primary">
                {completedCount}
              </h2>

              <p className="text-muted mb-0">
                Completed Appointments
              </p>

            </div>

          </div>

        </div>

        {/* Cancelled */}

        <div className="col-md-3">

          <div className="card shadow border-0 text-center h-100">

            <div className="card-body">

              <h2>🔴</h2>

              <h6 className="fw-bold">
                Cancelled
              </h6>

              <h2 className="fw-bold text-danger">
                {cancelledCount}
              </h2>

              <p className="text-muted mb-0">
                Cancelled Appointments
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ==============================
          Registered Doctors
      ============================== */}

      <div className="card shadow border-0 mb-5">

        <div className="card-header bg-primary text-white">

          <h4 className="mb-0">
            👨‍⚕️ Registered Doctors
          </h4>

        </div>


        <div className="card-body">

          {loading ? (

            <p className="text-center">
              Loading doctors...
            </p>

          ) : doctors.length === 0 ? (

            <div className="alert alert-info text-center">
              No doctors found.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>

                  <tr>

                    <th>Name</th>

                    <th>Specialization</th>

                    <th>Email</th>

                    <th>Experience</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {doctors.map((doctor) => (

                    <tr key={doctor._id}>

                      <td className="fw-bold">
                        {doctor.name}
                      </td>

                      <td>
                        {doctor.specialization ||
                          "N/A"}
                      </td>

                      <td>
                        {doctor.email}
                      </td>

                      <td>
                        {doctor.experience || 0} Years
                      </td>

                      <td>

                        <div className="d-flex gap-2">

                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              openEditDoctor(doctor)
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              deleteDoctor(
                                doctor._id
                              )
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ==============================
          All Patient Appointments
      ============================== */}

      <div className="card shadow border-0 mb-5">

        <div className="card-header bg-success text-white">

          <h4 className="mb-0">
            📅 All Patient Appointments
          </h4>

        </div>

        <div className="card-body">

          {appointmentLoading ? (

            <p className="text-center">
              Loading appointments...
            </p>

          ) : appointments.length === 0 ? (

            <div className="alert alert-info text-center">
              No appointments found.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>

                  <tr>

                    <th>Patient</th>

                    <th>Email</th>

                    <th>Doctor</th>

                    <th>Day</th>

                    <th>Slot</th>

                    <th>Status</th>

                    <th>Action</th>

                  </tr>

                </thead>

                <tbody>

                  {appointments.map(
                    (appointment) => (

                      <tr
                        key={appointment._id}
                      >

                        <td className="fw-bold">
                          {appointment.patientName}
                        </td>

                        <td>
                          {appointment.patientEmail}
                        </td>

                        <td>
                          {appointment.doctor?.name ||
                            "Doctor"}
                        </td>

                        <td>
                          {appointment.day}
                        </td>

                        <td>
                          {appointment.slot}
                        </td>

                        <td>

                          <span
                            className={`badge ${
                              appointment.status ===
                              "Cancelled"
                                ? "bg-danger"
                                : appointment.status ===
                                  "Completed"
                                ? "bg-primary"
                                : appointment.status ===
                                  "Confirmed"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {appointment.status}
                          </span>

                        </td>

                        <td>

                          <select
                            className="form-select form-select-sm"
                            value={
                              appointment.status
                            }
                            onChange={(e) =>
                              updateAppointmentStatus(
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

          )}

        </div>

      </div>

      {/* ==============================
          Edit Doctor Modal
      ============================== */}

      {editingDoctor && (

        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0, 0, 0, 0.5)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered modal-lg">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  ✏️ Edit Doctor
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditDoctor}
                ></button>

              </div>

              <form onSubmit={updateDoctor}>

                <div className="modal-body">

                  <div className="row g-3">

                    {/* Name */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Doctor Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={editForm.name}
                        onChange={
                          handleEditChange
                        }
                        required
                      />

                    </div>

                    {/* Email */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={editForm.email}
                        onChange={
                          handleEditChange
                        }
                        required
                      />

                    </div>

                    {/* Phone */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Phone
                      </label>

                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={editForm.phone}
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>

                    {/* Specialization */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Specialization
                      </label>

                      <input
                        type="text"
                        name="specialization"
                        className="form-control"
                        value={
                          editForm.specialization
                        }
                        onChange={
                          handleEditChange
                        }
                        required
                      />

                    </div>

                    {/* Qualification */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Qualification
                      </label>

                      <input
                        type="text"
                        name="qualification"
                        className="form-control"
                        value={
                          editForm.qualification
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>

                    {/* Experience */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Experience
                      </label>

                      <input
                        type="number"
                        name="experience"
                        className="form-control"
                        value={
                          editForm.experience
                        }
                        onChange={
                          handleEditChange
                        }
                        min="0"
                      />

                    </div>

                    {/* Photo */}

                    <div className="col-12">

                      <label className="form-label">
                        Photo URL
                      </label>

                      <input
                        type="text"
                        name="photo"
                        className="form-control"
                        value={editForm.photo}
                        onChange={
                          handleEditChange
                        }
                        placeholder="Doctor photo URL"
                      />

                    </div>

                  </div>

                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEditDoctor}
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={editLoading}
                  >
                    {editLoading
                      ? "Updating..."
                      : "Update Doctor"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;