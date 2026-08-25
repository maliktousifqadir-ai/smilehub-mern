import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white border-top mt-auto pt-5 pb-4">
      <div className="container">
        <div className="row g-4 pb-4">
          
          {/* Col 1: Brand info */}
          <div className="col-lg-4 col-md-6">
            <Link className="d-flex align-items-center gap-2 text-decoration-none mb-3" to="/">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "var(--primary-gradient)",
                  fontSize: "1.1rem",
                }}
              >
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <span className="fw-bold fs-4" style={{ color: "var(--dark)", letterSpacing: "-0.5px" }}>
                Smile<span style={{ color: "var(--primary)" }}>Hub</span>
              </span>
            </Link>
            <p className="text-muted small pe-lg-4 mb-4">
              SmileHub is a trusted online healthcare platform connecting patients with top-certified medical specialists. Book appointments, manage health records, and receive timely medical advice.
            </p>
            <div className="d-flex gap-2">
              <a href="#social" className="btn btn-sm btn-light rounded-circle text-primary" style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#social" className="btn btn-sm btn-light rounded-circle text-primary" style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#social" className="btn btn-sm btn-light rounded-circle text-primary" style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#social" className="btn btn-sm btn-light rounded-circle text-primary" style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-dark mb-3">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/doctors" className="text-decoration-none text-muted">Find Doctors</Link></li>
              <li><Link to="/login" className="text-decoration-none text-muted">Patient Login</Link></li>
              <li><Link to="/register" className="text-decoration-none text-muted">Register</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Specialties */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold text-dark mb-3">Specialties</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/doctors" className="text-decoration-none text-muted">General Physicians</Link></li>
              <li><Link to="/doctors" className="text-decoration-none text-muted">Dermatologists</Link></li>
              <li><Link to="/doctors" className="text-decoration-none text-muted">Pediatricians</Link></li>
              <li><Link to="/doctors" className="text-decoration-none text-muted">Neurologists</Link></li>
              <li><Link to="/doctors" className="text-decoration-none text-muted">Gynecologists</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark mb-3">Get in Touch</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt text-primary"></i> 100 Health Ave, Medical City
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone text-primary"></i> +1 (800) 123-4567
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-envelope text-primary"></i> support@smilehub.com
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-clock text-primary"></i> Mon - Sat: 8:00 AM - 8:00 PM
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-top pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-muted">
          <div>© 2026 SmileHub. All rights reserved.</div>
          <div className="d-flex gap-3">
            <a href="#privacy" className="text-decoration-none text-muted">Privacy Policy</a>
            <a href="#terms" className="text-decoration-none text-muted">Terms of Service</a>
            <a href="#contact" className="text-decoration-none text-muted">Help Center</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;