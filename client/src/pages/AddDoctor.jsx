import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";

function AddDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    photo: "",
    availableDays: "",
    availableSlots: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      if (!userInfo || !userInfo.token) {
        toast.error("Please login as admin first");
        return;
      }

      const doctorData = {
        ...formData,
        experience: Number(formData.experience),

        availableDays: formData.availableDays
          .split(",")
          .map((day) => day.trim())
          .filter((day) => day !== ""),

        availableSlots: formData.availableSlots
          .split(",")
          .map((slot) => slot.trim())
          .filter((slot) => slot !== ""),
      };

      const res = await api.post(
        "/doctors",
        doctorData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success(res.data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        qualification: "",
        experience: "",
        photo: "",
        availableDays: "",
        availableSlots: "",
      });

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add doctor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">

      <div
        className="card shadow border-0 mx-auto p-4"
        style={{ maxWidth: "700px" }}
      >

        <h2 className="text-center mb-4">
          👨‍⚕️ Add New Doctor
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label">
              Doctor Name
            </label>

            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter doctor name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter doctor email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="form-label">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Specialization */}
          <div className="mb-3">
            <label className="form-label">
              Specialization
            </label>

            <input
              type="text"
              name="specialization"
              className="form-control"
              placeholder="e.g. Dentist, Orthodontist"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>

          {/* Qualification */}
          <div className="mb-3">
            <label className="form-label">
              Qualification
            </label>

            <input
              type="text"
              name="qualification"
              className="form-control"
              placeholder="e.g. BDS, FCPS"
              value={formData.qualification}
              onChange={handleChange}
              required
            />
          </div>

          {/* Experience */}
          <div className="mb-3">
            <label className="form-label">
              Experience (Years)
            </label>

            <input
              type="number"
              name="experience"
              className="form-control"
              placeholder="Enter experience"
              min="0"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>

          {/* Photo */}
          <div className="mb-3">
            <label className="form-label">
              Photo URL
            </label>

            <input
              type="url"
              name="photo"
              className="form-control"
              placeholder="Enter doctor photo URL"
              value={formData.photo}
              onChange={handleChange}
            />
          </div>

          {/* Available Days */}
          <div className="mb-3">
            <label className="form-label">
              Available Days
            </label>

            <input
              type="text"
              name="availableDays"
              className="form-control"
              placeholder="Monday, Wednesday, Friday"
              value={formData.availableDays}
              onChange={handleChange}
              required
            />

            <small className="text-muted">
              Separate days with commas.
            </small>
          </div>

          {/* Available Slots */}
          <div className="mb-4">
            <label className="form-label">
              Available Slots
            </label>

            <input
              type="text"
              name="availableSlots"
              className="form-control"
              placeholder="10:00 AM, 12:00 PM, 04:00 PM"
              value={formData.availableSlots}
              onChange={handleChange}
              required
            />

            <small className="text-muted">
              Separate slots with commas.
            </small>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? "Adding Doctor..."
              : "Add Doctor"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddDoctor;