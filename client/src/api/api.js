import axios from "axios";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const baseURL =
  import.meta.env.VITE_API_URL ||
  (isLocalhost
    ? "http://localhost:5000/api"
    : "https://smilehub-backend.onrender.com/api");

const api = axios.create({
  baseURL,
});

export default api;