// Obtener la URL de la API desde las variables de entorno
const getApiUrl = () => {
  // En producción (Vercel)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback para CRA
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Por defecto, usar producción
  if (import.meta.env.PROD) {
    return 'https://web-production-f0dbd.up.railway.app/api';
  }
  
  // Desarrollo local
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

console.log('🔧 API_URL configurada:', API_URL);

export default API_URL;