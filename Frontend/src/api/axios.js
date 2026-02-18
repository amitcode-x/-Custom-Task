import axios from "axios";

const api = axios.create({
  baseURL: "https://custom-task.onrender.com/api/",
});

export default api;
