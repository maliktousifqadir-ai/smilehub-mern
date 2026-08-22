function SpecialtyMenu() {
  const specialties = [
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <section className="container my-5">
      <h2 className="text-center fw-bold">
        Find by Speciality
      </h2>

      <p className="text-center text-muted mb-4">
        Browse doctors by speciality.
      </p>

      <div className="row">
        {specialties.map((item, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <div className="card shadow-sm p-3 text-center">
              <h5>{item}</h5>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SpecialtyMenu;