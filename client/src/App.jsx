import { Routes, Route } from "react-router-dom";

import "./App.css";

import Profile from "./pages/Profile";
import AddDoctor from "./pages/AddDoctor";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import MyAppointments from "./pages/MyAppointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 container my-3">
        <Routes>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Doctors */}
          <Route
            path="/doctors"
            element={<Doctors />}
          />

          {/* Doctor Details */}
          <Route
            path="/doctor/:id"
            element={<DoctorDetails />}
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Email OTP Verification */}
          <Route
            path="/verify-otp"
            element={<VerifyOTP />}
          />

          {/* User Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* User Appointments */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Admin Add Doctor */}
          <Route
            path="/admin/doctors/add"
            element={
              <AdminRoute>
                <AddDoctor />
              </AdminRoute>
            }
          />

          {/* Admin Appointments */}
          <Route
            path="/admin/appointments"
            element={
              <AdminRoute>
                <AdminAppointments />
              </AdminRoute>
            }
          />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;