// App.js
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanySuccess } from "./redux/companiesRedux";
import useInactivityLogout from "./hooks/useInactivityLogout";
import "./App.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SetupAdmin from "./pages/Login/SetupAdmin";
import Dashboard from "./pages/Dashboard/Dashboard";
import Landlords from "./pages/Landlord/Landlord";
import AddLandlord from "./components/Landlord/AddLandlord";
import Properties from "./pages/Properties/Properties";
import Units from "./pages/Units/Units";
import AddUnit from "./components/Units/AddUnit";
import Tenants from "./pages/Tenants/Tenants";
import AddTenant from "./pages/Tenants/AddTenant";
import TenantStatement from "./pages/Tenants/TenantStatement";
import RentalInvoices from "./pages/Tenants/RentalInvoices";
import Leases from "./pages/Lease/Lease";
import Vacants from "./pages/Vacants/Vacants";
import Maintenances from "./pages/Maintenances/Maintenances";
import Inspections from "./pages/Inspections/Inspections";
import AddProperty from "./components/Properties/AddProperties";
import ModulesDashboard from "./pages/moduleDashboard/ModulesDashboard";
import EditProperty from "./components/Properties/EditProperties";
import PropertyDetail from "./components/Properties/PropertyDetail";
import CompanySetupPage from "./pages/companySetup/CompanySetupPage";
import SystemSetupPage from "./pages/SystemSetup/SystemSetup";
import AddCompanyWizard from "./pages/SystemSetup/AddCompanyWizard";
import AddUserPage from "./pages/SystemSetup/AddUsers";

function ProtectedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.auth);
  const token = localStorage.getItem("milik_token");
  const isAuthenticated = Boolean(currentUser || token);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { currentCompany } = useSelector((state) => state.company);

  // Track inactivity and auto-logout after 10 minutes
  useInactivityLogout();

  // Initialize company from logged-in user on mount/rehydration
  useEffect(() => {
    if (currentUser?.company && !currentCompany) {
      dispatch(getCompanySuccess(currentUser.company));
    }
  }, [currentUser, currentCompany, dispatch]);

  return (
    <BrowserRouter>
      {/* Global Start Menu (must be inside BrowserRouter for useNavigate) */}
     

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup-admin" element={<SetupAdmin />} />

        <Route path="/moduleDashboard" element={<ProtectedRoute><ModulesDashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/system-setup" element={<ProtectedRoute><Navigate to="/system-setup/companies" replace /></ProtectedRoute>} />
        <Route path="/system-setup/companies" element={<ProtectedRoute><SystemSetupPage /></ProtectedRoute>} />
        <Route path="/system-setup/users" element={<ProtectedRoute><SystemSetupPage /></ProtectedRoute>} />
        <Route path="/system-setup/rights" element={<ProtectedRoute><SystemSetupPage /></ProtectedRoute>} />
        <Route path="/system-setup/database" element={<ProtectedRoute><SystemSetupPage /></ProtectedRoute>} />
        <Route path="/system-setup/sessions" element={<ProtectedRoute><SystemSetupPage /></ProtectedRoute>} />
        <Route path="/system-setup/audit" element={<ProtectedRoute><SystemSetupPage /></ProtectedRoute>} />
        <Route path="/landlords" element={<ProtectedRoute><Landlords /></ProtectedRoute>} />
        <Route path="/landlords/new" element={<ProtectedRoute><AddLandlord /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/units" element={<ProtectedRoute><Units /></ProtectedRoute>} />
        <Route path="/units/new" element={<ProtectedRoute><AddUnit /></ProtectedRoute>} />
        <Route path="/tenants" element={<ProtectedRoute><Tenants /></ProtectedRoute>} />
        <Route path="/tenant/new" element={<ProtectedRoute><AddTenant /></ProtectedRoute>} />
        <Route path="/tenant/:id/statement" element={<ProtectedRoute><TenantStatement /></ProtectedRoute>} />
        <Route path="/tenant/:id/billing" element={<ProtectedRoute><Tenants /></ProtectedRoute>} />
        <Route path="/tenant/:id/charges" element={<ProtectedRoute><Tenants /></ProtectedRoute>} />
        <Route path="/tenant/:id/escalations" element={<ProtectedRoute><Tenants /></ProtectedRoute>} />
        <Route path="/tenant/:id/edit" element={<ProtectedRoute><AddTenant /></ProtectedRoute>} />
        <Route path="/invoices/rental" element={<ProtectedRoute><RentalInvoices /></ProtectedRoute>} />
        <Route path="/invoices/rental/:id" element={<ProtectedRoute><RentalInvoices /></ProtectedRoute>} />
        <Route path="/leases" element={<ProtectedRoute><Leases /></ProtectedRoute>} />
        <Route path="/vacants" element={<ProtectedRoute><Vacants /></ProtectedRoute>} />
        <Route path="/maintenances" element={<ProtectedRoute><Maintenances /></ProtectedRoute>} />
        <Route path="/inspections" element={<ProtectedRoute><Inspections /></ProtectedRoute>} />
        <Route path="/add-company" element={<ProtectedRoute><AddCompanyWizard /></ProtectedRoute>} />
        <Route path="/properties/new" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
        <Route path="/properties/edit/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />
        <Route path="/add-user" element={<ProtectedRoute><AddUserPage /></ProtectedRoute>} />
        <Route path="/company-setup" element={<ProtectedRoute><CompanySetupPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
