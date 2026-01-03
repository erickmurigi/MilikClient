import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import './App.css'
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
