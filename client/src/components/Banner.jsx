import { Link } from "react-router-dom";

function Banner() {
  return (
    <section className="my-5 py-4">
      <div
        className="rounded-4 p-5 text-white text-center position-relative overflow-hidden shadow-lg"
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)",
        }}
      >
        {/* Background Decorative Rings */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 opacity-25 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 15% 25%, #ffffff 0%, transparent 40%), radial-gradient(circle at 85% 75%, #ffffff 0%, transparent 40%)",
          }}
        ></div>

        <div className="position-relative" style={{ zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          
          <span className="badge bg-white text-primary px-3 py-2 rounded-pill fw-bold text-uppercase mb-3 shadow-sm" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
            <i className="bi bi-clock-history me-1"></i> Quick & Hassle Free
          </span>

          <h2 className="display-6 fw-extrabold text-white mb-3" style={{ fontWeight: 800 }}>
            Ready to Prioritize Your Health?
          </h2>

          <p className="lead text-white-50 mb-4" style={{ fontSize: "1.1rem" }}>
            Book instant appointments with certified medical doctors, manage your prescriptions, and experience healthcare without long waiting lines.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link
              to="/doctors"
              className="btn btn-light btn-lg px-4 py-3 rounded-pill fw-bold text-primary shadow"
            >
              <i className="bi bi-calendar2-check me-2"></i> Book Appointment Now
            </Link>
            <Link
              to="/register"
              className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-semibold"
            >
              Create Free Account
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Banner;