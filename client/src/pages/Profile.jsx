import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";

function Profile() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // Fetch Profile
  // =========================
  const fetchProfile = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      if (!userInfo) {
        toast.error("Please login first");
        return;
      }

      const res = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setUser(res.data);

      setName(res.data.name || "");
      setPhone(res.data.phone || "");
      setAddress(res.data.address || "");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Update Profile
  // =========================
  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      if (!userInfo) {
        toast.error("Please login first");
        return;
      }

      const res = await api.put(
        "/users/profile",
        {
          name,
          phone,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setUser(res.data.user);

      // Update localStorage user information
      const updatedUserInfo = {
        ...userInfo,
        name: res.data.user.name,
        email: res.data.user.email,
      };

      localStorage.setItem(
        "userInfo",
        JSON.stringify(updatedUserInfo)
      );

      toast.success(res.data.message);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading Profile...</h3>
      </div>
    );
  }

  // =========================
  // Profile Page
  // =========================
  return (
    <div className="container my-5">

      <div
        className="card shadow mx-auto p-4"
        style={{ maxWidth: "650px" }}
      >

        <h2 className="text-center mb-4">
          👤 My Profile
        </h2>

        {/* Account Information */}
        <div className="mb-4">

          <h5 className="text-primary mb-3">
            Account Information
          </h5>

          <p>
            <strong>Email:</strong>{" "}
            {user?.email}
          </p>

          <p>
            <strong>User ID:</strong>{" "}
            {user?._id}
          </p>

          <p>
            <strong>Account Status:</strong>{" "}
            <span className="badge bg-success">
              Active
            </span>
          </p>

        </div>

        <hr />

        {/* Edit Profile */}
        <h5 className="text-primary mb-3">
          Edit Profile
        </h5>

        <form onSubmit={updateProfile}>

          {/* Name */}
          <div className="mb-3">

            <label className="form-label">
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              required
            />

          </div>

          {/* Phone */}
          <div className="mb-3">

            <label className="form-label">
              Phone Number
            </label>

            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter your phone number"
            />

          </div>

          {/* Address */}
          <div className="mb-4">

            <label className="form-label">
              Address
            </label>

            <textarea
              className="form-control"
              rows="3"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Enter your address"
            ></textarea>

          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={updating}
          >
            {updating
              ? "Updating Profile..."
              : "Update Profile"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;