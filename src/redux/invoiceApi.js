// Invoice API calls for tenant invoices
import { adminRequests } from "../utils/requestMethods";

// Create tenant invoice
export const createTenantInvoice = async (invoiceData) => {
  const res = await adminRequests.post("/tenant-invoices", invoiceData);
  return res.data;
};

// Cancel tenant invoice
export const cancelTenantInvoice = async (invoiceId) => {
  const res = await adminRequests.delete(`/tenant-invoices/${invoiceId}`);
  return res.data;
};

// Get tenant invoices
export const getTenantInvoices = async (tenantId) => {
  const res = await adminRequests.get(`/tenant-invoices?tenant=${tenantId}`);
  return res.data;
};
