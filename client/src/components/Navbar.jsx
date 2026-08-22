import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          🏥 SmileHub
        </Link>

        {/* Mobile Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav ms-auto">

            {/* Home */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* Doctors */}
            <li className="nav-item">
              <Link className="nav-link" to="/doctors">
                Doctors
              </Link>
            </li>

            {/* Logged In User */}
            {userInfo && (
              <>
                {/* Normal Dashboard */}
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>

                {/* My Appointments */}
                <li className="nav-item">
                  <Link className="nav-link" to="/appointments">
                    My Appointments
                  </Link>
                </li>

                {/* Profile */}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    My Profile
                  </Link>
                </li>

                {/* Admin Dashboard */}
                {userInfo.isAdmin && (
                  <li className="nav-item">
                    <Link
                      className="nav-link fw-bold text-warning"
                      to="/admin"
                    >
                      🛠️ Admin
                    </Link>
                  </li>
                )}

                {/* User Name */}
                <li className="nav-item">
                  <span className="nav-link">
                    👋 {userInfo.name}
                  </span>
                </li>

                {/* Logout */}
                <li className="nav-item">
                  <button
                    className="btn btn-warning ms-2"
                    onClick={logoutHandler}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Logged Out */}
            {!userInfo && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;