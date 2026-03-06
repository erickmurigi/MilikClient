import axios from "axios";
import { clearClientSessionStorage } from './sessionCleanup';

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'MilikPropertyManagement2026';

// Use environment variable for API URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8800/api/";

/**
 * Centralized Axios client for MILIK API requests
 * Automatically attaches JWT token from localStorage (Redux persisted auth)
 */
export const adminRequests = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor - attach auth token from Redux persisted state
adminRequests.interceptors.request.use(
    (config) => {
        // Get token from localStorage (synced by Redux auth on login/logout)
        const token = localStorage.getItem('milik_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            return config;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle common errors
adminRequests.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            switch (error.response.status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    if (error.config?.url && !error.config.url.includes('/auth/login')) {
                        clearClientSessionStorage();
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    console.error('Access forbidden:', error.response.data.message);
                    break;
                case 404:
                    console.error('Resource not found:', error.response.data.message);
                    break;
                case 500:
                    console.error('Server error:', error.response.data.message);
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error - no response received');
        } else {
            // Something else happened
            console.error('Request error:', error.message);
        }
        
        return Promise.reject(error);
    }
);