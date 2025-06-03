<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStationsStore, type Station } from '../stores/stations'

const router = useRouter()
const route = useRoute()
const stationsStore = useStationsStore()

// Form state
const station = ref<Station>({
  name: '',
  address: '',
  location: { lat: 0, lng: 0 },
  status: 'active',
  powerOutput: 50,
  connectorType: 'CCS'
})

const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMsg = ref('')
const isEditMode = computed(() => route.params.id !== undefined)

// Load station data if in edit mode
onMounted(async () => {
  if (isEditMode.value) {
    isLoading.value = true
    try {
      const stationId = route.params.id as string
      const stationData = await stationsStore.getStation(stationId)
      station.value = stationData
    } catch (error: any) {
      errorMsg.value = error.message || 'Failed to load station data'
      console.error('Failed to load station:', error)
    } finally {
      isLoading.value = false
    }
  }
})

// Form submission
const submitForm = async () => {
  // Validate form
  if (!station.value.name || !station.value.address || 
      !station.value.location.lat || !station.value.location.lng ||
      !station.value.powerOutput) {
    errorMsg.value = 'Please fill in all required fields'
    return
  }
  
  if (station.value.powerOutput <= 0) {
    errorMsg.value = 'Power output must be greater than 0'
    return
  }
  
  isSubmitting.value = true
  errorMsg.value = ''
  
  try {
    if (isEditMode.value) {
      await stationsStore.updateStation(route.params.id as string, station.value)
    } else {
      await stationsStore.createStation(station.value)
    }
    
    // Redirect back to stations list
    router.push('/stations')
  } catch (error: any) {
    errorMsg.value = error.response?.data?.message || 'Failed to save station'
  } finally {
    isSubmitting.value = false
  }
}

// Get user's location for new stations
const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        station.value.location.lat = position.coords.latitude
        station.value.location.lng = position.coords.longitude
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  } else {
    console.error('Geolocation is not supported by this browser')
  }
}

// Cancel and go back
const cancelForm = () => {
  router.push('/stations')
}

// Handle location input
const locationString = ref('')

const updateLocationFromString = () => {
  const coords = locationString.value.split(',').map(s => parseFloat(s.trim()))
  if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    station.value.location.lat = coords[0]
    station.value.location.lng = coords[1]
    errorMsg.value = ''
  } else {
    errorMsg.value = 'Please enter valid coordinates (latitude, longitude)'
  }
}

// Format location string when lat/lng change
const formatLocationString = () => {
  locationString.value = `${station.value.location.lat}, ${station.value.location.lng}`
}

// Update locationString when component mounts or when lat/lng change
onMounted(() => {
  formatLocationString()
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ isEditMode ? 'Edit Charging Station' : 'Add New Charging Station' }}
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ isEditMode ? 'Update the details of an existing charging station.' : 'Add a new charging station to your network.' }}
      </p>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
    
    <form v-else @submit.prevent="submitForm" class="space-y-6 bg-white dark:bg-gray-800 shadow sm:rounded-lg sm:overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <!-- Error message -->
        <div v-if="errorMsg" class="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ errorMsg }}</p>
            </div>
          </div>
        </div>
        
        <!-- Form fields -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Station Name -->
          <div class="sm:col-span-2">
            <label for="name" class="form-label">
              Station Name *
            </label>
            <div class="mt-1">
              <input
                type="text"
                id="name"
                v-model="station.name"
                required
                class="form-input"
                placeholder="Enter station name"
              />
            </div>
          </div>
          
          <!-- Address -->
          <div class="sm:col-span-2">
            <label for="address" class="form-label">
              Address *
            </label>
            <div class="mt-1">
              <input
                type="text"
                id="address"
                v-model="station.address"
                required
                class="form-input"
                placeholder="Enter station address"
              />
            </div>
          </div>
          
          <!-- Location -->
          <div class="sm:col-span-2">
            <label for="location" class="form-label">
              Location (Latitude, Longitude) *
            </label>
            <div class="mt-1 flex space-x-3">
              <div class="flex-grow">
                <input
                  type="text"
                  id="location"
                  v-model="locationString"
                  placeholder="e.g. 37.7749, -122.4194"
                  class="form-input"
                />
              </div>
              <div class="flex space-x-2">
                <button
                  type="button"
                  @click="updateLocationFromString"
                  class="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Apply
                </button>
                <button
                  type="button"
                  @click="getUserLocation"
                  class="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  Current
                </button>
              </div>
            </div>
            <div class="mt-2 grid grid-cols-2 gap-4">
              <div>
                <label for="latitude" class="form-label">Latitude</label>
                <input
                  type="number"
                  id="latitude"
                  v-model="station.location.lat"
                  step="0.000001"
                  required
                  class="form-input"
                  @change="formatLocationString"
                />
              </div>
              <div>
                <label for="longitude" class="form-label">Longitude</label>
                <input
                  type="number"
                  id="longitude"
                  v-model="station.location.lng"
                  step="0.000001"
                  required
                  class="form-input"
                  @change="formatLocationString"
                />
              </div>
            </div>
          </div>
          
          <!-- Status -->
          <div>
            <label for="status" class="form-label">
              Status
            </label>
            <div class="mt-1">
              <select
                id="status"
                v-model="station.status"
                class="form-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          
          <!-- Power Output -->
          <div>
            <label for="powerOutput" class="form-label">
              Power Output (kW) *
            </label>
            <div class="mt-1">
              <input
                type="number"
                id="powerOutput"
                v-model="station.powerOutput"
                min="1"
                step="0.1"
                required
                class="form-input"
                placeholder="Enter power output"
              />
            </div>
          </div>
          
          <!-- Connector Type -->
          <div>
            <label for="connectorType" class="form-label">
              Connector Type
            </label>
            <div class="mt-1">
              <select
                id="connectorType"
                v-model="station.connectorType"
                class="form-select"
              >
                <option value="CCS">CCS</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="Type 2">Type 2</option>
                <option value="Type 1">Type 1</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 flex justify-end space-x-3">
        <button
          type="button"
          @click="cancelForm"
          class="inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Station' : 'Create Station') }}
        </button>
      </div>
    </form>
  </div>
</template>