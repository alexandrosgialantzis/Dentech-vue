import axios from 'axios'

const API_URL: string = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + 'order'
  : 'https://dentech-api.onrender.com/api/v1/order'

export const orderHttp = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
