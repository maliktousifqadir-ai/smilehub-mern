import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/register");
      return;
    }

    if (!otp) {
      return toast.error("Please enter the 6-digit OTP");
    }

    if (otp.length !== 6) {
      return toast.error("OTP must be exactly 6 digits");
    }

    try {
      setLoading(true);

      const res = await api.post("/users/verify-otp", {
        email,
        otp,
      });

      // Save verified user information
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      toast.success("Email verified successfully! Welcome to SmileHub.");

      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(
        error.response?.data?.message || "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div
        className="card shadow-sm border-0 rounded-4 mx-auto p-4 p-md-5 bg-white text-center"
        style={{ maxWidth: "460px" }}
      >
        {/* Shield/Key Icon Header */}
        <div
          className="d-inline-flex align-items-center justify-content-center text-white rounded-3 shadow-sm mx-auto mb-3"
          style={{
            width: "55px",
            height: "55px",
            background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
            fontSize: "1.6rem",
          }}
        >
          <i className="bi bi-shield-lock-fill"></i>
        </div>

        <h3 className="fw-extrabold text-dark mb-1">Verify Your Email</h3>
        <p className="text-muted small mb-3">
          We've dispatched a 6-digit verification code to:
        </p>

        <div className="p-2 bg-light border rounded-pill fw-semibold text-primary small mb-4">
          <i className="bi bi-envelope-check me-1"></i> {email || "your registered email"}
        </div>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary text-start d-block">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              className="form-control form-control-lg text-center fw-bold fs-4"
              style={{ letterSpacing: "8px" }}
              placeholder="••••••"
              value={otp}
              maxLength="6"
              inputMode="numeric"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg rounded-pill w-100 py-3 fw-bold text-white shadow-sm mb-3"
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Verifying...
              </>
            ) : (
              "Confirm & Continue"
            )}
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Didn't receive code?{" "}
          <Link to="/register" className="fw-bold text-primary text-decoration-none">
            Register again
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;