import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      setUser(userInfo);

      const res = await api.get("/appointments", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setAppointments(res.data);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    }
  };

  const total = appointments.length;
  const pending = appointments.filter(
    (a) => a.status === "Pending"
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status === "Cancelled"
  ).length;

  return (
    <div className="container my-5">

      <h2 className="mb-4">
        Welcome, {user?.name}
      </h2>

      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card shadow text-center p-4">
            <h3>{total}</h3>
            <p>Total Appointments</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow text-center p-4">
            <h3>{pending}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow text-center p-4">
            <h3>{cancelled}</h3>
            <p>Cancelled</p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;