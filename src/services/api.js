import API_URL from '../config';

// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error del servidor' }));
    throw new Error(error.error || 'Error en la petición');
  }
  return response.json();
};

// Helper para headers con token automático desde localStorage
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// AUTH
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
};

export const obtenerPerfil = async () => {
  const response = await fetch(`${API_URL}/auth/perfil`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const cambiarPassword = async (passwordActual, passwordNueva) => {
  const response = await fetch(`${API_URL}/auth/cambiar-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ passwordActual, passwordNueva })
  });
  return handleResponse(response);
};

// USUARIOS
export const obtenerUsuarios = async () => {
  const response = await fetch(`${API_URL}/auth/usuarios`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const crearUsuario = async (datos) => {
  const response = await fetch(`${API_URL}/auth/usuarios`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });
  return handleResponse(response);
};

export const actualizarUsuario = async (id, datos) => {
  const response = await fetch(`${API_URL}/auth/usuarios/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });
  return handleResponse(response);
};

export const eliminarUsuario = async (id) => {
  const response = await fetch(`${API_URL}/auth/usuarios/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response);
};

// PROGRESO
export const obtenerProgreso = async (carrera, sede) => {
  const response = await fetch(`${API_URL}/progreso/carreras/${encodeURIComponent(carrera)}/${encodeURIComponent(sede)}`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const guardarProgreso = async (carrera, sede, fases, facultad) => {
  const response = await fetch(`${API_URL}/progreso/carreras/${encodeURIComponent(carrera)}/${encodeURIComponent(sede)}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ fases, facultad })
  });
  return handleResponse(response);
};

export const obtenerTodosProgresos = async () => {
  const response = await fetch(`${API_URL}/progreso/carreras`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const obtenerEstadisticas = async () => {
  const response = await fetch(`${API_URL}/progreso/estadisticas`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const obtenerHistorial = async (carrera, sede) => {
  const response = await fetch(`${API_URL}/progreso/historial/${encodeURIComponent(carrera)}/${encodeURIComponent(sede)}`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

// NOTIFICACIONES
export const obtenerNotificaciones = async () => {
  const response = await fetch(`${API_URL}/notificaciones`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const marcarNotificacionLeida = async (id) => {
  const response = await fetch(`${API_URL}/notificaciones/${id}/leer`, {
    method: 'PUT',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const marcarTodasLeidas = async () => {
  const response = await fetch(`${API_URL}/notificaciones/leer-todas`, {
    method: 'PUT',
    headers: getHeaders()
  });
  return handleResponse(response);
};
