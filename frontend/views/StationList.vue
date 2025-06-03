<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStationsStore, type Station } from '../stores/stations'

const router = useRouter()
const stationsStore = useStationsStore()

// State
const searchQuery = ref('')
const statusFilter = ref('')
const connectorFilter = ref('')
const powerFilter = ref(0)
const isLoading = ref(false)

// Define available status and connector options
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' }
]

const connectorOptions = [
  { value: '', label: 'All Connectors' },
  { value: 'CCS', label: 'CCS' },
  { value: 'CHAdeMO', label: 'CHAdeMO' },
  { value: 'Type 2', label: 'Type 2' },
  { value: 'Type 1', label: 'Type 1' }
]

// Filtered stations based on search and filters
const filteredStations = computed(() => {
  return stationsStore.filteredStations.filter(station => {
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return (
        station.name.toLowerCase().includes(query) ||
        station.address.toLowerCase().includes(query)
      )
    }
    return true
  })
})

// Load stations
const loadStations = async () => {
  isLoading.value = true
  try {
    await stationsStore.fetchStations({
      status: statusFilter.value,
      connectorType: connectorFilter.value,
      minPower: powerFilter.value
    })
  } catch (error) {
    console.error('Failed to load stations:', error)
  } finally {
    isLoading.value = false
  }
}

// Apply filters
const applyFilters = () => {
  loadStations()
}

// Reset filters
const resetFilters = () => {
  statusFilter.value = ''
  connectorFilter.value = ''
  powerFilter.value = 0
  searchQuery.value = ''
  loadStations()
}

// Edit station
const editStation = (stationId: string) => {
  router.push(`/stations/edit/${stationId}`)
}

// Delete station
const stationToDelete = ref<Station | null>(null)
const showDeleteModal = ref(false)

const openDeleteModal = (station: Station) => {
  stationToDelete.value = station
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  stationToDelete.value = null
}

const confirmDelete = async () => {
  if (!stationToDelete.value?._id) return
  
  try {
    await stationsStore.deleteStation(stationToDelete.value._id)
    closeDeleteModal()
  } catch (error) {
    console.error('Failed to delete station:', error)
  }
}

// Load stations on component mount
onMounted(() => {
  loadStations()
})
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Charging Stations</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          A list of all charging stations in your network including their location, status, power output, and connector type.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link
          to="/stations/new"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
        >
          Add Station
        </router-link>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Filters</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Search -->
          <div>
            <label for="search" class="form-label">Search</label>
            <div class="mt-1">
              <input
                type="text"
                id="search"
                v-model="searchQuery"
                placeholder="Search stations..."
                class="form-input"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="form-label">Status</label>
            <div class="mt-1">
              <select
                id="status"
                v-model="statusFilter"
                class="form-select"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <!-- Connector Type Filter -->
          <div>
            <label for="connectorType" class="form-label">Connector Type</label>
            <div class="mt-1">
              <select
                id="connectorType"
                v-model="connectorFilter"
                class="form-select"
              >
                <option value="">All Types</option>
                <option value="CCS">CCS</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="Type 2">Type 2</option>
                <option value="Type 1">Type 1</option>
              </select>
            </div>
          </div>

          <!-- Power Output Range -->
          <div>
            <label for="powerOutput" class="form-label">Min Power Output (kW)</label>
            <div class="mt-1">
              <input
                type="number"
                id="powerOutput"
                v-model="powerFilter"
                min="0"
                step="1"
                placeholder="Min power output"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            @click="resetFilters"
            class="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
    
    <!-- Stations Table -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
          
          <div v-else-if="filteredStations.length === 0" class="text-center py-8">
            <div class="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No stations found</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new charging station.
            </p>
            <div class="mt-6">
              <router-link
                to="/stations/new"
                class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Add Station
              </router-link>
            </div>
          </div>
          
          <div v-else class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Address</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Power (kW)</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Connector</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                <tr v-for="station in filteredStations" :key="station._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                    {{ station.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ station.address }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span 
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5" 
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': station.status === 'active',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': station.status === 'inactive',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': station.status === 'maintenance'
                      }"
                    >
                      {{ station.status.charAt(0).toUpperCase() + station.status.slice(1) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ station.powerOutput }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ station.connectorType }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button 
                      @click="editStation(station._id as string)"
                      class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      @click="openDeleteModal(station)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto z-10">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Delete Charging Station
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete the charging station "{{ stationToDelete?.name }}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="confirmDelete"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button 
              @click="closeDeleteModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>