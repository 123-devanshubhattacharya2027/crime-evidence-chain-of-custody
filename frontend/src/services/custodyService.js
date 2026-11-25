
import api from "./api";

// Get complete custody timeline for an evidence record
export async function getCustodyTimeline(evidenceId) {
  const response = await api.get(
    `/ChainOfCustody/evidence/${evidenceId}`
  );

  return response.data;
}

// Get an individual custody record
export async function getCustodyById(id) {
  const response = await api.get(
    `/ChainOfCustody/${id}`
  );

  return response.data;
}

// Create a new evidence transfer
export async function createCustody(data) {
  const response = await api.post(
    "/ChainOfCustody",
    data
  );

  return response.data;
}
