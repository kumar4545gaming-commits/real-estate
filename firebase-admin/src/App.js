import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyForm from './pages/PropertyForm';
import PropertyDetails from './pages/PropertyDetails';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/setup" element={<Setup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/properties" element={<Properties />} />
                        <Route path="/properties/new" element={<PropertyForm />} />
                        <Route path="/properties/:id" element={<PropertyDetails />} />
                        <Route path="/properties/:id/edit" element={<PropertyForm />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
