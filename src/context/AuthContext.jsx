import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI, obtenerPerfil } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      cargarPerfil();
    } else {
      setLoading(false);
    }
  }, [token]);

  const cargarPerfil = async () => {
    try {
      const perfil = await obtenerPerfil(token);
      setUsuario(perfil);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const data = await loginAPI(username, password);
      setToken(data.token);
      setUsuario(data.usuario);
      localStorage.setItem('token', data.token);
      toast.success(`Bienvenido, ${data.usuario.nombre}`);
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Sesión cerrada correctamente');
  };

  const value = {
    usuario,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!usuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};