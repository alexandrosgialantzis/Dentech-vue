import axios, { AxiosInstance } from 'axios'

let API_URL: string

if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL + 'product'
} else {
  API_URL = '/api/v1/product'
}

export const productHttp: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
