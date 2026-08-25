import { Link } from "react-router-dom";
import heroImg from "../assets/doctors-team2.jpg";

function Hero() {
  return (
    <section className="py-5 my-3 position-relative">
      <div className="row align-items-center g-5">

        {/* Left Column: Hero Content */}
        <div className="col-lg-6 text-start">
          
          {/* Trust Badge */}
          <div className="section-badge mb-3">
            <i className="bi bi-shield-fill-check"></i>
            <span>Verified Healthcare Platform</span>
          </div>

          <h1 className="display-4 fw-extrabold mb-3" style={{ lineHeight: 1.15, fontWeight: 800 }}>
            Book Appointment With <span className="text-gradient">Trusted Doctors</span>
          </h1>

          <p className="lead text-secondary mb-4" style={{ fontSize: "1.15rem", lineHeight: 1.6 }}>
            SmileHub connects you with top-rated medical specialists. Schedule consultations easily, access verified doctors, and receive top quality care today.
          </p>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-3 mb-5">
            <Link to="/doctors" className="btn btn-primary btn-lg px-4 py-3 shadow">
              <i className="bi bi-calendar-check me-2"></i> Book Appointment
            </Link>
            <a href="#specialties" className="btn btn-outline-primary btn-lg px-4 py-3">
              <i className="bi bi-grid-fill me-2"></i> View Specialties
            </a>
          </div>

          {/* Stats Bar */}
          <div className="row pt-3 border-top g-3 text-start">
            <div className="col-4">
              <h3 className="fw-bold text-primary mb-0">100+</h3>
              <p className="text-muted small mb-0">Verified Doctors</p>
            </div>
            <div className="col-4 border-start ps-3">
              <h3 className="fw-bold text-primary mb-0">50k+</h3>
              <p className="text-muted small mb-0">Happy Patients</p>
            </div>
            <div className="col-4 border-start ps-3">
              <h3 className="fw-bold text-primary mb-0">4.9 ★</h3>
              <p className="text-muted small mb-0">Average Rating</p>
            </div>
          </div>

        </div>

        {/* Right Column: Hero Image & Graphic */}
        <div className="col-lg-6 text-center position-relative">
          
          {/* Subtle Background Glow */}
          <div
            className="position-absolute top-50 start-50 translate-middle w-100 h-100 rounded-circle"
            style={{
              background: "radial-gradient(circle, rgba(2,132,199,0.12) 0%, rgba(255,255,255,0) 70%)",
              zIndex: 0,
              filter: "blur(40px)",
            }}
          ></div>

          {/* Image Container Card */}
          <div className="position-relative d-inline-block" style={{ zIndex: 1 }}>
            <img
              src={heroImg}
              alt="Trusted Doctors Team"
              className="img-fluid rounded-4 shadow-lg"
              style={{
                maxHeight: "440px",
                width: "100%",
                objectFit: "cover",
                border: "1px solid rgba(255,255,255,0.8)",
              }}
            />
{/* Transparent Floating Trust Card */}
            <div
              className="position-absolute bottom-0 start-0 translate-middle-y rounded-3 p-3 d-none d-sm-flex align-items-center gap-3 ms-n3"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "14px",
                maxWidth: "240px",
                transform: "translate(-15px, 20px)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
              }}
            >
              <div className="bg-success text-white p-2 rounded-circle fs-4 d-flex align-items-center justify-content-center shadow-sm" style={{ width: "42px", height: "42px" }}>
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <div className="text-start">
                <p className="fw-bold mb-0 text-dark small">100% Certified</p>
                <p className="text-dark mb-0 fw-medium" style={{ fontSize: "0.75rem" }}>Expert Care Guaranteed</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;