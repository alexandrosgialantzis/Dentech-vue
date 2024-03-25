import axios from 'axios'

const API_URL = 'http://localhost:3001/api/v1/auth'

export const authHttp = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
