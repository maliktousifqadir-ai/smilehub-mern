import { Link } from "react-router-dom";

function About() {
  return (
    <div className="container py-4">
      {/* Hero Header */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-bold mb-2">
          🏥 About SmileHub
        </span>
        <h1 className="fw-extrabold text-dark display-6 mb-3">
          Empowering Healthier Communities Through Seamless Care
        </h1>
        <p className="text-muted lead fs-6 mx-auto" style={{ maxWidth: "750px" }}>
          SmileHub connects patients with certified medical specialists in real-time. We simplify healthcare access through instant appointment booking, digital records, and verified doctors.
        </p>
      </div>

      {/* Stats Counter Bar */}
      <div
        className="card shadow-sm border-0 rounded-4 p-4 p-md-5 mb-5"
        style={{ background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)" }}
      >
        <div className="row text-center text-white g-4">
          <div className="col-6 col-md-3">
            <h2 className="display-5 fw-extrabold mb-1">100+</h2>
            <p className="mb-0 text-white-50 small fw-semibold">Verified Doctors</p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="display-5 fw-extrabold mb-1">50k+</h2>
            <p className="mb-0 text-white-50 small fw-semibold">Happy Patients</p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="display-5 fw-extrabold mb-1">99.4%</h2>
            <p className="mb-0 text-white-50 small fw-semibold">Satisfaction Rate</p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="display-5 fw-extrabold mb-1">15+</h2>
            <p className="mb-0 text-white-50 small fw-semibold">Specialties Covered</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="row g-4 mb-5 align-items-center">
        <div className="col-lg-6">
          <div className="pe-lg-4">
            <span className="text-primary fw-bold text-uppercase small">Our Core Mission</span>
            <h2 className="fw-extrabold text-dark mt-2 mb-4">
              Transforming Healthcare Access with Technology
            </h2>
            <p className="text-secondary mb-3">
              We believe quality healthcare should be accessible to everyone without tedious waiting lines or complex scheduling. SmileHub bridges the gap between top medical specialists and patients seeking trustworthy care.
            </p>
            <p className="text-secondary mb-4">
              From booking your consultation to receiving automated real-time status alerts and follow-ups, our patient-centric platform ensures transparent, dependable healthcare delivery.
            </p>
            <div className="d-flex gap-3">
              <Link to="/doctors" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold text-white shadow-sm">
                Meet Our Doctors
              </Link>
              <Link to="/contact" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="row g-3">
            <div className="col-sm-6">
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 mb-3"
                  style={{ width: "48px", height: "48px" }}
                >
                  <i className="bi bi-shield-check fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">100% Verified</h5>
                <p className="text-muted small mb-0">Every practitioner is authenticated and certified by medical boards.</p>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
                <div
                  className="d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-3 mb-3"
                  style={{ width: "48px", height: "48px" }}
                >
                  <i className="bi bi-clock-history fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Instant Booking</h5>
                <p className="text-muted small mb-0">Choose your preferred day and time slot with immediate email confirmations.</p>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
                <div
                  className="d-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis rounded-3 mb-3"
                  style={{ width: "48px", height: "48px" }}
                >
                  <i className="bi bi-bell-fill fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Email Notifications</h5>
                <p className="text-muted small mb-0">Automated email alerts for pending, confirmed, completed, and rescheduled visits.</p>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
                <div
                  className="d-flex align-items-center justify-content-center bg-info-subtle text-info rounded-3 mb-3"
                  style={{ width: "48px", height: "48px" }}
                >
                  <i className="bi bi-heart-pulse-fill fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Holistic Care</h5>
                <p className="text-muted small mb-0">Full spectrum of medical specialties from Dermatology to Neurology.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
