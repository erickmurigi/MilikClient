/* eslint-disable no-undef */
import {adminRequests} from "../utils/requestMethods"

//employees actions
import {createEmployeeFailure, createEmployeeStart, createEmployeeSuccess,
       deleteEmployeeFailure,deleteEmployeeStart,deleteEmployeeSuccess,
       getEmployeesFailure, getEmployeesStart, getEmployeesSuccess, 
       updateEmployeeFailure, updateEmployeeStart, updateEmployeeSuccess} from "./employeesRedux"




import {
  getLandlordsStart,
  getLandlordsSuccess,
  getLandlordsFailure,
  createLandlordStart,
  createLandlordSuccess,
  createLandlordFailure,
  updateLandlordStart,
  updateLandlordSuccess,
  updateLandlordFailure,
  deleteLandlordStart,
  deleteLandlordSuccess,
  deleteLandlordFailure
} from "../redux/landlordRedux";



import {
  getUtilitiesStart,
  getUtilitiesSuccess,
  getUtilitiesFailure,
  createUtilityStart,
  createUtilitySuccess,
  createUtilityFailure,
  updateUtilityStart,
  updateUtilitySuccess,
  updateUtilityFailure,
  deleteUtilityStart,
  deleteUtilitySuccess,
  deleteUtilityFailure
} from "../redux/utilityRedux";

import {
  getUnitsStart,
  getUnitsSuccess,
  getUnitsFailure,
  createUnitStart,
  createUnitSuccess,
  createUnitFailure,
  updateUnitStart,
  updateUnitSuccess,
  updateUnitFailure,
  deleteUnitStart,
  deleteUnitSuccess,
  deleteUnitFailure,
  updateUnitStatusStart,
  updateUnitStatusSuccess,
  updateUnitStatusFailure
} from "../redux/unitRedux";

import {
  getTenantsStart,
  getTenantsSuccess,
  getTenantsFailure,
  createTenantStart,
  createTenantSuccess,
  createTenantFailure,
  updateTenantStart,
  updateTenantSuccess,
  updateTenantFailure,
  deleteTenantStart,
  deleteTenantSuccess,
  deleteTenantFailure,
  updateTenantStatusStart,
  updateTenantStatusSuccess,
  updateTenantStatusFailure
} from "../redux/tenantsRedux";

import {
  getRentPaymentsStart,
  getRentPaymentsSuccess,
  getRentPaymentsFailure,
  createRentPaymentStart,
  createRentPaymentSuccess,
  createRentPaymentFailure,
  updateRentPaymentStart,
  updateRentPaymentSuccess,
  updateRentPaymentFailure,
  deleteRentPaymentStart,
  deleteRentPaymentSuccess,
  deleteRentPaymentFailure,
  confirmRentPaymentStart,
  confirmRentPaymentSuccess,
  confirmRentPaymentFailure
} from "../redux/rentPaymentRedux";

import {
  getMaintenancesStart,
  getMaintenancesSuccess,
  getMaintenancesFailure,
  createMaintenanceStart,
  createMaintenanceSuccess,
  createMaintenanceFailure,
  updateMaintenanceStart,
  updateMaintenanceSuccess,
  updateMaintenanceFailure,
  deleteMaintenanceStart,
  deleteMaintenanceSuccess,
  deleteMaintenanceFailure,
  updateMaintenanceStatusStart,
  updateMaintenanceStatusSuccess,
  updateMaintenanceStatusFailure
} from "../redux/maintenanceRedux";

import {
  getLeasesStart,
  getLeasesSuccess,
  getLeasesFailure,
  createLeaseStart,
  createLeaseSuccess,
  createLeaseFailure,
  updateLeaseStart,
  updateLeaseSuccess,
  updateLeaseFailure,
  deleteLeaseStart,
  deleteLeaseSuccess,
  deleteLeaseFailure,
  signLeaseStart,
  signLeaseSuccess,
  signLeaseFailure,
  renewLeaseStart,
  renewLeaseSuccess,
  renewLeaseFailure
} from "../redux/leasesRedux";

