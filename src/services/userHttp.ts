import axios, { AxiosInstance } from 'axios'

let API_ENDPOINT = '/api/v1/user'

if (import.meta.env.VITE_API_URL) {
  API_ENDPOINT = import.meta.env.VITE_API_URL + 'user'
}

export const userHttp: AxiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true
})
