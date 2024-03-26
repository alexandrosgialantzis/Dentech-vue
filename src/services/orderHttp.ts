import axios, { AxiosInstance } from 'axios'

const API_URL = 'http://localhost:3001/api/v1/order'

export const orderHttp: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
