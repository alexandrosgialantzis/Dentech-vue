import axios, { AxiosInstance } from 'axios'

const API_URL = 'https://dentech-api.onrender.com/api/v1/product'

export const productHttp: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
