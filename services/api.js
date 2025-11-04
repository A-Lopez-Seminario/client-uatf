const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error del servidor' }));
    throw new Error(error.error || 'Error en la petición');
  }
  return response.json();
};

// Helper para headers con token
const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
});

// AUTH
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
};

export const obtenerPerfil = async (token) => {
  const response = await fetch(`${API_URL}/auth/perfil`, {
    headers: getHeaders(token)
  });
  return handleResponse(response);
};

export const cambiarPassword = async (passwordActual, passwordNueva, token) => {
  const response = await fetch(`${API_URL}/auth/cambiar-password`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ passwordActual, passwordNueva })
  });
  return handleResponse(response);
};

// USUARIOS
export const obtenerUsuarios = async (token) => {
  const response = await fetch(`${API_URL}/auth/usuarios`, {
    headers: getHeaders(token)
  });
  return handleResponse(response);
};

export const crearUsuario = async (datos, token) => {
  const response = await fetch(`${API_URL}/auth/usuarios`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(datos)
  });
  return handleResponse(response);
};

export const actualizarUsuario = async (id, datos, token) => {
  const response = await fetch(`${API_URL}/auth/usuarios/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(datos)
  });
  return handleResponse(response);
};

export const eliminarUsuario = async (id, token) => {
  const response = await fetch(`${API_URL}/auth/usuarios/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  return handleResponse(response);
};

// PROGRESO
export const obtenerProgreso = async (carrera, sede, token) => {
  const response = await fetch(`${API_URL}/progreso/carreras/${encodeURIComponent(carrera)}/${encodeURIComponent(sede)}`, {
    headers: getHeaders(token)
  });
  return handleResponse(response);
};

export const guardarProgreso = async (carrera, sede, fases, facultad, token) => {
  const response = await fetch(`${API_URL}/progreso/carreras/${encodeURIComponent(carrera)}/${encodeURIComponent(sede)}`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ fases, facultad })
  });
  return handleResponse(response);
};

export const obtenerTodosProgresos = async (token) => {
  const response = await fetch(`${API_URL}/progreso/carreras`, {
    headers: getHeaders(token)
  });
  return handleResponse(response);
};

export const obtenerEstadisticas = async (token) => {
  const response = await fetch(`${API_URL}/progreso/estadisticas`, {
    headers: getHeaders(token)
  });
  return handleResponse(response);
};

export const obtenerHistorial = async (carrera, sede, token) => {
  const response = await fetch(`${API_URL}/progreso/historial/${encodeURIComponent(carrera)}/${encodeURIComponent(sede)}`, {
    headers: getHeaders(token)
  });
  return handleResponse(response);
};

// NOTIFICACIONES
export const obtenerNotificaciones = async (token) => {
  const response = await fetch(`${API_URL}/notificaciones`, {
    headers: getHeaders(token)
  });
  return handleResponse(response);
};

export const marcarNotificacionLeida = async (id, token) => {
  const response = await fetch(`${API_URL}/notificaciones/${id}/leer`, {
    method: 'PUT',
    headers: getHeaders(token)
  });
  return handleResponse(response);
};

export const marcarTodasLeidas = async (token) => {
  const response = await fetch(`${API_URL}/notificaciones/leer-todas`, {
    method: 'PUT',
    headers: getHeaders(token)
  });
  return handleResponse(response);
};