import {
  getExpensePropertiesStart,
  getExpensePropertiesSuccess,
  getExpensePropertiesFailure,
  createExpensePropertyStart,
  createExpensePropertySuccess,
  createExpensePropertyFailure,
  updateExpensePropertyStart,
  updateExpensePropertySuccess,
  updateExpensePropertyFailure,
  deleteExpensePropertyStart,
  deleteExpensePropertySuccess,
  deleteExpensePropertyFailure
} from "../redux/expensePropertyRedux";

import {
  getNotificationsStart,
  getNotificationsSuccess,
  getNotificationsFailure,
  createNotificationStart,
  createNotificationSuccess,
  createNotificationFailure,
  updateNotificationStart,
  updateNotificationSuccess,
  updateNotificationFailure,
  deleteNotificationStart,
  deleteNotificationSuccess,
  deleteNotificationFailure,
  markNotificationAsReadStart,
  markNotificationAsReadSuccess,
  markNotificationAsReadFailure,
  markAllNotificationsAsReadStart,
  markAllNotificationsAsReadSuccess,
  markAllNotificationsAsReadFailure
} from "../redux/notificationPropertyRedux";
import { createPrinterFailure, createPrinterStart, createPrinterSuccess, deletePrinterFailure, deletePrinterStart, deletePrinterSuccess, getPrintersFailure, getPrintersStart, getPrintersSuccess } from "./printerRedux"

//requests actions
import {getRequestsFailure, getRequestsStart, getRequestsSuccess,
    createRequestStart, createRequestFailure, createRequestSuccess,
    deleteRequestStart,deleteRequestSuccess,deleteRequestFailure } from "./requestServiceRedux"

import {
    getCompaniesStart,
    getCompaniesSuccess,
    getCompaniesFailure,
    getCompanyStart,
    getCompanySuccess,
    getCompanyFailure,
    createCompanyStart,
    createCompanySuccess,
    createCompanyFailure,
    updateCompanyStart,
    updateCompanySuccess,
    updateCompanyFailure,
    deleteCompanyStart,
    deleteCompanySuccess,
    deleteCompanyFailure
} from "./companiesRedux";




//employees section
//getting all employees
export const getEmployees = async (dispatch, businessId) => {
    dispatch(getEmployeesStart());
    try {
        const res = await adminRequests.get(`/employees?businessId=${businessId}`);
        dispatch(getEmployeesSuccess(res.data));
    } catch (err) {
        dispatch(getEmployeesFailure());
    }
};

//creating an employee
export const createEmployee = async (employee, dispatch) => {
    dispatch(createEmployeeStart());
    try {
        const res = await adminRequests.post(`/employeesAuth/register`, employee);
        dispatch(createEmployeeSuccess(res.data));
        return res.data; 
    } catch (err) {
        dispatch(createEmployeeFailure());
        throw err; 
    }
};

//updating an employee
export const updateEmployee = async (id,employee,dispatch) => {
    dispatch(updateEmployeeStart())
    try{
        await adminRequests.put(`/employees/${id}`,employee)
        dispatch(updateEmployeeSuccess({id,employee}))
    }catch(err){
        dispatch(updateEmployeeFailure())
    }
}

//deleting an employee
export const deleteEmployee = async (id,dispatch) => {
    dispatch(deleteEmployeeStart())
    try{
        await adminRequests.delete(`/employees/${id}`)
        dispatch(deleteEmployeeSuccess(id))
    }catch(err){
        dispatch(deleteEmployeeFailure())
    }
}

//Printers section
// Getting all printers
export const getPrinters = async (dispatch, businessId) => {
    dispatch(getPrintersStart());
    try {
        const res = await adminRequests.get(`/printers?businessId=${businessId}`);
        dispatch(getPrintersSuccess(res.data));
    } catch (err) {
        dispatch(getPrintersFailure());
    }
};

// Creating a printer
export const createPrinter = async (printerData, dispatch) => {
    dispatch(createPrinterStart());
    try {
        const res = await adminRequests.post("/printers", printerData);
        dispatch(createPrinterSuccess(res.data));
    } catch (err) {
        dispatch(createPrinterFailure());
    }
};

// Deleting a printer
export const deletePrinter = async (id, dispatch) => {
    dispatch(deletePrinterStart());
    try {
        await adminRequests.delete(`/printers/${id}`);
        dispatch(deletePrinterSuccess(id));
    } catch (err) {
        dispatch(deletePrinterFailure());
    }
};




//deleting a product
export const deleteRequest = async (id,dispatch) => {
    dispatch(deleteRequestStart())
    try{
        await adminRequests.delete(`/requests/${id}`)
        dispatch(deleteRequestSuccess(id))
    }catch(err){
        dispatch(deleteRequestFailure())
    }
}




//creating a Request
export const createRequest = async (request, dispatch) => {
    dispatch(createRequestStart());
    try {
        const res = await adminRequests.post(`/requests`, request);
        dispatch(createRequestSuccess(res.data));
        return res.data;  
    } catch (err) {
        dispatch(createRequestFailure());
        throw err;  
    }
};


//getting all requests
export const getRequests = async (dispatch) => {
    dispatch(getRequestsStart())
    try{
        const res = await adminRequests.get("/requests/")
        dispatch(getRequestsSuccess(res.data))
    }catch(err){
        dispatch(getRequestsFailure())
    }
}

// Helper to transform wizard data to backend format
const transformCompanyData = (data) => {
  const transformed = { ...data };

  if (data.modules) {
    const moduleBooleans = {};
    for (const [key, value] of Object.entries(data.modules)) {
      moduleBooleans[key] = value.enabled || false;
    }
    transformed.modules = moduleBooleans;
  }

  return transformed;
};

