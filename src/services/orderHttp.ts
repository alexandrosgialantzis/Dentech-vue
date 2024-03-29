import axios, { AxiosInstance } from 'axios'

let API_BASE_URL: string

if (import.meta.env.VITE_API_URL) {
  API_BASE_URL = import.meta.env.VITE_API_URL + 'api/v1/order'
} else {
  API_BASE_URL = '/api/v1/order'
}

export const orderHttp: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
})
