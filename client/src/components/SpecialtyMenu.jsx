import { Link } from "react-router-dom";

function SpecialtyMenu() {
  const specialties = [
    {
      name: "General Physician",
      icon: "bi-heart-pulse",
      color: "#0284c7",
      bg: "#e0f2fe",
      desc: "Common health issues, checkups & preventative care",
    },
    {
      name: "Gynecologist",
      icon: "bi-gender-female",
      color: "#db2777",
      bg: "#fce7f3",
      desc: "Women's reproductive health & prenatal care",
    },
    {
      name: "Dermatologist",
      icon: "bi-stars",
      color: "#7c3aed",
      bg: "#ede9fe",
      desc: "Skin treatments, acne care, and cosmetic wellness",
    },
    {
      name: "Pediatrician",
      icon: "bi-emoji-smile",
      color: "#d97706",
      bg: "#fef3c7",
      desc: "Comprehensive child healthcare & immunizations",
    },
    {
      name: "Neurologist",
      icon: "bi-activity",
      color: "#0891b2",
      bg: "#cffafe",
      desc: "Brain, nerves, and spinal health consultations",
    },
    {
      name: "Gastroenterologist",
      icon: "bi-capsule-pill",
      color: "#059669",
      bg: "#d1fae5",
      desc: "Digestive system, liver, and stomach health",
    },
  ];

  return (
    <section id="specialties" className="my-5 py-4">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="section-badge">
          <i className="bi bi-grid-3x3-gap-fill"></i>
          <span>Medical Specialties</span>
        </div>
        <h2 className="display-6 fw-bold mb-2">Find Doctors by Specialty</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "550px" }}>
          Choose a medical department to discover verified specialists available for immediate consultations.
        </p>
      </div>

      {/* Grid of Specialties */}
      <div className="row g-4">
        {specialties.map((item, index) => (
          <div className="col-lg-4 col-md-6" key={index}>
            <Link
              to="/doctors"
              className="specialty-card text-decoration-none"
            >
              <div
                className="specialty-icon-box shadow-sm"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <i className={`bi ${item.icon}`}></i>
              </div>
              <h5 className="fw-bold mb-1 text-dark">{item.name}</h5>
              <p className="text-muted small mb-2 text-center" style={{ fontSize: "0.85rem" }}>
                {item.desc}
              </p>
              <span className="text-primary fw-semibold small d-inline-flex align-items-center gap-1 mt-auto">
                Explore Specialists <i className="bi bi-arrow-right"></i>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SpecialtyMenu;