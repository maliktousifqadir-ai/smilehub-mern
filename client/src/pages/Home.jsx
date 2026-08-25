import Hero from "../components/Hero";
import SpecialtyMenu from "../components/SpecialtyMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

function Home() {
  const features = [
    {
      icon: "bi-patch-check-fill",
      title: "100% Certified Doctors",
      description: "Every doctor on SmileHub is strictly vetted and credential-verified for exceptional medical care.",
    },
    {
      icon: "bi-calendar-check-fill",
      title: "Instant Online Booking",
      description: "Select convenient time slots and book appointments in seconds without waiting in long clinic queues.",
    },
    {
      icon: "bi-shield-fill-plus",
      title: "Secure Health Records",
      description: "Your appointments, medical histories, and personal information are encrypted and protected.",
    },
    {
      icon: "bi-headset",
      title: "24/7 Patient Support",
      description: "Our dedicated support team is available around the clock to assist you with any health queries.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Why Choose SmileHub Section */}
      <section className="my-5 py-4">
        <div className="text-center mb-5">
          <div className="section-badge">
            <i className="bi bi-stars"></i>
            <span>Why SmileHub</span>
          </div>
          <h2 className="display-6 fw-bold mb-2">Healthcare Made Simple & Reliable</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "550px" }}>
            Experience modern medical care tailored to your schedule and comfort.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, idx) => (
            <div className="col-lg-3 col-md-6" key={idx}>
              <div className="feature-box d-flex flex-column h-100">
                <div className="feature-icon">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h5 className="fw-bold mb-2 text-dark">{feature.title}</h5>
                <p className="text-muted small mb-0">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Medical Specialties */}
      <SpecialtyMenu />

      {/* Top Doctors */}
      <TopDoctors />

      {/* Call to Action Banner */}
      <Banner />
    </>
  );
}

export default Home;