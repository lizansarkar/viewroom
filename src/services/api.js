// Unified API service layer connecting React frontend to Express backend (http://localhost:5000/api/v1)
// Includes graceful fallback mode for offline/standalone execution.

const API_BASE_URL = "http://localhost:5000/api/v1";

const fetchWithTimeout = async (url, options = {}, timeoutMs = 3000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

// Auth API
export const apiRegister = async (userData) => {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (err) {
    console.warn("API server unreachable, using client auth simulation:", err.message);
    return {
      success: true,
      message: "Registration successful (Client Mode)",
      user: { id: `usr_${Date.now()}`, email: userData.email, name: userData.name || userData.email.split("@")[0] },
      token: "mock_jwt_token_client_mode",
    };
  }
};

export const apiLogin = async (credentials) => {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  } catch (err) {
    console.warn("API server unreachable, using client auth simulation:", err.message);
    return {
      success: true,
      message: "Login successful (Client Mode)",
      user: { id: `usr_${Date.now()}`, email: credentials.email, name: credentials.email.split("@")[0] },
      token: "mock_jwt_token_client_mode",
    };
  }
};

// Virtual Tours API
export const apiGetTours = async () => {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/tours`);
    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Failed to fetch tours");
  } catch (err) {
    console.warn("Using offline tour dataset:", err.message);
    return null; // Signals component to use local dataset
  }
};

export const apiGetTourById = async (tourId) => {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/tours/${tourId}`);
    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Failed to fetch tour");
  } catch (err) {
    console.warn("Using offline tour detail dataset:", err.message);
    return null;
  }
};

// Product 360 API
export const apiGetProducts = async () => {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/products`);
    const data = await res.json();
    if (data.success) return data.data;
    throw new Error("Failed to fetch 360 products");
  } catch (err) {
    console.warn("Using offline 360 product dataset:", err.message);
    return null;
  }
};

// Spatial AI Concierge API
export const apiAskSpatialConcierge = async (prompt, sceneContext) => {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/ai/spatial-concierge`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, sceneContext }),
      },
      6000
    );
    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.warn("Spatial AI API fallback triggered:", err.message);
    return "I am the ViewRoom 360° AI Concierge. You can ask me about room dimensions, floor navigation, hotspot interactivity, or custom 3D product configurations!";
  }
};
