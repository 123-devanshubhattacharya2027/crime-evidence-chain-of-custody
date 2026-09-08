import api from "./api";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};
