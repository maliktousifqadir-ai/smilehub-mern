import { useState } from "react";
import { toast } from "react-toastify";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    setTimeout(() => {
      setSending(false);
      toast.success("Thank you! Your message has been sent. Our team will contact you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-bold mb-2">
          📞 24/7 Support & Inquiries
        </span>
        <h1 className="fw-extrabold text-dark display-6 mb-3">
          Get in Touch With SmileHub
        </h1>
        <p className="text-muted lead fs-6 mx-auto" style={{ maxWidth: "600px" }}>
          Have questions regarding an appointment, our specialist network, or need technical assistance? We're here to help.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {/* Left Column: Contact Cards */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-3">
            {/* Address */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 flex-shrink-0"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="bi bi-geo-alt fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Our Clinic Headquarters</h6>
                  <p className="text-muted small mb-0">100 Health Ave, Medical District, Islamabad, Pakistan</p>
                </div>
              </div>
            </div>

            {/* Helpline */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-3 flex-shrink-0"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="bi bi-telephone fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Phone & Emergency Care</h6>
                  <p className="text-muted small mb-0">+92 (300) 123-4567 / +92 (51) 987-6543</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis rounded-3 flex-shrink-0"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="bi bi-envelope fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Email Support</h6>
                  <p className="text-muted small mb-0">support@smilehub.com / appointments@smilehub.com</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-info-subtle text-info rounded-3 flex-shrink-0"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="bi bi-clock fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Working Hours</h6>
                  <p className="text-muted small mb-0">Monday - Saturday: 8:00 AM - 9:00 PM (Sunday: Urgent Only)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
            <h4 className="fw-bold text-dark mb-1">Send Us a Message</h4>
            <p className="text-muted small mb-4">Fill out the form below and our medical coordinators will respond within 24 hours.</p>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Your Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg fs-6"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Your Email</label>
                  <input
                    type="email"
                    className="form-control form-control-lg fs-6"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Subject</label>
                  <input
                    type="text"
                    className="form-control form-control-lg fs-6"
                    placeholder="e.g. Appointment Assistance or Doctor Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Message</label>
                  <textarea
                    className="form-control fs-6"
                    rows="4"
                    placeholder="Describe your inquiry or feedback..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg rounded-pill py-3 fw-bold text-white shadow-sm"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i> Submit Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
