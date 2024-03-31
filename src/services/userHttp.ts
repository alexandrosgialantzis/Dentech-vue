import axios from 'axios'

const API_URL: string = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + 'user'
  : '/api/v1/user'

export const userHttp = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
