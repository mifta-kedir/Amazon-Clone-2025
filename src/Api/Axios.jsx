import axios from "axios";
//for Backend Communication
const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000", // for local host
  // baseURL: "http://127.0.0.1:5001/clone-11a1c/us-central1/api",// for local host with functions
  baseURL: "https://us-central1-clone-11a1c.cloudfunctions.net/api", // for cloud functions
});

export { axiosInstance };
