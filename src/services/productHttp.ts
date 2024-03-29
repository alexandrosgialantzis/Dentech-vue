import axios, { AxiosInstance } from 'axios'

let API_ENDPOINT = '/api/v1/product'

if (import.meta.env.VITE_API_URL) {
  API_ENDPOINT = import.meta.env.VITE_API_URL + 'product'
}

export const productHttp: AxiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true
})
