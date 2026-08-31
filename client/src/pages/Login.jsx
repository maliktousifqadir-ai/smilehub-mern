import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter your email and password");
    }

    try {
      setLoading(true);

      const res = await api.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      toast.success("Welcome back to SmileHub!");

      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div
        className="card shadow-sm border-0 rounded-4 mx-auto p-4 p-md-5 bg-white"
        style={{ maxWidth: "460px" }}
      >
        {/* Brand Icon Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white rounded-3 shadow-sm mb-3"
            style={{
              width: "50px",
              height: "50px",
              background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              fontSize: "1.5rem",
            }}
          >
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <h3 className="fw-extrabold text-dark mb-1">Welcome Back</h3>
          <p className="text-muted small">Sign in to your SmileHub patient account</p>
        </div>

        <form onSubmit={submitHandler}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-envelope text-muted"></i>
              </span>
              <input
                type="email"
                className="form-control form-control-lg fs-6 border-start-0"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock text-muted"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg fs-6 border-start-0 border-end-0"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-group-text bg-light border-start-0"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-muted`}></i>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg rounded-pill w-100 py-3 fw-bold text-white shadow-sm mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Don't have a SmileHub account?{" "}
          <Link to="/register" className="fw-bold text-primary text-decoration-none">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;