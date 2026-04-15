const API_BASE = "http://localhost:8080";

export const apiClient = async (url, options = {}) => {

  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  if(response.status == 401){
    console.log("might be session expired");
    window.dispatchEvent(new Event("unauthorized"));
  }

  let data = null;

  const contentType = response.headers.get("content-type");

  //to prevent errors in NO_CONTENT api responses
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};