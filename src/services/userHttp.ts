import axios, { AxiosInstance } from 'axios'

const API_URL = 'http://localhost:3001/api/v1/user'

export const userHttp: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
