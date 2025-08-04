import axios from "axios";

const API_BASE = "http://localhost:4000"; // change to your backend

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
  const res = await axios.get(`${API_BASE}/capsule/${public_id}`);
  return res.data;
};

export const createCapsule = async (data) => {
  const res = await axios.post(`${API_BASE}/create`, data);
  return res.data;
};