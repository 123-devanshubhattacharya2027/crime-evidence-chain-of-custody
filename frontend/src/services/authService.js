import api from "./api";

const TOKEN_KEY = "crime_token";
const USER_KEY = "crime_user";

export async function login(data) {
  const response = await api.post("/auth/login", data);
  localStorage.setItem(TOKEN_KEY, response.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  return response.data;
}

export async function register(data) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}
