/* eslint-disable react/prop-types */
import {createContext,useEffect,useReducer} from "react"
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { encode,} from 'js-base64';

// Initial state for the BusinessContext
const INITIAL_BUSINESS_STATE = {
  businessData: JSON.parse(localStorage.getItem("businessData")) || null,
  loading: false,
  error: null,
};

export const BusinessContext = createContext(INITIAL_BUSINESS_STATE);


// Reducer function for the BusinessContext
const BusinessReducer = (state, action) => {
  switch (action.type) {
    case "BUSINESS_DATA_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "BUSINESS_DATA_SUCCESS":
      return {
        businessData: action.payload,
        loading: false,
        error: null,
      };
    case "BUSINESS_DATA_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "BUSINESS_UPDATE_START":
          return {
            ...state,
            isFetching:true
          };
        case "BUSINESS_UPDATE_SUCCESS":
          return {
            businessData: action.payload,
            isFetching: false,
            error: false,
          };
        case "BUSINESS_UPDATE_FAILURE":
          return {
            businessData: state.businessData,
            isFetching: false,
            error: true,
        };
        case "RESET_BUSINESS_DATA":
          return {
            businessData:null,
            isFetching: false,
            error: false,
          };
    default:
      return state;
  }
};

const secretKey = 'DecryptBetterBiz';

// Encrypt data
const encryptData = (data) => {
  return AES.encrypt(JSON.stringify(data), secretKey).toString();
};


// Function to obfuscate and deobfuscate keys
const obfuscateKey = (key) => encode(key);


// Decrypt data
const decryptData = (ciphertext) => {
  const bytes = AES.decrypt(ciphertext, secretKey);
  try {
    const decryptedData = JSON.parse(bytes.toString(Utf8));
    return decryptedData;
  } catch (e) {
    console.error('Failed to decrypt', e);
    return null;
  }
};

// Obfuscated key for localStorage
const localStorageKey = obfuscateKey('businessData');



export const BusinessProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BusinessReducer, INITIAL_BUSINESS_STATE, () => {
    const encryptedData = localStorage.getItem(localStorageKey);
    if (encryptedData) {
        return {
            ...INITIAL_BUSINESS_STATE,
            businessData: decryptData(encryptedData),
        };
    }
    return INITIAL_BUSINESS_STATE;
});

useEffect(() => {
    if (state.businessData) {
        const encryptedData = encryptData(state.businessData);
        localStorage.setItem(localStorageKey, encryptedData);
    } else {
        localStorage.removeItem(localStorageKey);
    }
}, [state.businessData]);

  return (
    <BusinessContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BusinessContext.Provider>
  );
};