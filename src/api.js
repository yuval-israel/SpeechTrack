import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || ''
export const api = axios.create({ baseURL: API_URL })

export function setAuthToken(token){
  if(token){
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  }else{
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}
const saved = localStorage.getItem('token')
if(saved) setAuthToken(saved)
export default API_URL
