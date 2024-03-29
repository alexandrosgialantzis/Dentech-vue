import axios from 'axios'

let API_ENDPOINT = '/api/v1/auth' // Adjust this to target the Netlify proxy endpoint

if (import.meta.env.VITE_API_URL) {
  API_ENDPOINT = import.meta.env.VITE_API_URL + 'auth'
}

export const authHttp = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true
})
