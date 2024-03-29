import axios, { AxiosInstance } from 'axios'

let API_ENDPOINT = '/api/v1/order'

if (import.meta.env.VITE_API_URL) {
  API_ENDPOINT = import.meta.env.VITE_API_URL + 'order'
}

export const orderHttp: AxiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true
})
