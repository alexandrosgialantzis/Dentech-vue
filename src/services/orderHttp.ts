import axios, { AxiosInstance } from 'axios'

let API_URL: string

if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL + 'order'
} else {
  API_URL = 'https://dentech-api.onrender.com/api/v1/order'
}

export const orderHttp: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
