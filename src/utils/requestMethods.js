import axios from "axios";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { encode } from 'js-base64';

//const BASE_URL = "https://biznafitty-api-9h5p.onrender.com/api/";
const BASE_URL = "http://localhost:8800/api/"; 
//const BASE_URL = "https://www.biznafittyapi.top/api/";

// Function to obfuscate keys
const obfuscateKey = (key) => encode(key);

// Obfuscated key for localStorage
const localStorageKey = obfuscateKey('user');

export const adminRequests = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach token to every request
adminRequests.interceptors.request.use(
    (config) => {
        const directToken = localStorage.getItem('milik_token');
        if (directToken) {
            config.headers['Authorization'] = `Bearer ${directToken}`;
            return config;
        }

        const encryptedUser = localStorage.getItem(localStorageKey);
        if (encryptedUser) {
            try {
                const decryptedUser = AES.decrypt(encryptedUser, 'DecryptBetterBiz').toString(Utf8);
                const user = JSON.parse(decryptedUser);
                if (user.token) {
                    config.headers['Authorization'] = `Bearer ${user.token}`;
                } else {
                    console.warn("No token found in decrypted user:", user);
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