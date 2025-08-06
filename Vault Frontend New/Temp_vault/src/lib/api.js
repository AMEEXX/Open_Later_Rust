import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://open-later-rust-backend.onrender.com";

console.log("API Base URL:", API_BASE);

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000, 
});
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 404) {
      error.message = "Resource not found";
    } else if (error.response?.status === 500) {
      error.message = "Server error occurred";
    } else if (error.code === 'ECONNABORTED') {
      error.message = "Request timeout - server might be sleeping";
    } else if (!error.response) {
      error.message = "Network error - please check your connection";
    }
    
    return Promise.reject(error);
  }
);

export const getAllCapsules = async () => {
  try {
    console.log("Fetching all capsules...");
    const res = await apiClient.get("/capsules");
    console.log("Successfully fetched capsules:", res.data?.length || 0, "items");
    return res.data;
  } catch (error) {
    console.error("Error in getAllCapsules:", error);
    throw error;
  }
};

export const getCapsuleByPublicId = async (public_id) => {
  try {
    console.log(`Fetching capsule with public_id: ${public_id}`);
    
    if (!public_id) {
      throw new Error("Public ID is required");
    }
    
    const res = await apiClient.get(`/capsule/${public_id}`);
    console.log("Successfully fetched capsule:", res.data);
    return res.data;
  } catch (error) {
    console.error(`Error in getCapsuleByPublicId for ID ${public_id}:`, error);
    if (error.response?.status === 404) {
      error.message = `Capsule with ID "${public_id}" not found`;
    }
    
    throw error;
  }
};

export const createCapsule = async (data) => {
  try {
    console.log("Creating capsule with data:", { ...data, message: `${data.message?.substring(0, 50)}...` });
    const res = await apiClient.post("/create", data);
    console.log("Successfully created capsule:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error in createCapsule:", error);
    throw error;
  }
};