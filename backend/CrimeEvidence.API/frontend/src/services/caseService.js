import api from "./api";

// Get all cases
export async function getCases() {
  const response = await api.get("/Cases");
  return response.data;
}

// Get a single case by ID
export async function getCase(id) {
  const response = await api.get(`/Cases/${id}`);
  return response.data;
}

// Search cases
export async function searchCases(query) {
  const response = await api.get(`/Cases/search?query=${encodeURIComponent(query)}`);
  return response.data;
}

// Create a new case
export async function createCase(caseData) {
  const response = await api.post("/Cases", caseData);
  return response.data;
}

// Update a case
export async function updateCase(id, caseData) {
  const response = await api.put(`/Cases/${id}`, caseData);
  return response.data;
}

// Delete a case
export async function deleteCase(id) {
  const response = await api.delete(`/Cases/${id}`);
  return response.data;
}