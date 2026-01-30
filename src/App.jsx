// App.js
import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Landlords from './pages/Landlord/Landlord';
import Properties from './pages/Properties/Properties';
import Units from './pages/Units/Units';
import Tenants from './pages/Tenants/Tenants';
import Leases from './pages/Lease/Lease';
import Vacants from './pages/Vacants/Vacants';
import Maintenances from './pages/Maintenances/Maintenances';
import Inspections from './pages/Inspections/Inspections';
import AddProperty from './components/Properties/AddProperties';
import ModulesDashboard from './pages/moduleDashboard/ModulesDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/moduleDashboard" element={<ModulesDashboard/>}/>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/landlords" element={<Landlords />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/units" element={<Units />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/leases" element={<Leases />} />
        <Route path="/vacants" element={<Vacants />} />
        <Route path="/maintenances" element={<Maintenances />} />
        <Route path="/inspections" element={<Inspections />} />
        <Route path="/properties/new" element={<AddProperty />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App