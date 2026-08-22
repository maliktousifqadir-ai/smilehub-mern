import { Link } from "react-router-dom";

function Banner() {
  return (
    <section className="container my-5">
      <div className="bg-primary text-white rounded p-5 text-center">

        <h2 className="fw-bold">
          Book Appointment <br />
          With 100+ Trusted Doctors
        </h2>

        <p className="mt-3">
          Find the best doctors and book your appointment online in just a few clicks.
        </p>

        <Link to="/doctors" className="btn btn-light mt-3">
          View Doctors
        </Link>

      </div>
    </section>
  );
}

export default Banner;