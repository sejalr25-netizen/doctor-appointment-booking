
const API_URL = "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const getDoctors = () =>
  request("/doctors");

export const getDoctorById = (id) =>
  request(`/doctors/${id}`);

export const getAppointments = () =>
  request("/appointments");

export const getAppointmentById = (id) =>
  request(`/appointments/${id}`);

export const createAppointment = (data) =>
  request("/appointments", {
    method: "POST",
    body: JSON.stringify(data)
  });

export const updateAppointment = (id, data) =>
  request(`/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });

export const getBlockedSlots = () =>
  request("/blockedSlots");

export const createBlockedSlot = (data) =>
  request("/blockedSlots", {
    method: "POST",
    body: JSON.stringify(data)
  });

export const deleteBlockedSlot = (id) =>
  request(`/blockedSlots/${id}`, {
    method: "DELETE"
  });
