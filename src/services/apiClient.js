import axios from 'axios';
import { auth } from '../config/firebaseConfig';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.sismocheck.com', // URL base del backend existente
  timeout: 10000,
});

// Request Interceptor: Inyectar JWT de Firebase automáticamente
apiClient.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    try {
      // getIdToken(false) usa caché local si no ha expirado, getIdToken(true) fuerza actualización.
      // Usaremos false de forma predeterminada en peticiones estándar para optimizar ancho de banda.
      const token = await auth.currentUser.getIdToken(false);
      config.headers.Authorization = `Bearer ${token}`;
      // Error inyectando token
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Lógica de Exponential Backoff para alta concurrencia
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    // Inicializar el contador de reintentos
    if (!config.retryCount) {
      config.retryCount = 0;
    }

    // Identificar errores de "Alta Demanda" (429) o "Servicio No Disponible" temporal (503)
    if (error.response && [429, 503].includes(error.response.status)) {
      if (config.retryCount < 3) {
        config.retryCount += 1;
        
        // Exponential backoff: Base 500ms * 2^retryCount + jitter (aleatorio para desincronizar peticiones masivas)
        const backoffTime = (Math.pow(2, config.retryCount) * 500) + Math.random() * 200;
        
        // Esperar el tiempo de backoff
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        
        // Volver a lanzar la petición original
        return apiClient(config);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
