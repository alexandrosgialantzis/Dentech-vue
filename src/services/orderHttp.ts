import axios, { AxiosInstance } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://dentech-api.onrender.com/api/v1/order'
console.log(import.meta.env.VITE_API_URL)

export const orderHttp: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
