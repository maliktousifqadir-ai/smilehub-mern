import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-white border-bottom shadow-sm py-3">
      <div className="container">

        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-extrabold fs-4" to="/">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
            style={{
              width: "38px",
              height: "38px",
              background: "var(--primary-gradient)",
              fontSize: "1.2rem",
            }}
          >
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <span className="fw-bold" style={{ color: "var(--dark)", letterSpacing: "-0.5px" }}>
            Smile<span style={{ color: "var(--primary)" }}>Hub</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 mt-3 mt-lg-0">

            {/* Home */}
            <li className="nav-item">
              <Link
                className={`nav-link px-3 py-2 rounded-3 fw-semibold ${
                  isActive("/") ? "text-primary active bg-light" : "text-secondary"
                }`}
                to="/"
              >
                Home
              </Link>
            </li>

            {/* Doctors */}
            <li className="nav-item">
              <Link
                className={`nav-link px-3 py-2 rounded-3 fw-semibold ${
                  isActive("/doctors") ? "text-primary active bg-light" : "text-secondary"
                }`}
                to="/doctors"
              >
                Find Doctors
              </Link>
            </li>

            {/* About */}
            <li className="nav-item">
              <Link
                className={`nav-link px-3 py-2 rounded-3 fw-semibold ${
                  isActive("/about") ? "text-primary active bg-light" : "text-secondary"
                }`}
                to="/about"
              >
                About Us
              </Link>
            </li>

            {/* Contact */}
            <li className="nav-item">
              <Link
                className={`nav-link px-3 py-2 rounded-3 fw-semibold ${
                  isActive("/contact") ? "text-primary active bg-light" : "text-secondary"
                }`}
                to="/contact"
              >
                Contact
              </Link>
            </li>

            {/* Logged In User Options */}
            {userInfo ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 py-2 rounded-3 fw-semibold ${
                      isActive("/dashboard") ? "text-primary active bg-light" : "text-secondary"
                    }`}
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 py-2 rounded-3 fw-semibold ${
                      isActive("/appointments") ? "text-primary active bg-light" : "text-secondary"
                    }`}
                    to="/appointments"
                  >
                    Appointments
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link px-3 py-2 rounded-3 fw-semibold ${
                      isActive("/profile") ? "text-primary active bg-light" : "text-secondary"
                    }`}
                    to="/profile"
                  >
                    Profile
                  </Link>
                </li>

                {userInfo.isAdmin && (
                  <li className="nav-item">
                    <Link
                      className="nav-link px-3 py-2 rounded-3 fw-bold text-warning-emphasis bg-warning bg-opacity-25"
                      to="/admin"
                    >
                      <i className="bi bi-shield-lock-fill me-1"></i> Admin
                    </Link>
                  </li>
                )}

                {/* User Greeting & Logout */}
                <li className="nav-item d-flex align-items-center gap-2 ps-lg-2 mt-2 mt-lg-0">
                  <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-semibold">
                    <i className="bi bi-person-circle text-primary me-1"></i> {userInfo.name}
                  </span>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-semibold"
                    onClick={logoutHandler}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </li>
              </>
            ) : (
              /* Logged Out Options */
              <li className="nav-item d-flex align-items-center gap-2 ps-lg-3 mt-3 mt-lg-0">
                <Link
                  className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold"
                  to="/login"
                >
                  Log In
                </Link>
                <Link
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-white shadow-sm"
                  to="/register"
                >
                  Get Started
                </Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;