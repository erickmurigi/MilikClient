import axios from "axios";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { encode } from 'js-base64';
import { clearClientSessionStorage } from './sessionCleanup';
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || 'MilikPropertyManagement2026';


// Use environment variable for API URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8800/api/";

// Function to obfuscate keys
const obfuscateKey = (key) => encode(key);

// Obfuscated key for localStorage
const localStorageKey = obfuscateKey('user');
const tokenKey = 'milik_token';

/**
 * Centralized Axios client for MILIK API requests
 * Automatically attaches JWT token from localStorage
 */
export const adminRequests = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor - attach auth token
adminRequests.interceptors.request.use(
    (config) => {
        // Try direct token first
        const directToken = localStorage.getItem(tokenKey);
        if (directToken) {
            config.headers['Authorization'] = `Bearer ${directToken}`;
            return config;
        }

        // Fallback to encrypted user storage
        const encryptedUser = localStorage.getItem(localStorageKey);
        if (encryptedUser) {
            try {
                const decryptedUser = AES.decrypt(encryptedUser, STORAGE_KEY).toString(Utf8);
                const user = JSON.parse(decryptedUser);
                if (user?.token) {
                    config.headers['Authorization'] = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error('Failed to decrypt user for request:', error);
            }
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
                    // Unauthorized
                    // Don't redirect if it's a login attempt - let the page handle it
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