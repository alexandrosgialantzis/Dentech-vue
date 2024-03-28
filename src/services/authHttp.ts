import axios from 'axios'

let API_URL: string

if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL + 'auth'
} else {
  API_URL = 'https://dentech-api.onrender.com/api/v1/auth'
}

export const authHttp = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
