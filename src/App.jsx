// App.js
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Landlords from "./pages/Landlord/Landlord";
import Properties from "./pages/Properties/Properties";
import Units from "./pages/Units/Units";
import Tenants from "./pages/Tenants/Tenants";
import Leases from "./pages/Lease/Lease";
import Vacants from "./pages/Vacants/Vacants";
import Maintenances from "./pages/Maintenances/Maintenances";
import Inspections from "./pages/Inspections/Inspections";
import AddProperty from "./components/Properties/AddProperties";
import ModulesDashboard from "./pages/moduleDashboard/ModulesDashboard";
import EditProperty from "./components/Properties/EditProperties";
import PropertyDetail from "./components/Properties/PropertyDetail";
import CompanySetupPage from "./pages/companySetup/CompanySetupPage";
import StartMenu from "./components/StartMenu/StartMenu";

function App() {
  return (
    <BrowserRouter>
      {/* Global Start Menu (must be inside BrowserRouter for useNavigate) */}
      <StartMenu />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/moduleDashboard" element={<ModulesDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/landlords" element={<Landlords />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/units" element={<Units />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/leases" element={<Leases />} />
        <Route path="/vacants" element={<Vacants />} />
        <Route path="/maintenances" element={<Maintenances />} />
        <Route path="/inspections" element={<Inspections />} />

        <Route path="/properties/new" element={<AddProperty />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/properties/edit/:id" element={<EditProperty />} />

        <Route path="/company-setup" element={<CompanySetupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
