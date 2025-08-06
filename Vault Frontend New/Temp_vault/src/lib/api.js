import axios from "axios";


const API_BASE = "https://open-later-rust-backend.onrender.com";


export const getAllCapsules = async () => {
  const res = await axios.get(`${API_BASE}/capsules`, {
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
  });
  return res.data;
};

export const getCapsuleByPublicId = async (public_id) => {
  const res = await axios.get(`${API_BASE}/capsule/${public_id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const createCapsule = async (data) => {
  const res = await axios.post(`${API_BASE}/create`, data, {
    withCredentials: true,
  });
  return res.data;
};
