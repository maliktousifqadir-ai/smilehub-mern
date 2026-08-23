import axios from "axios";

const api = axios.create({
  baseURL: "https://smilehub-backend.onrender.com/api"
});

export default api;