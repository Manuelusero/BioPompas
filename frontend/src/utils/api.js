// Helper function to get API base URL
export const getApiUrl = () => {

    const envUrl = import.meta.env.VITE_APP_API_URL;
    if (envUrl) return envUrl;

    // Always use production URL when deployed, localhost when developing
    if (typeof window !== 'undefined') {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5001/api';
        } else {
            return 'https://biopompas.onrender.com/api';
        }
    }

    // Server-side fallback
    return 'https://biopompas.onrender.com/api';
};

// Helper function to get the correct image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Get base URL based on current environment
    let baseUrl = import.meta.env.VITE_APP_API_URL?.replace('/api', '') || 'https://biopompas.onrender.com';

    if (typeof window !== 'undefined') {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            baseUrl = 'http://localhost:5001';
        } else {
            baseUrl = 'https://biopompas.onrender.com';
        }
    } else {
        baseUrl = 'https://biopompas.onrender.com';
    }

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