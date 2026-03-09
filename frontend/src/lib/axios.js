import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api/3000", // this sets the base URL for all API requests, allowing you to easily switch between development and production environments by changing the environment variable.
    withCredentials: true, // this ensures cookies are sent with requests for authentication that means the client will send cookies (like session tokens) along with requests to the server, allowing the server to identify and authenticate the user making the request.
})

export default api; 