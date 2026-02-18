import {configureStore,combineReducers} from "@reduxjs/toolkit"
import userReducer from "./userRedux"
import {persistStore,persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER, createTransform,} from "redux-persist";
import storage from "redux-persist/lib/storage";

import companiesRedux from "./companiesRedux";
import printerRedux from "./printerRedux";
import requestRedux from "./requestServiceRedux";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';


//property reducers
import landlordReducer from "./landlordRedux"
import propertyReducer from "./propertyRedux"
import utilityReducer from "./utilityRedux"
import unitReducer from "./unitRedux"
import tenantReducer from "./tenantsRedux"
import rentPaymentReducer from "./rentPaymentRedux"
import maintenanceReducer from "./maintenanceRedux"
import leaseReducer from "./leasesRedux"
import expensePropertyReducer from "./expensePropertyRedux"
import notificationPropertyReducer from "./notificationPropertyRedux"

const secretKey = 'DecryptBetterBiz'; 

// Encrypt any data
const encrypt = (inboundState) => {
    return AES.encrypt(JSON.stringify(inboundState), secretKey).toString();
  };
  
  // Decrypt data
  const decrypt = (outboundState) => {
    const bytes = AES.decrypt(outboundState, secretKey);
    const decryptedData = JSON.parse(bytes.toString(Utf8));
    return decryptedData;
  };

  // Create a transform to encrypt and decrypt your redux state
const Encryptor = createTransform(
    // Encrypt the entire state
    (inboundState) => encrypt(inboundState),
    // Decrypt the entire state
    (outboundState) => decrypt(outboundState),
  );

const peristConfig = {key:"root",version:1,storage, transforms: [Encryptor],}


const rootReducer = combineReducers({
  company: companiesRedux,
  user: userReducer,
  printer: printerRedux,
  request: requestRedux,
  
  //property reducers
  landlord: landlordReducer,
  property: propertyReducer,
  utility: utilityReducer,
  unit: unitReducer,
  tenant: tenantReducer,
  rentPayment: rentPaymentReducer,
  maintenance: maintenanceReducer,
  lease: leaseReducer,
  expenseProperty: expensePropertyReducer,
  notification: notificationPropertyReducer,


  
});
const persistedReducer = persistReducer(peristConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: false, // Disable the immutable check
    }),
});

export let persistor = persistStore(store);
