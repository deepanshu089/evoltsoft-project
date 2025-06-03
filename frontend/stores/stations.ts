import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

interface Location {
  lat: number
  lng: number
}

export interface Station {
  _id?: string
  name: string
  location: Location
  address: string
  status: 'active' | 'inactive' | 'maintenance'
  powerOutput: number
  connectorType: 'CCS' | 'CHAdeMO' | 'Type 2' | 'Type 1'
  createdAt?: string
  updatedAt?: string
}

interface StationFilters {
  status?: string
  connectorType?: string
  minPower?: number
}

export const useStationsStore = defineStore('stations', {
  state: () => ({
    stations: [] as Station[],
    loading: false,
    error: null as string | null,
    filters: {
      status: '',
      connectorType: '',
      minPower: 0
    } as StationFilters
  }),
  
  getters: {
    filteredStations: (state) => {
      return state.stations.filter(station => {
        if (state.filters.status && station.status !== state.filters.status) {
          return false
        }
        
        if (state.filters.connectorType && station.connectorType !== state.filters.connectorType) {
          return false
        }
        
        if (state.filters.minPower && station.powerOutput < state.filters.minPower) {
          return false
        }
        
        return true
      })
    }
  },
  
  actions: {
    setAxiosAuth() {
      const authStore = useAuthStore()
      if (authStore.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
      }
    },
    
    async fetchStations(filters?: StationFilters) {
      this.loading = true
      this.error = null
      this.setAxiosAuth()
      
      try {
        let url = 'http://localhost:3001/api/stations'
        
        if (filters) {
          const queryParams = new URLSearchParams()
          
          if (filters.status) queryParams.append('status', filters.status)
          if (filters.connectorType) queryParams.append('connectorType', filters.connectorType)
          if (filters.minPower) queryParams.append('minPower', filters.minPower.toString())
          
          if (queryParams.toString()) {
            url += `?${queryParams.toString()}`
          }
          
          // Update store filters
          this.filters = { ...filters }
        }
        
        const response = await axios.get(url)
        this.stations = response.data
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch stations'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async getStation(id: string) {
      this.loading = true
      this.error = null
      this.setAxiosAuth()
      
      try {
        const response = await axios.get(`http://localhost:3001/api/stations/${id}`)
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch station'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async createStation(stationData: Station) {
      this.loading = true
      this.error = null
      this.setAxiosAuth()
      
      try {
        const response = await axios.post('http://localhost:3001/api/stations', stationData)
        
        // Add to stations array
        this.stations.push(response.data)
        
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create station'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateStation(id: string, stationData: Partial<Station>) {
      this.loading = true
      this.error = null
      this.setAxiosAuth()
      
      try {
        const response = await axios.put(`http://localhost:3001/api/stations/${id}`, stationData)
        
        // Update stations array
        const index = this.stations.findIndex(station => station._id === id)
        if (index !== -1) {
          this.stations[index] = response.data
        }
        
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update station'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deleteStation(id: string) {
      this.loading = true
      this.error = null
      this.setAxiosAuth()
      
      try {
        console.log('Deleting station with ID:', id)
        console.log('Auth header:', axios.defaults.headers.common['Authorization'])
        
        const response = await axios.delete(`http://localhost:3001/api/stations/${id}`)
        console.log('Delete response:', response.data)
        
        // Remove from stations array
        this.stations = this.stations.filter(station => station._id !== id)
        
        return true
      } catch (error: any) {
        console.error('Delete station error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        })
        this.error = error.response?.data?.message || 'Failed to delete station'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})