<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useStationsStore, type Station } from '../stores/stations'

const authStore = useAuthStore()
const stationsStore = useStationsStore()

const stats = ref({
  totalStations: 0,
  activeStations: 0,
  inactiveStations: 0,
  maintenanceStations: 0
})

// Charts data
const connectorData = ref<{type: string, count: number}[]>([])
const statusData = ref<{status: string, count: number}[]>([])

onMounted(async () => {
  try {
    await stationsStore.fetchStations()
    
    // Calculate stats
    const stations = stationsStore.stations
    stats.value.totalStations = stations.length
    stats.value.activeStations = stations.filter(s => s.status === 'active').length
    stats.value.inactiveStations = stations.filter(s => s.status === 'inactive').length
    stats.value.maintenanceStations = stations.filter(s => s.status === 'maintenance').length
    
    // Calculate connector type distribution
    const connectorCounts = new Map<string, number>()
    stations.forEach(station => {
      const count = connectorCounts.get(station.connectorType) || 0
      connectorCounts.set(station.connectorType, count + 1)
    })
    
    connectorData.value = Array.from(connectorCounts.entries()).map(([type, count]) => ({ type, count }))
    
    // Status distribution
    statusData.value = [
      { status: 'Active', count: stats.value.activeStations },
      { status: 'Inactive', count: stats.value.inactiveStations },
      { status: 'Maintenance', count: stats.value.maintenanceStations }
    ]
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Welcome back, {{ authStore.user?.name }}! Here's an overview of your charging stations.
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Stations -->
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3">
              <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Stations
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats.totalStations }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Stations -->
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Active Stations
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats.activeStations }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Inactive Stations -->
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-md p-3">
              <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Inactive Stations
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats.inactiveStations }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance Stations -->
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3">
              <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Maintenance
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats.maintenanceStations }}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Stations -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Stations</h2>
      <div class="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Name</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Power (kW)</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Connector</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr v-if="stationsStore.stations.length === 0">
              <td colspan="5" class="py-4 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No charging stations found. 
                <router-link to="/stations/new" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Add your first station
                </router-link>
              </td>
            </tr>
            <tr v-for="station in stationsStore.stations.slice(0, 5)" :key="station._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
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
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4 text-center">
        <router-link 
          to="/stations"
          class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View all stations <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Add a new charging station</h3>
          <div class="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            <p>Create a new charging station in your network.</p>
          </div>
          <div class="mt-5">
            <router-link
              to="/stations/new"
              class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Add Station
            </router-link>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">View on map</h3>
          <div class="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            <p>Visualize all your charging stations on a map.</p>
          </div>
          <div class="mt-5">
            <router-link
              to="/stations/map"
              class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              View Map
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>