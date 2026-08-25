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
      return toast.error("Please enter OTP");
    }

    if (otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    try {
      setLoading(true);

      const res = await api.post("/users/verify-otp", {
        email,
        otp,
      });

      // DEBUG: Check what backend is sending
      console.log("OTP Verification Response:", res.data);
      console.log("Admin Status from Backend:", res.data.isAdmin);

      // Save verified user information
      localStorage.setItem(
        "userInfo",
        JSON.stringify(res.data)
      );

      // DEBUG: Check what was saved
      console.log(
        "Saved User Info:",
        JSON.parse(localStorage.getItem("userInfo"))
      );

      toast.success("Email verified successfully!");

      navigate("/");
    } catch (error) {
      console.error("OTP Verification Error:", error);

      toast.error(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div
        className="card shadow mx-auto p-4"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center mb-3">
          Verify Your Email
        </h2>

        <p className="text-center text-muted">
          We have sent a 6-digit OTP to:
        </p>

        <p className="text-center fw-bold">
          {email}
        </p>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="form-label">
              Enter OTP
            </label>

            <input
              type="text"
              className="form-control text-center"
              placeholder="Enter 6-digit OTP"
              value={otp}
              maxLength="6"
              inputMode="numeric"
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          <Link to="/register">
            Back to Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;