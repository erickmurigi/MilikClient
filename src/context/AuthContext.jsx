/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from "react";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { encode } from 'js-base64';

// Function to obfuscate keys
const obfuscateKey = (key) => encode(key);

// Obfuscated key for localStorage
const localStorageKey = obfuscateKey('user');

const INITIAL_STATE = {
    user: null, // Initialize as null, let initializer handle decryption
    loading: false,
    error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                loading: true,
                error: null,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload, // Expecting { details, isAdmin, token }
                loading: false,
                error: null,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                loading: false,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                user: null,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

const secretKey = 'DecryptBetterBiz';

const encryptData = (data) => {
    return AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (ciphertext) => {
    const bytes = AES.decrypt(ciphertext, secretKey);
    const decryptedData = JSON.parse(bytes.toString(Utf8));
    return decryptedData;
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE, (initial) => {
        const encryptedData = localStorage.getItem(localStorageKey);
        if (encryptedData) {
            try {
                const decryptedUser = decryptData(encryptedData);
                return { ...initial, user: decryptedUser };
            } catch (error) {
                console.error('Failed to decrypt user data:', error);
                return initial;
            }
        }
        return initial;
    });

    useEffect(() => {
        if (state.user) {
            const encryptedUser = encryptData(state.user);
            localStorage.setItem(localStorageKey, encryptedUser);
        } else {
            localStorage.removeItem(localStorageKey);
        }
    }, [state.user]);

    return (
        <AuthContext.Provider value={{ user: state.user, loading: state.loading, error: state.error, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};