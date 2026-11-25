import api from "./api";

export async function getEvidence() {
  const response = await api.get("/evidence");
  return response.data;
}

export async function getEvidenceById(id) {
  const response = await api.get(`/evidence/${id}`);
  return response.data;
}

export async function uploadEvidence(formData) {
  const response = await api.post("/evidence/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}