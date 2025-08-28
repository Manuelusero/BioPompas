// API URLs helper
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
export const API_IMAGE_BASE_URL = import.meta.env.VITE_APP_API_URL.replace('/api', '');

// Helper functions
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
export const getImageUrl = (imagePath) => `${API_IMAGE_BASE_URL}${imagePath}`;