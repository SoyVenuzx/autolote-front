import axios from 'axios'
const baseURL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5001/api/v1'

console.log('API URL:', baseURL)

const api = axios.create({
  baseURL,
  withCredentials: true, // Importante para manejar cookies HTTP-only
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (
        typeof window !== 'undefined' &&
        error.config.url &&
        !error.config.url.includes('/login') &&
        !error.config.url.includes('/register')
      ) {
        const authErrorEvent = new CustomEvent('auth:error', {
          detail: { status: error.response.status }
        })
        window.dispatchEvent(authErrorEvent)

        //! mostrar error con toast
      }
    }
    return Promise.reject(error)
  }
)

// Interceptor para peticiones que elimina la cabecera auth si no hay cookie
// Esto evita enviar tokens inválidos
// api.interceptors.request.use(
//   config => {
//     // Si estamos en el cliente y no hay cookie de sesión, no intentamos autenticar
//     if (typeof document !== 'undefined') {
//       const hasCookies = document.cookie
//         .split(';')
//         .some(
//           cookie =>
//             cookie.trim().startsWith('token=') ||
//             cookie.trim().startsWith('session=')
//         )

//       // Consola para depuración - eliminar en producción
//       console.debug('Cookies disponibles para auth:', hasCookies)
//     }

//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

export { api }
