<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useStationsStore, type Station } from '../stores/stations'
import { useRouter } from 'vue-router'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const stationsStore = useStationsStore()
const isLoading = ref(true)
const isMapInitialized = ref(false)
const mapContainer = ref<HTMLElement | null>(null)
const selectedStation = ref<Station | null>(null)
let map: any = null
let markers: any[] = []

// Watch for map container and stations
watch([mapContainer, () => stationsStore.stations], async ([newContainer, stations]) => {
  if (newContainer && stations.length > 0 && !isMapInitialized.value) {
    await initializeMap()
  }
}, { immediate: true })

const initializeMap = async () => {
  if (!mapContainer.value) return

  try {
    const L = (await import('leaflet')).default
    
    // Fix icon paths
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    })
    
    const defaultCenter = [39.8283, -98.5795]
    const firstStation = stationsStore.stations[0]
    const mapCenter = firstStation 
      ? [firstStation.location.lat, firstStation.location.lng] 
      : defaultCenter
    
    map = L.map(mapContainer.value, {
      center: mapCenter,
      zoom: 5,
      zoomControl: true
    })
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map)
    
    addStationMarkers(L)
    isMapInitialized.value = true
  } catch (error) {
    console.error('Error initializing map:', error)
  }
}

onMounted(async () => {
  await loadStations()
  isLoading.value = false
})

onUnmounted(() => {
  if (map) map.remove()
})

const loadStations = async () => {
  try {
    await stationsStore.fetchStations()
  } catch (error) {
    console.error('Failed to load stations:', error)
  }
}

const addStationMarkers = (L: any) => {
  if (markers.length) {
    markers.forEach(marker => marker.remove())
    markers = []
  }
  
  stationsStore.stations.forEach(station => {
    const marker = L.marker([station.location.lat, station.location.lng])
      .addTo(map)
      .on('click', () => {
        showStationDetails(station)
        map.closePopup()
      })
    
    marker.bindPopup(`
      <b>${station.name}</b><br>
      ${station.address}<br>
      Power: ${station.powerOutput} kW<br>
      Connector: ${station.connectorType}
    `)
    
    markers.push(marker)
  })
  
  if (markers.length > 0) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.1))
  }
}

const showStationDetails = (station: Station) => {
  selectedStation.value = station
}

const closeStationDetails = () => {
  selectedStation.value = null
}

const editStation = (stationId: string | undefined) => {
  if (stationId) router.push(`/stations/edit/${stationId}`)
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Map View</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Interactive map of all charging stations in your network.
      </p>
    </div>
    
    <div class="relative">
      <div v-if="isLoading" class="flex items-center justify-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
      
      <div v-else class="h-[600px] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        <div 
          ref="mapContainer" 
          class="h-full w-full"
          style="min-height: 600px; position: relative; z-index: 1;"
        ></div>
      </div>
      
      <div 
        v-if="selectedStation"
        class="absolute top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg transform transition-transform ease-in-out duration-300"
        style="z-index: 1000;"
      >
        <div class="p-4 h-full flex flex-col">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Station Details</h2>
            <button 
              @click="closeStationDetails"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mt-4 flex-grow overflow-y-auto">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                <p class="mt-1 text-base text-gray-900 dark:text-white">{{ selectedStation.name }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                <p class="mt-1 text-base text-gray-900 dark:text-white">{{ selectedStation.address }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Coordinates</h3>
                <p class="mt-1 text-base text-gray-900 dark:text-white">
                  {{ selectedStation.location.lat.toFixed(6) }}, {{ selectedStation.location.lng.toFixed(6) }}
                </p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <p class="mt-1">
                  <span 
                    class="inline-flex rounded-full px-2 text-xs font-semibold leading-5" 
                    :class="getStatusStyle(selectedStation.status)"
                  >
                    {{ selectedStation.status.charAt(0).toUpperCase() + selectedStation.status.slice(1) }}
                  </span>
                </p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Power Output</h3>
                <p class="mt-1 text-base text-gray-900 dark:text-white">{{ selectedStation.powerOutput }} kW</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Connector Type</h3>
                <p class="mt-1 text-base text-gray-900 dark:text-white">{{ selectedStation.connectorType }}</p>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              @click="editStation(selectedStation._id)"
              class="flex-1 inline-flex justify-center items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marker-pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -15px 0 0 -15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.marker-dot {
  width: 14px;
  height: 14px;
  margin: 8px 0 0 8px;
  background: #fff;
  position: absolute;
  border-radius: 50%;
}

.custom-div-icon {
  background: none;
  border: none;
}

/* Ensure map container is visible */
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  min-height: 600px;
  z-index: 1;
}

:deep(.leaflet-control-container) {
  z-index: 2;
}

:deep(.leaflet-marker-icon) {
  background: none;
  border: none;
}

/* Add transition for sidebar */
.station-details-enter-active,
.station-details-leave-active {
  transition: transform 0.3s ease-in-out;
}

.station-details-enter-from,
.station-details-leave-to {
  transform: translateX(100%);
}
</style>