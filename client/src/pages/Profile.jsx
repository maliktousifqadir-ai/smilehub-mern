import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        toast.error("Please login first");
        return;
      }

      const res = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setUser(res.data);
      setName(res.data.name || "");
      setPhone(res.data.phone || "");
      setAddress(res.data.address || "");

      // Fetch appointment stats for profile overview
      try {
        const appRes = await api.get("/appointments", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const total = appRes.data?.length || 0;
        const completed =
          appRes.data?.filter((a) => a.status === "Completed")?.length || 0;
        setStats({ total, completed });
      } catch {
        // Optional fallback
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        toast.error("Please login first");
        return;
      }

      const res = await api.put(
        "/users/profile",
        { name, phone, address },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setUser(res.data.user);

      // Update localStorage user info
      const updatedUserInfo = {
        ...userInfo,
        name: res.data.user.name,
        email: res.data.user.email,
      };

      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-3 text-secondary">Loading Profile...</h5>
      </div>
    );
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-person-bounding-box text-primary me-2"></i>
            My Profile
          </h2>
          <p className="text-muted mb-0">Manage your personal information and preferences</p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/appointments" className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold">
            <i className="bi bi-calendar2-check me-1"></i> My Appointments
          </Link>
          <Link to="/doctors" className="btn btn-primary rounded-pill px-3 py-2 fw-semibold text-white shadow-sm">
            <i className="bi bi-search me-1"></i> Find Doctors
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: User Snapshot Card */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
            {/* Gradient Header Banner */}
            <div
              style={{
                height: "100px",
                background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              }}
            ></div>

            {/* Avatar & Basic Info */}
            <div className="card-body text-center pt-0 px-4 pb-4">
              <div
                className="d-flex align-items-center justify-content-center bg-white text-primary rounded-circle shadow mx-auto fw-bold"
                style={{
                  width: "90px",
                  height: "90px",
                  fontSize: "32px",
                  marginTop: "-45px",
                  border: "4px solid #ffffff",
                }}
              >
                {initials}
              </div>

              <h4 className="fw-bold text-dark mt-3 mb-1">{user?.name || "Patient"}</h4>
              <p className="text-muted small mb-2">
                <i className="bi bi-envelope me-1"></i> {user?.email}
              </p>

              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-semibold">
                  <i className="bi bi-patch-check-fill me-1"></i> Active Account
                </span>
                {user?.isAdmin && (
                  <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 rounded-pill fw-semibold">
                    <i className="bi bi-shield-lock-fill me-1"></i> Admin
                  </span>
                )}
              </div>

              <hr className="my-3 text-muted opacity-25" />

              {/* Account Stats */}
              <div className="row text-center g-2">
                <div className="col-6">
                  <div className="bg-light p-3 rounded-3">
                    <div className="fs-4 fw-bold text-primary">{stats.total}</div>
                    <div className="small text-muted">Appointments</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-light p-3 rounded-3">
                    <div className="fs-4 fw-bold text-success">{stats.completed}</div>
                    <div className="small text-muted">Completed</div>
                  </div>
                </div>
              </div>

              <hr className="my-3 text-muted opacity-25" />

              {/* Metadata details */}
              <div className="text-start small">
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>User ID:</span>
                  <span className="font-monospace text-dark text-truncate" style={{ maxWidth: "160px" }}>
                    {user?._id}
                  </span>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>Account Type:</span>
                  <span className="fw-semibold text-dark">{user?.isAdmin ? "Administrator" : "Standard Patient"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
              <div
                className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3"
                style={{ width: "36px", height: "36px" }}
              >
                <i className="bi bi-pencil-square fs-5"></i>
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-0">Personal Information</h5>
                <small className="text-muted">Update your profile details and contact information</small>
              </div>
            </div>

            <form onSubmit={updateProfile}>
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-12 mb-2">
                  <label className="form-label fw-bold text-secondary small">
                    <i className="bi bi-person me-1 text-primary"></i> Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg border-start-0 fs-6"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-bold text-secondary small">
                    <i className="bi bi-envelope me-1 text-primary"></i> Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control form-control-lg border-start-0 fs-6 bg-light text-muted"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                  <small className="text-muted mt-1 d-block" style={{ fontSize: "11px" }}>
                    Email cannot be changed directly for security.
                  </small>
                </div>

                {/* Phone Number */}
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-bold text-secondary small">
                    <i className="bi bi-telephone me-1 text-primary"></i> Phone Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-telephone text-muted"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control form-control-lg border-start-0 fs-6"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +92 300 1234567"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold text-secondary small">
                    <i className="bi bi-geo-alt me-1 text-primary"></i> Residential Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 align-items-start pt-3">
                      <i className="bi bi-geo-alt text-muted"></i>
                    </span>
                    <textarea
                      className="form-control border-start-0 fs-6"
                      rows="3"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your street address, city, and postal code"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg rounded-pill px-5 fw-semibold text-white shadow-sm"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-1"></i> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;