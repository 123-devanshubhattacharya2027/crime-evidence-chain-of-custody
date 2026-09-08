import api from "./api";

export const getForensicJobs = async () => {
  const res = await api.get("/forensics");
  return res.data;
};

export const getForensicJob = async (id) => {
  const res = await api.get(`/forensics/${id}`);
  return res.data;
};

export const createForensicJob = async (data) => {
  const res = await api.post("/forensics", data);
  return res.data;
};