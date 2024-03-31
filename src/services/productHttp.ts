import axios from 'axios'

const API_URL: string = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + 'product'
  : '/api/v1/product'

export const productHttp = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
