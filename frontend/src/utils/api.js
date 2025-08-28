// API URLs helper
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
export const API_IMAGE_BASE_URL = import.meta.env.VITE_APP_API_URL.replace('/api', '');

// Helper functions
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Helper function to get the correct image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Get base URL from environment variable
    const baseUrl = import.meta.env.VITE_APP_API_URL?.replace('/api', '') || 'https://biopompas.onrender.com';

    // Ensure the image path starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${baseUrl}${cleanPath}`;
};

// Helper function to handle API errors
export const handleApiError = (error, fallback = null) => {
    console.error('API Error:', error);

    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        console.error('Response was not valid JSON');
    }

    return fallback;
};