import { adminRequests } from "../utils/requestMethods";

// Create tenant invoice
export const createTenantInvoice = async (invoiceData) => {
  const res = await adminRequests.post("/tenant-invoices", invoiceData);
  return res.data;
};

// Get tenant invoices
export const getTenantInvoices = async ({ tenantId, business, status } = {}) => {
  const params = new URLSearchParams();

  if (tenantId) params.append("tenant", tenantId);
  if (business) params.append("business", business);
  if (status) params.append("status", status);

  const query = params.toString();
  const res = await adminRequests.get(`/tenant-invoices${query ? `?${query}` : ""}`);
  return res.data;
};

// Delete tenant invoice
export const deleteTenantInvoice = async (invoiceId) => {
  const res = await adminRequests.delete(`/tenant-invoices/${invoiceId}`);
  return res.data;
};