// GET all companies (with pagination & search)
export const getCompanies = (queryParams = {}) => async (dispatch) => {
  dispatch(getCompaniesStart());
  try {
    const res = await adminRequests.get('/companies', { params: queryParams });
    dispatch(getCompaniesSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(getCompaniesFailure());
    throw err;
  }
};

// GET single company by ID
export const getCompany = (id) => async (dispatch) => {
  dispatch(getCompanyStart());
  try {
    const res = await adminRequests.get(`/companies/${id}`);
    dispatch(getCompanySuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(getCompanyFailure());
    throw err;
  }
};

// CREATE new company
export const createCompany = (companyData) => async (dispatch) => {
  dispatch(createCompanyStart());
  try {
    const payload = transformCompanyData(companyData);
    const res = await adminRequests.post('/companies', payload);
    dispatch(createCompanySuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createCompanyFailure());
    throw err;
  }
};

// UPDATE company by ID
export const updateCompany = (id, companyData) => async (dispatch) => {
  dispatch(updateCompanyStart());
  try {
    const payload = transformCompanyData(companyData);
    const res = await adminRequests.put(`/companies/${id}`, payload);
    dispatch(updateCompanySuccess({ id, company: res.data }));
    return res.data;
  } catch (err) {
    dispatch(updateCompanyFailure());
    throw err;
  }
};

// DELETE company by ID
export const deleteCompany = (id) => async (dispatch) => {
  dispatch(deleteCompanyStart());
  try {
    await adminRequests.delete(`/companies/${id}`);
    dispatch(deleteCompanySuccess(id));
  } catch (err) {
    dispatch(deleteCompanyFailure());
    throw err;
  }
};

// Get all landlords
export const getLandlords = async (dispatch, business) => {
  dispatch(getLandlordsStart());
  try {
    const res = await adminRequests.get(`/landlords?business=${business}`);
    dispatch(getLandlordsSuccess(res.data));
  } catch (err) {
    dispatch(getLandlordsFailure());
  }
};

// Get single landlord
export const getLandlord = async (dispatch, id) => {
  dispatch(getLandlordsStart());
  try {
    const res = await adminRequests.get(`/landlords/${id}`);
    dispatch(getLandlordsSuccess([res.data]));
  } catch (err) {
    dispatch(getLandlordsFailure());
  }
};

// Create landlord
export const createLandlord = async (dispatch, landlordData) => {
  dispatch(createLandlordStart());
  try {
    const res = await adminRequests.post("/landlords", landlordData);
    dispatch(createLandlordSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createLandlordFailure());
    throw err;
  }
};

// Update landlord
export const updateLandlord = async (dispatch, id, landlordData) => {
  dispatch(updateLandlordStart());
  try {
    const res = await adminRequests.put(`/landlords/${id}`, landlordData);
    dispatch(updateLandlordSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateLandlordFailure());
    throw err;
  }
};

// Delete landlord
export const deleteLandlord = async (dispatch, id) => {
  dispatch(deleteLandlordStart());
  try {
    await adminRequests.delete(`/landlords/${id}`);
    dispatch(deleteLandlordSuccess(id));
    return true;
  } catch (err) {
    dispatch(deleteLandlordFailure());
    throw err;
  }
};

// Get landlord stats
export const getLandlordStats = async (id) => {
  try {
    const res = await adminRequests.get(`/landlords/stats/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};





// Get all utilities
export const getUtilities = async (dispatch, business) => {
  dispatch(getUtilitiesStart());
  try {
    const res = await adminRequests.get(`/utilities?business=${business}`);
    dispatch(getUtilitiesSuccess(res.data));
  } catch (err) {
    dispatch(getUtilitiesFailure());
  }
};

// Get single utility
export const getUtility = async (dispatch, id) => {
  dispatch(getUtilitiesStart());
  try {
    const res = await adminRequests.get(`/utilities/${id}`);
    dispatch(getUtilitiesSuccess([res.data]));
  } catch (err) {
    dispatch(getUtilitiesFailure());
  }
};

// Create utility
export const createUtility = async (dispatch, utilityData) => {
  dispatch(createUtilityStart());
  try {
    const res = await adminRequests.post("/utilities", utilityData);
    dispatch(createUtilitySuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createUtilityFailure());
    throw err;
  }
};

// Update utility
export const updateUtility = async (dispatch, id, utilityData) => {
  dispatch(updateUtilityStart());
  try {
    const res = await adminRequests.put(`/utilities/${id}`, utilityData);
    dispatch(updateUtilitySuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateUtilityFailure());
    throw err;
  }
};

// Delete utility
export const deleteUtility = async (dispatch, id) => {
  dispatch(deleteUtilityStart());
  try {
    await adminRequests.delete(`/utilities/${id}`);
    dispatch(deleteUtilitySuccess(id));
    return true;
  } catch (err) {
    dispatch(deleteUtilityFailure());
    throw err;
  }
};


// Get all units
export const getUnits = async (dispatch, business, property = null, status = null) => {
  dispatch(getUnitsStart());
  try {
    let url = `/units?business=${business}`;
    if (property) url += `&property=${property}`;
    if (status) url += `&status=${status}`;
    
    const res = await adminRequests.get(url);
    dispatch(getUnitsSuccess(res.data));
  } catch (err) {
    dispatch(getUnitsFailure());
  }
};

// Get single unit
export const getUnit = async (dispatch, id) => {
  dispatch(getUnitsStart());
  try {
    const res = await adminRequests.get(`/units/${id}`);
    dispatch(getUnitsSuccess([res.data]));
  } catch (err) {
    dispatch(getUnitsFailure());
  }
};

// Create unit
export const createUnit = async (dispatch, unitData) => {
  dispatch(createUnitStart());
  try {
    const res = await adminRequests.post("/units", unitData);
    dispatch(createUnitSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createUnitFailure());
    throw err;
  }
};

// Update unit
export const updateUnit = async (dispatch, id, unitData) => {
  dispatch(updateUnitStart());
  try {
    const res = await adminRequests.put(`/units/${id}`, unitData);
    dispatch(updateUnitSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateUnitFailure());
    throw err;
  }
};

// Delete unit
export const deleteUnit = async (dispatch, id) => {
  dispatch(deleteUnitStart());
  try {
    await adminRequests.delete(`/units/${id}`);
    dispatch(deleteUnitSuccess(id));
    return true;
  } catch (err) {
    dispatch(deleteUnitFailure());
    throw err;
  }
};

// Update unit status
export const updateUnitStatus = async (dispatch, id, statusData) => {
  dispatch(updateUnitStatusStart());
  try {
    const res = await adminRequests.put(`/units/status/${id}`, statusData);
    dispatch(updateUnitStatusSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateUnitStatusFailure());
    throw err;
  }
};

// Get available units
export const getAvailableUnits = async (business, property = null) => {
  try {
    let url = `/units/find/available?business=${business}`;
    if (property) url += `&property=${property}`;
    
    const res = await adminRequests.get(url);
    return res.data;
  } catch (err) {
    throw err;
  }
};


// Get all tenants
export const getTenants = async (dispatch, business, status = null, unit = null) => {
  dispatch(getTenantsStart());
  try {
    let url = `/tenants?business=${business}`;
    if (status) url += `&status=${status}`;
    if (unit) url += `&unit=${unit}`;
    
    const res = await adminRequests.get(url);
    dispatch(getTenantsSuccess(res.data));
  } catch (err) {
    dispatch(getTenantsFailure());
  }
};

// Get single tenant
export const getTenant = async (dispatch, id) => {
  dispatch(getTenantsStart());
  try {
    const res = await adminRequests.get(`/tenants/${id}`);
    dispatch(getTenantsSuccess([res.data]));
  } catch (err) {
    dispatch(getTenantsFailure());
  }
};

// Create tenant
export const createTenant = async (dispatch, tenantData) => {
  dispatch(createTenantStart());
  try {
    const res = await adminRequests.post("/tenants", tenantData);
    dispatch(createTenantSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createTenantFailure());
    throw err;
  }
};

// Update tenant
export const updateTenant = async (dispatch, id, tenantData) => {
  dispatch(updateTenantStart());
  try {
    const res = await adminRequests.put(`/tenants/${id}`, tenantData);
    dispatch(updateTenantSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateTenantFailure());
    throw err;
  }
};

// Delete tenant
export const deleteTenant = async (dispatch, id) => {
  dispatch(deleteTenantStart());
  try {
    await adminRequests.delete(`/tenants/${id}`);
    dispatch(deleteTenantSuccess(id));
    return true;
  } catch (err) {
    dispatch(deleteTenantFailure());
    throw err;
  }
};

// Update tenant status
export const updateTenantStatus = async (dispatch, id, statusData) => {
  dispatch(updateTenantStatusStart());
  try {
    const res = await adminRequests.put(`/tenants/status/${id}`, statusData);
    dispatch(updateTenantStatusSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateTenantStatusFailure());
    throw err;
  }
};

// Get tenant payments
export const getTenantPayments = async (id) => {
  try {
    const res = await adminRequests.get(`/tenants/payments/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Get tenant balance
export const getTenantBalance = async (id) => {
  try {
    const res = await adminRequests.get(`/tenants/balance/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};


// Get all rent payments
export const getRentPayments = async (dispatch, business, tenant = null, unit = null, month = null, year = null, paymentType = null) => {
  dispatch(getRentPaymentsStart());
  try {
    let url = `/rent-payments?business=${business}`;
    if (tenant) url += `&tenant=${tenant}`;
    if (unit) url += `&unit=${unit}`;
    if (month) url += `&month=${month}`;
    if (year) url += `&year=${year}`;
    if (paymentType) url += `&paymentType=${paymentType}`;
    
    const res = await adminRequests.get(url);
    dispatch(getRentPaymentsSuccess(res.data));
  } catch (err) {
    dispatch(getRentPaymentsFailure());
  }
};

// Get single rent payment
export const getRentPayment = async (dispatch, id) => {
  dispatch(getRentPaymentsStart());
  try {
    const res = await adminRequests.get(`/rent-payments/${id}`);
    dispatch(getRentPaymentsSuccess([res.data]));
  } catch (err) {
    dispatch(getRentPaymentsFailure());
  }
};

// Create rent payment
export const createRentPayment = async (dispatch, paymentData) => {
  dispatch(createRentPaymentStart());
  try {
    const res = await adminRequests.post("/rent-payments", paymentData);
    dispatch(createRentPaymentSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createRentPaymentFailure());
    throw err;
  }
};

// Update rent payment
export const updateRentPayment = async (dispatch, id, paymentData) => {
  dispatch(updateRentPaymentStart());
  try {
    const res = await adminRequests.put(`/rent-payments/${id}`, paymentData);
    dispatch(updateRentPaymentSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateRentPaymentFailure());
    throw err;
  }
};

// Delete rent payment
export const deleteRentPayment = async (dispatch, id) => {
  dispatch(deleteRentPaymentStart());
  try {
    await adminRequests.delete(`/rent-payments/${id}`);
    dispatch(deleteRentPaymentSuccess(id));
    return true;
  } catch (err) {
    dispatch(deleteRentPaymentFailure());
    throw err;
  }
};

// Confirm rent payment
export const confirmRentPayment = async (dispatch, id, confirmData) => {
  dispatch(confirmRentPaymentStart());
  try {
    const res = await adminRequests.put(`/rent-payments/confirm/${id}`, confirmData);
    dispatch(confirmRentPaymentSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(confirmRentPaymentFailure());
    throw err;
  }
};

// Get payment summary
export const getPaymentSummary = async (business, month = null, year = null) => {
  try {
    let url = `/rent-payments/get/summary?business=${business}`;
    if (month) url += `&month=${month}`;
    if (year) url += `&year=${year}`;
    
    const res = await adminRequests.get(url);
    return res.data;
  } catch (err) {
    throw err;
  }
};


// Get all maintenances
export const getMaintenances = async (dispatch, business, status = null, priority = null, unit = null, tenant = null) => {
  dispatch(getMaintenancesStart());
  try {
    let url = `/maintenances?business=${business}`;
    if (status) url += `&status=${status}`;
    if (priority) url += `&priority=${priority}`;
    if (unit) url += `&unit=${unit}`;
    if (tenant) url += `&tenant=${tenant}`;
    
    const res = await adminRequests.get(url);
    dispatch(getMaintenancesSuccess(res.data));
  } catch (err) {
    dispatch(getMaintenancesFailure());
  }
};

// Get single maintenance
export const getMaintenance = async (dispatch, id) => {
  dispatch(getMaintenancesStart());
  try {
    const res = await adminRequests.get(`/maintenances/${id}`);
    dispatch(getMaintenancesSuccess([res.data]));
  } catch (err) {
    dispatch(getMaintenancesFailure());
  }
};

// Create maintenance
export const createMaintenance = async (dispatch, maintenanceData) => {
  dispatch(createMaintenanceStart());
  try {
    const res = await adminRequests.post("/maintenances", maintenanceData);
    dispatch(createMaintenanceSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createMaintenanceFailure());
    throw err;
  }
};

// Update maintenance
export const updateMaintenance = async (dispatch, id, maintenanceData) => {
  dispatch(updateMaintenanceStart());
  try {
    const res = await adminRequests.put(`/maintenances/${id}`, maintenanceData);
    dispatch(updateMaintenanceSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateMaintenanceFailure());
    throw err;
  }
};

// Delete maintenance
export const deleteMaintenance = async (dispatch, id) => {
  dispatch(deleteMaintenanceStart());
  try {
    await adminRequests.delete(`/maintenances/${id}`);
    dispatch(deleteMaintenanceSuccess(id));
    return true;
  } catch (err) {
    dispatch(deleteMaintenanceFailure());
    throw err;
  }
};

// Update maintenance status
export const updateMaintenanceStatus = async (dispatch, id, statusData) => {
  dispatch(updateMaintenanceStatusStart());
  try {
    const res = await adminRequests.put(`/maintenances/status/${id}`, statusData);
    dispatch(updateMaintenanceStatusSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateMaintenanceStatusFailure());
    throw err;
  }
};

// Get maintenance stats
export const getMaintenanceStats = async (business) => {
  try {
    const res = await adminRequests.get(`/maintenances/get/stats?business=${business}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};


// Get all leases
export const getLeases = async (dispatch, business, status = null, tenant = null, unit = null) => {
  dispatch(getLeasesStart());
  try {
    let url = `/leases?business=${business}`;
    if (status) url += `&status=${status}`;
    if (tenant) url += `&tenant=${tenant}`;
    if (unit) url += `&unit=${unit}`;
    
    const res = await adminRequests.get(url);
    dispatch(getLeasesSuccess(res.data));
  } catch (err) {
    dispatch(getLeasesFailure());
  }
};

// Get single lease
export const getLease = async (dispatch, id) => {
  dispatch(getLeasesStart());
  try {
    const res = await adminRequests.get(`/leases/${id}`);
    dispatch(getLeasesSuccess([res.data]));
  } catch (err) {
    dispatch(getLeasesFailure());
  }
};

// Create lease
export const createLease = async (dispatch, leaseData) => {
  dispatch(createLeaseStart());
  try {
    const res = await adminRequests.post("/leases", leaseData);
    dispatch(createLeaseSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createLeaseFailure());
    throw err;
  }
};

// Update lease
export const updateLease = async (dispatch, id, leaseData) => {
  dispatch(updateLeaseStart());
  try {
    const res = await adminRequests.put(`/leases/${id}`, leaseData);
    dispatch(updateLeaseSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateLeaseFailure());
    throw err;
  }
};

// Delete lease
export const deleteLease = async (dispatch, id) => {
  dispatch(deleteLeaseStart());
  try {
    await adminRequests.delete(`/leases/${id}`);
    dispatch(deleteLeaseSuccess(id));
    return true;
  } catch (err) {
    dispatch(deleteLeaseFailure());
    throw err;
  }
};

// Sign lease
export const signLease = async (dispatch, id, signData) => {
  dispatch(signLeaseStart());
  try {
    const res = await adminRequests.put(`/leases/sign/${id}`, signData);
    dispatch(signLeaseSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(signLeaseFailure());
    throw err;
  }
};

// Get expiring leases
export const getExpiringLeases = async (business, days = 30) => {
  try {
    const res = await adminRequests.get(`/leases/find/expiring?business=${business}&days=${days}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Renew lease
export const renewLease = async (dispatch, id, renewData) => {
  dispatch(renewLeaseStart());
  try {
    const res = await adminRequests.put(`/leases/renew/${id}`, renewData);
    dispatch(renewLeaseSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(renewLeaseFailure());
    throw err;
  }
};


// Get all expense properties
export const getExpenseProperties = async (dispatch, business, category = null, property = null, unit = null, startDate = null, endDate = null) => {
  dispatch(getExpensePropertiesStart());
  try {
    let url = `/propertyexpenses?business=${business}`;
    if (category) url += `&category=${category}`;
    if (property) url += `&property=${property}`;
    if (unit) url += `&unit=${unit}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    
    const res = await adminRequests.get(url);
    dispatch(getExpensePropertiesSuccess(res.data));
  } catch (err) {
    dispatch(getExpensePropertiesFailure());
  }
};

// Get single expense property
export const getExpenseProperty = async (dispatch, id) => {
  dispatch(getExpensePropertiesStart());
  try {
    const res = await adminRequests.get(`/propertyexpenses/${id}`);
    dispatch(getExpensePropertiesSuccess([res.data]));
  } catch (err) {
    dispatch(getExpensePropertiesFailure());
  }
};

// Create expense property
export const createExpenseProperty = async (dispatch, expenseData) => {
  dispatch(createExpensePropertyStart());
  try {
    const res = await adminRequests.post("/propertyexpenses", expenseData);
    dispatch(createExpensePropertySuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createExpensePropertyFailure());
    throw err;
  }
};

// Update expense property
export const updateExpenseProperty = async (dispatch, id, expenseData) => {
  dispatch(updateExpensePropertyStart());
  try {
    const res = await adminRequests.put(`/propertyexpenses/${id}`, expenseData);
    dispatch(updateExpensePropertySuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateExpensePropertyFailure());
    throw err;
  }
};

// Delete expense property
export const deleteExpenseProperty = async (dispatch, id) => {
  dispatch(deleteExpensePropertyStart());
  try {
    await adminRequests.delete(`/propertyexpenses/${id}`);
    dispatch(deleteExpensePropertySuccess(id));
    return true;
  } catch (err) {
    dispatch(deleteExpensePropertyFailure());
    throw err;
  }
};

// Get expense summary
export const getExpenseSummary = async (business, startDate = null, endDate = null) => {
  try {
    let url = `/propertyexpenses/get/summary?business=${business}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    
    const res = await adminRequests.get(url);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Get property expenses
export const getPropertyExpenses = async (propertyId, startDate = null, endDate = null) => {
  try {
    let url = `/propertyexpenses/property/${propertyId}`;
    if (startDate || endDate) {
      url += '?';
      if (startDate) url += `startDate=${startDate}`;
      if (endDate) url += `${startDate ? '&' : ''}endDate=${endDate}`;
    }
    
    const res = await adminRequests.get(url);
    return res.data;
  } catch (err) {
    throw err;
  }
};


// Get all notifications
export const getNotifications = async (dispatch, business, recipient = null, isRead = null, type = null) => {
  dispatch(getNotificationsStart());
  try {
    let url = `/notifications?business=${business}`;
    if (recipient) url += `&recipient=${recipient}`;
    if (isRead !== undefined) url += `&isRead=${isRead}`;
    if (type) url += `&type=${type}`;
    
    const res = await adminRequests.get(url);
    dispatch(getNotificationsSuccess(res.data));
  } catch (err) {
    dispatch(getNotificationsFailure());
  }
};

// Get single notification
export const getNotification = async (dispatch, id) => {
  dispatch(getNotificationsStart());
  try {
    const res = await adminRequests.get(`/notifications/${id}`);
    dispatch(getNotificationsSuccess([res.data]));
  } catch (err) {
    dispatch(getNotificationsFailure());
  }
};

// Create notification
export const createNotification = async (dispatch, notificationData) => {
  dispatch(createNotificationStart());
  try {
    const res = await adminRequests.post("/notifications", notificationData);
    dispatch(createNotificationSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(createNotificationFailure());
    throw err;
  }
};

// Update notification
export const updateNotification = async (dispatch, id, notificationData) => {
  dispatch(updateNotificationStart());
  try {
    const res = await adminRequests.put(`/notifications/${id}`, notificationData);
    dispatch(updateNotificationSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateNotificationFailure());
    throw err;
  }
};

// Delete notification
export const deleteNotification = async (dispatch, id) => {
  dispatch(deleteNotificationStart());
  try {
    await adminRequests.delete(`/notifications/${id}`);
    dispatch(deleteNotificationSuccess(id));
    return true;
  } catch (err) {
    dispatch(deleteNotificationFailure());
    throw err;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (dispatch, id) => {
  dispatch(markNotificationAsReadStart());
  try {
    const res = await adminRequests.put(`/notifications/read/${id}`);
    dispatch(markNotificationAsReadSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(markNotificationAsReadFailure());
    throw err;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (dispatch, recipient) => {
  dispatch(markAllNotificationsAsReadStart());
  try {
    await adminRequests.put("/notifications/read-all", { recipient });
    dispatch(markAllNotificationsAsReadSuccess());
    return true;
  } catch (err) {
    dispatch(markAllNotificationsAsReadFailure());
    throw err;
  }
};

// Get notification stats
export const getNotificationStats = async (recipient) => {
  try {
    const res = await adminRequests.get(`/notifications/get/stats?recipient=${recipient}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getDashboardSummary = async (business) => {
  try {
    const res = await adminRequests.get(`/dashboard/summary?business=${business}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getUnitUtilities = async (unitId) => {
  try {
    const res = await adminRequests.get(`/units/${unitId}/utilities`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const addUtilityToUnit = async (dispatch, unitId, utilityData) => {
  dispatch(addUtilityToUnitStart());
  try {
    const res = await adminRequests.post(`/units/${unitId}/utilities`, utilityData);
    dispatch(addUtilityToUnitSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(addUtilityToUnitFailure());
    throw err;
  }
};

export const removeUtilityFromUnit = async (dispatch, unitId, utilityId) => {
  dispatch(removeUtilityFromUnitStart());
  try {
    await adminRequests.delete(`/units/${unitId}/utilities/${utilityId}`);
    dispatch(removeUtilityFromUnitSuccess(utilityId));
    return true;
  } catch (err) {
    dispatch(removeUtilityFromUnitFailure());
    throw err;
  }
};

export const getTenantTotalDue = async (tenantId) => {
  try {
    const res = await adminRequests.get(`/tenants/${tenantId}/total-due`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

