import heroImg from "../assets/hero.png";

function Hero() {
  return (
    <section className="container my-5">
      <div className="row align-items-center">

        <div className="col-md-6">
          <h1 className="fw-bold display-4">
            Book Appointment <br />
            With Trusted Doctors
          </h1>

          <p className="text-muted mt-3">
            SmileHub helps you book appointments with experienced doctors
            quickly and easily.
          </p>

          <button className="btn btn-primary btn-lg mt-3">
            Book Appointment
          </button>
        </div>

        <div className="col-md-6 text-center">
          <img
            src={heroImg}
            alt="Hero"
            className="img-fluid"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;