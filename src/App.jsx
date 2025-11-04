import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ListaCarreras from './components/ListaCarreras';
import DetalleCarrera from './components/DetalleCarrera';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [selectedCarrera, setSelectedCarrera] = useState(null);
  const [vistaActual, setVistaActual] = useState('lista'); // 'lista', 'detalle', 'dashboard'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (vistaActual === 'dashboard') {
    return <Dashboard onVolver={() => setVistaActual('lista')} />;
  }

  if (selectedCarrera && vistaActual === 'detalle') {
    return (
      <DetalleCarrera
        carrera={selectedCarrera}
        onVolver={() => {
          setSelectedCarrera(null);
          setVistaActual('lista');
        }}
        onDashboard={() => setVistaActual('dashboard')}
      />
    );
  }

  return (
    <ListaCarreras
      onSeleccionarCarrera={(carrera) => {
        setSelectedCarrera(carrera);
        setVistaActual('detalle');
      }}
      onDashboard={() => setVistaActual('dashboard')}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}