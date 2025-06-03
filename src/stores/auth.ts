import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null as User | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  
  actions: {
    async register(userData: RegisterData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('http://localhost:3001/api/auth/register', userData)
        
        this.token = response.data.token
        this.user = response.data.user
        
        // Save token to localStorage
        localStorage.setItem('token', response.data.token)
        
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('http://localhost:3001/api/auth/login', credentials)
        
        this.token = response.data.token
        this.user = response.data.user
        
        // Save token to localStorage
        localStorage.setItem('token', response.data.token)
        
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async checkAuth() {
      if (!this.token) return false
      
      this.loading = true
      this.error = null
      
      try {
        // Configure axios with token
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        const response = await axios.get('http://localhost:3001/api/auth/user')
        this.user = response.data
        return true
      } catch (error: any) {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        this.error = error.response?.data?.message || 'Authentication failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      
      // Clear axios default header
      delete axios.defaults.headers.common['Authorization']
    }
  }
})