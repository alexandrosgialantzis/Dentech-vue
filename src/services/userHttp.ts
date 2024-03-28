import axios, { AxiosInstance } from 'axios'

let API_URL: string

if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL + 'user'
} else {
  API_URL = 'https://dentech-api.onrender.com/api/v1/user'
}

export const userHttp: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
