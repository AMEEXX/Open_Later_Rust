import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL ||"http://localhost:4000" ;

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
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    console.log("Request config:", {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
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
    console.log(`Fetching capsule with public_id: "${public_id}"`);
    
    if (!public_id) {
      throw new Error("Public ID is required");
    }
    const cleanPublicId = public_id.trim();
    console.log(`Cleaned public_id: "${cleanPublicId}"`);
    
    const res = await apiClient.get(`/capsule/${cleanPublicId}`);
    console.log("Successfully fetched capsule:", res.data);
    return res.data;
  } catch (error) {
    console.error(`Error in getCapsuleByPublicId for ID "${public_id}":`, error);
    
    if (error.response?.status === 404) {
      error.message = `Capsule with ID "${public_id}" not found`;
    } else if (error.response?.status === 400) {
      error.message = `Bad request for capsule ID "${public_id}": ${error.response?.data?.message || 'Invalid request'}`;
    }
    
    throw error;
  }
};

export const createCapsule = async (data) => {
  try {
    console.log("Creating capsule with data:", { 
      ...data, 
      message: `${data.message?.substring(0, 50)}...` 
    });
    const res = await apiClient.post("/create", data);
    console.log("Successfully created capsule:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error in createCapsule:", error);
    throw error;
  }
};


export const testConnection = async () => {
  try {
    console.log("🔌 Testing API connection...");
    const res = await apiClient.get("/");
    console.log("API connection test successful:", res.status);
    return true;
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
};